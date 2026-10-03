import re
from difflib import SequenceMatcher

from bson import ObjectId
from sklearn.metrics.pairwise import cosine_similarity

from database.mongodb import resume_collection
from matching.embedding import create_embedding
from .utils import calculate_sha256, create_finding, make_json_safe, normalize_text


def _token_ngrams(text, n=5):
    tokens = re.findall(r"[a-z0-9+#.]+", normalize_text(text))
    if len(tokens) < n:
        return set()
    return {" ".join(tokens[i:i+n]) for i in range(len(tokens) - n + 1)}


def _jaccard(a, b):
    if not a or not b:
        return 0.0
    union = len(a | b)
    return len(a & b) / union if union else 0.0


def _extract_section_strings(resume, key):
    result = []
    values = resume.get(key) or []
    if not isinstance(values, list):
        values = [values]
    for item in values:
        if isinstance(item, dict):
            value = " ".join(
                str(item.get(name) or "")
                for name in ("title", "name", "role", "company", "description", "details", "project", "organization")
            )
        else:
            value = str(item)
        value = normalize_text(value)
        if len(value) >= 40:
            result.append(value)
    return result


def _legacy_file_hash(record):
    try:
        value = record.get("resume_path")
        if not value:
            return None
        return calculate_sha256(value)
    except Exception:
        return None


def analyze_duplicate_and_plagiarism(resume_id, resume, file_path, extracted_text):
    current_hash = calculate_sha256(file_path)
    findings = []

    query = {"file_hash": current_hash}
    current_object_id = None
    try:
        current_object_id = ObjectId(str(resume_id))
        query["_id"] = {"$ne": current_object_id}
    except Exception:
        pass

    exact_matches = list(
        resume_collection.find(
            query,
            {"_id": 1, "candidate_name": 1, "resume_file": 1, "file_hash": 1},
        ).limit(10)
    )

    if not exact_matches:
        cursor = resume_collection.find(
            {"source": "internal_database"},
            {"_id": 1, "candidate_name": 1, "resume_file": 1, "resume_path": 1, "file_hash": 1},
        ).limit(100)
        for candidate in cursor:
            if current_object_id and candidate.get("_id") == current_object_id:
                continue
            if candidate.get("file_hash"):
                continue
            candidate_hash = _legacy_file_hash(candidate)
            if candidate_hash and candidate_hash == current_hash:
                exact_matches.append(candidate)

    if exact_matches:
        refs = [
            f"{match.get('candidate_name') or 'Unknown Candidate'} ({match.get('resume_file') or 'resume'})"
            for match in exact_matches
        ]
        findings.append(
            create_finding(
                "duplicate_detection",
                "Potentially Inconsistent",
                "The uploaded resume file is byte-for-byte identical to another resume in the internal database.",
                refs[:6],
                0.99,
                "Confirm whether this is an intentional duplicate submission or the same candidate record.",
            )
        )

    raw_embedding = resume.get("embedding")
    if raw_embedding:
        current_embedding = raw_embedding
    else:
        current_embedding = create_embedding(extracted_text)

    candidates = list(
        resume_collection.find(
            {
                "source": "internal_database",
                "embedding": {"$exists": True, "$ne": None},
            },
            {
                "_id": 1,
                "candidate_name": 1,
                "resume_file": 1,
                "embedding": 1,
                "resume_text": 1,
                "projects": 1,
                "experience": 1,
                "work_experience": 1,
            },
        ).limit(150)
    )

    ranked = []
    for candidate in candidates:
        if current_object_id and candidate.get("_id") == current_object_id:
            continue
        try:
            score = float(cosine_similarity([current_embedding], [candidate["embedding"]])[0][0])
            ranked.append((score, candidate))
        except Exception:
            continue

    ranked.sort(key=lambda item: item[0], reverse=True)

    if ranked and ranked[0][0] >= 0.92:
        top_score, top_candidate = ranked[0]
        findings.append(
            create_finding(
                "duplicate_detection",
                "Potentially Inconsistent" if top_score >= 0.96 else "Unverified",
                "The resume is highly similar to another resume already stored in the internal database.",
                [
                    f"Highest embedding cosine similarity: {top_score:.3f}.",
                    f"Comparison record: {top_candidate.get('candidate_name') or 'Unknown Candidate'} ({top_candidate.get('resume_file') or 'resume'}).",
                ],
                0.87 if top_score >= 0.96 else 0.64,
                "Review the compared records and confirm whether the similarity comes from a shared candidate or template.",
            )
        )

    current_ngrams = _token_ngrams(extracted_text)
    for score, candidate in ranked[:5]:
        other_text = str(candidate.get("resume_text") or "")
        text_similarity = _jaccard(current_ngrams, _token_ngrams(other_text))
        if text_similarity >= 0.72:
            findings.append(
                create_finding(
                    "plagiarism",
                    "Potentially Inconsistent",
                    "A large overlap of longer text fragments was detected against another internal resume.",
                    [
                        f"Embedding similarity: {score:.3f}.",
                        f"5-token shingle Jaccard overlap: {text_similarity:.3f}.",
                        f"Compared record: {candidate.get('candidate_name') or 'Unknown Candidate'} ({candidate.get('resume_file') or 'resume'}).",
                    ],
                    0.86,
                    "Review the overlapping passages and distinguish genuine shared experience from copied wording.",
                )
            )
            break

    current_sections = _extract_section_strings(resume, "projects") + _extract_section_strings(resume, "experience")
    if not current_sections:
        current_sections += _extract_section_strings(resume, "work_experience")

    best_section_match = None
    for _, candidate in ranked[:10]:
        other_sections = _extract_section_strings(candidate, "projects") + _extract_section_strings(candidate, "experience")
        if not other_sections:
            other_sections += _extract_section_strings(candidate, "work_experience")

        for left in current_sections:
            for right in other_sections:
                ratio = SequenceMatcher(None, left, right).ratio()
                if len(left) >= 60 and len(right) >= 60 and ratio >= 0.93:
                    best_section_match = (ratio, candidate)
                    break
            if best_section_match:
                break
        if best_section_match:
            break

    if best_section_match:
        ratio, candidate = best_section_match
        findings.append(
            create_finding(
                "plagiarism",
                "Potentially Inconsistent",
                "A project or experience description is extremely similar to wording in another internal resume.",
                [
                    f"Sequence similarity: {ratio:.3f}.",
                    f"Compared record: {candidate.get('candidate_name') or 'Unknown Candidate'}.",
                ],
                0.83,
                "Compare the source histories before treating the wording similarity as evidence of plagiarism.",
            )
        )

    words = re.findall(r"[a-z0-9+#.]+", normalize_text(extracted_text))
    word_count = len(words)
    claimed_terms = set()
    for field in ("skills", "technical_skills", "tools", "programming_languages", "certifications"):
        values = resume.get(field) or []
        if not isinstance(values, list):
            values = [values]
        for value in values:
            if isinstance(value, dict):
                value = value.get("name") or value.get("title") or value.get("skill")
            term = normalize_text(value)
            if term and len(term) >= 3:
                claimed_terms.add(term)

    repeated = []
    if word_count:
        for term in claimed_terms:
            occurrences = len(re.findall(r"(?<![a-z0-9])" + re.escape(term) + r"(?![a-z0-9])", normalize_text(extracted_text)))
            density = occurrences / word_count
            if occurrences >= 12 and density >= 0.03:
                repeated.append((term, occurrences, density))

    if repeated:
        details = [
            f"{term}: {occurrences} occurrences ({density:.1%} of tokens)"
            for term, occurrences, density in sorted(repeated, key=lambda x: x[1], reverse=True)[:5]
        ]
        findings.append(
            create_finding(
                "keyword_stuffing",
                "Potentially Inconsistent",
                "A few claimed skills occur unusually frequently in the resume text.",
                details,
                0.56,
                "Review the wording in context; repeated skills can be legitimate in technical resumes.",
            )
        )

    if not findings:
        status = "Verified"
        summary = "No duplicate, plagiarism, or keyword-stuffing signal exceeded the conservative review thresholds."
    elif any(f["status"] == "Potentially Inconsistent" for f in findings):
        status = "Potentially Inconsistent"
        summary = "At least one duplication/content-overlap signal requires review."
    else:
        status = "Unverified"
        summary = "Similarity signals exist, but they are not sufficient to establish copying."

    return {
        "status": status,
        "summary": summary,
        "checks": {
            "sha256": current_hash,
            "database_comparison_count": len(candidates),
            "top_semantic_similarity": ranked[0][0] if ranked else None,
        },
        "findings": [make_json_safe(item) for item in findings],
    }
