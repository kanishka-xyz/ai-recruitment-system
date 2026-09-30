import time
from concurrent.futures import ThreadPoolExecutor, as_completed

from sklearn.metrics.pairwise import cosine_similarity
from bson import ObjectId

from matching.embedding import create_embedding
from matching.text_converter import resume_to_text, jd_to_text
from matching.ranking import calculate_ranking
from database.mongodb import resume_collection


# ============================================================
# JSON SAFE CONVERSION
# ============================================================

def make_json_safe(obj):

    if isinstance(obj, ObjectId):
        return str(obj)

    if isinstance(obj, dict):
        return {
            key: make_json_safe(value)
            for key, value in obj.items()
        }

    if isinstance(obj, list):
        return [
            make_json_safe(value)
            for value in obj
        ]

    if isinstance(obj, tuple):
        return [
            make_json_safe(value)
            for value in obj
        ]

    # numpy scalar
    if hasattr(obj, "item"):
        try:
            return obj.item()
        except Exception:
            pass

    return obj


# ============================================================
# FETCH CANDIDATES FROM MONGODB
# ============================================================

def get_candidates(jd_json):

    """
    Fetch resumes from MongoDB.

    Currently retrieves resumes that have been processed
    and stored in the resume collection.

    JD-based filtering/ranking is handled later through
    semantic matching and contextual evaluation.
    """

    try:

        # Fetch resumes with embeddings
        candidates = list(
            resume_collection.find(
                {
                    "embedding": {
                        "$exists": True,
                        "$ne": None
                    }
                }
            )
        )

        return candidates

    except Exception as e:

        print(f"❌ MongoDB candidate fetch failed: {e}")

        return []


# ============================================================
# CONTEXTUAL EVALUATION WORKER
# ============================================================

def evaluate_candidate(candidate_data):

    index = candidate_data["index"]
    resume = candidate_data["resume"]
    semantic_score = candidate_data["semantic_score"]
    jd_json = candidate_data["jd_json"]

    candidate_name = (
        resume.get("candidate_name")
        or resume.get("name")
        or resume.get("candidate")
        or "Unknown Candidate"
    )

    print()
    print("-" * 70)
    print(
        f"Candidate {index} | {candidate_name}"
    )
    print("-" * 70)

    start_time = time.perf_counter()

    try:

        # ====================================================
        # CONTEXTUAL GEMINI EVALUATION
        # ====================================================

        result = calculate_ranking(
            jd=jd_json,
            resume=resume,
            semantic_score=semantic_score
        )

        elapsed = time.perf_counter() - start_time

        print(
            f"⏱️ Contextual evaluation: "
            f"{elapsed:.2f} sec"
        )

        if not isinstance(result, dict):

            raise ValueError(
                "calculate_ranking() did not return a dictionary"
            )

        # ----------------------------------------------------
        # ATTACH SEMANTIC SCORE
        # ----------------------------------------------------

        result["semantic_score"] = semantic_score

        # ----------------------------------------------------
        # NORMALIZE CANDIDATE IDENTITY
        #
        # Keep the parsed resume as the source of truth, but also
        # expose the core identity fields at the result level.
        # This keeps API consumers, logs and the details page
        # consistent with the evaluated candidate.
        # ----------------------------------------------------

        result["candidate_name"] = (
            resume.get("candidate_name")
            or resume.get("name")
            or resume.get("full_name")
            or resume.get("candidate")
            or "Unknown Candidate"
        )

        for field in (
            "email",
            "phone",
            "location",
            "current_role",
            "current_company",
            "total_experience_years",
            "skills",
            "technical_skills",
            "education",
            "certifications",
            "projects",
            "internships",
            "achievements",
            "resume_file",
            "source",
        ):
            if result.get(field) in (None, ""):
                if field in resume:
                    result[field] = resume[field]

        # ----------------------------------------------------
        # ATTACH ORIGINAL RESUME
        # ----------------------------------------------------

        result["resume"] = resume

        # ----------------------------------------------------
        # TIMING
        # ----------------------------------------------------

        result["_contextual_time"] = round(
            elapsed,
            2
        )

        print(
            f"Overall Fit: "
            f"{result.get('overall_score', 0)}"
        )

        print(
            f"Recommendation: "
            f"{result.get('recommendation', 'Under Review')}"
        )

        print(
            f"Confidence: "
            f"{result.get('confidence', 'Unknown')}"
        )

        return result

    except Exception as e:

        elapsed = time.perf_counter() - start_time

        print(
            f"❌ Contextual evaluation failed "
            f"after {elapsed:.2f} sec"
        )

        print(
            f"Error: {str(e)}"
        )

        # ----------------------------------------------------
        # DO NOT INVENT A SCORE
        # ----------------------------------------------------

        return {
            "candidate_name": candidate_name,
            "overall_score": 0,
            "recommendation": "Evaluation Failed",
            "confidence": "Low",
            "role_fit": "",
            "reason": (
                "Contextual evaluation could not be completed."
            ),
            "strengths": [],
            "gaps": [],
            "compensating_factors": [],
            "critical_missing": [],
            "factor_analysis": {},

            "semantic_score": semantic_score,

            "resume": resume,

            "evaluation_status": "failed",

            "evaluation_error": str(e),

            "_contextual_time": round(
                elapsed,
                2
            )
        }


# ============================================================
# MAIN SEARCH FUNCTION
# ============================================================

def search_candidates(jd_json):

    total_start = time.perf_counter()

    print()
    print("=" * 70)
    print("🔎 CANDIDATE SEARCH STARTED")
    print("=" * 70)

    # ========================================================
    # JD TEXT CONVERSION
    # ========================================================

    start = time.perf_counter()

    jd_text = jd_to_text(jd_json)

    print(
        f"📝 JD text conversion          : "
        f"{time.perf_counter() - start:.2f} sec"
    )

    # ========================================================
    # JD EMBEDDING
    # ========================================================

    start = time.perf_counter()

    jd_embedding = create_embedding(
        jd_text
    )

    print(
        f"🧠 JD embedding creation       : "
        f"{time.perf_counter() - start:.2f} sec"
    )

    # ========================================================
    # FETCH RESUMES FROM MONGODB
    # ========================================================

    start = time.perf_counter()

    resumes = get_candidates(
        jd_json
    )

    print(
        f"🍃 MongoDB candidate fetch      : "
        f"{time.perf_counter() - start:.2f} sec"
    )

    print(
        f"   Candidates fetched           : "
        f"{len(resumes)}"
    )

    # ========================================================
    # DUPLICATE REMOVAL
    # ========================================================

    start = time.perf_counter()

    unique_resumes = []
    seen = set()

    for resume in resumes:

        identifier = (
            resume.get("email")
            or resume.get("phone")
            or resume.get("candidate_name")
            or resume.get("name")
            or resume.get("candidate")
            or str(resume.get("_id"))
        )

        identifier = str(
            identifier
        ).strip().lower()

        if not identifier:
            identifier = str(
                resume.get("_id")
            )

        if identifier in seen:
            continue

        seen.add(identifier)

        unique_resumes.append(
            resume
        )

    resumes = unique_resumes

    print(
        f"🔄 Duplicate removal            : "
        f"{time.perf_counter() - start:.2f} sec"
    )

    print(
        f"   Candidates after removal     : "
        f"{len(resumes)}"
    )

    # ========================================================
    # SEMANTIC MATCHING
    # ========================================================

    print()
    print("-" * 70)
    print("🧠 SEMANTIC MATCHING STARTED")
    print("-" * 70)

    semantic_start = time.perf_counter()

    preliminary_candidates = []

    for index, resume in enumerate(
        resumes,
        start=1
    ):

        candidate_start = time.perf_counter()

        try:

            # ------------------------------------------------
            # If MongoDB already contains an embedding,
            # use it directly.
            # ------------------------------------------------

            stored_embedding = resume.get(
                "embedding"
            )

            if stored_embedding:

                resume_embedding = stored_embedding

            else:

                resume_text = resume_to_text(
                    resume
                )

                resume_embedding = create_embedding(
                    resume_text
                )

            # ------------------------------------------------
            # Cosine similarity
            # ------------------------------------------------

            similarity = cosine_similarity(
                [jd_embedding],
                [resume_embedding]
            )[0][0]

            semantic_score = float(
                similarity * 100
            )

            preliminary_candidates.append({
                "resume": resume,
                "semantic_score": semantic_score
            })

            candidate_name = (
                resume.get("candidate_name")
                or resume.get("name")
                or resume.get("candidate")
                or "Unknown Candidate"
            )

            candidate_time = (
                time.perf_counter()
                - candidate_start
            )

            print(
                f"   Candidate {index:02d} | "
                f"{candidate_name} | "
                f"Semantic: {semantic_score:.2f}% | "
                f"Time: {candidate_time:.2f} sec"
            )

        except Exception as e:

            print(
                f"   ❌ Candidate {index} "
                f"semantic matching failed: {e}"
            )

    semantic_elapsed = (
        time.perf_counter()
        - semantic_start
    )

    print("-" * 70)

    print(
        f"⏱️ TOTAL SEMANTIC MATCHING     : "
        f"{semantic_elapsed:.2f} sec"
    )

    print("-" * 70)

    # ========================================================
    # SORT BY SEMANTIC SCORE
    # ========================================================

    start = time.perf_counter()

    preliminary_candidates.sort(
        key=lambda x: x["semantic_score"],
        reverse=True
    )

    print(
        f"📊 Semantic sorting             : "
        f"{time.perf_counter() - start:.2f} sec"
    )

    # ========================================================
    # SELECT TOP 5
    # ========================================================

    start = time.perf_counter()

    CONTEXTUAL_LIMIT = 5

    selected_candidates = (
        preliminary_candidates[
            :CONTEXTUAL_LIMIT
        ]
    )

    print(
        f"🎯 Candidate selection          : "
        f"{time.perf_counter() - start:.2f} sec"
    )

    print(
        f"   Candidates selected for "
        f"contextual evaluation: "
        f"{len(selected_candidates)}"
    )

    print()
    print("Preselected candidates:")

    for index, candidate in enumerate(
        selected_candidates,
        start=1
    ):

        resume = candidate["resume"]

        candidate_name = (
            resume.get("candidate_name")
            or resume.get("name")
            or resume.get("candidate")
            or "Unknown Candidate"
        )

        print(
            f"{index}. {candidate_name} - "
            f"Semantic: "
            f"{candidate['semantic_score']:.2f}%"
        )

    # ========================================================
    # PREPARE CONTEXTUAL TASKS
    # ========================================================

    tasks = []

    for index, candidate in enumerate(
        selected_candidates,
        start=1
    ):

        tasks.append({
            "index": index,
            "resume": candidate["resume"],
            "semantic_score": candidate["semantic_score"],
            "jd_json": jd_json
        })

    # ========================================================
    # CONCURRENT CONTEXTUAL EVALUATION
    # ========================================================

    print()
    print("=" * 70)
    print("🤖 CONCURRENT CONTEXTUAL GEMINI EVALUATION")
    print("=" * 70)

    contextual_start = time.perf_counter()

    results = []

    # Maximum 5 because we only evaluate top 5
    max_workers = min(
        5,
        len(tasks)
    )

    if max_workers > 0:

        with ThreadPoolExecutor(
            max_workers=max_workers
        ) as executor:

            futures = [
                executor.submit(
                    evaluate_candidate,
                    task
                )
                for task in tasks
            ]

            for future in as_completed(
                futures
            ):

                try:

                    result = future.result()

                    results.append(
                        result
                    )

                except Exception as e:

                    print(
                        f"❌ Worker failed: {e}"
                    )

    contextual_elapsed = (
        time.perf_counter()
        - contextual_start
    )

    print()
    print("-" * 70)

    print(
        f"⏱️ TOTAL CONTEXTUAL EVALUATION: "
        f"{contextual_elapsed:.2f} sec"
    )

    print("-" * 70)

    # ========================================================
    # FINAL RANKING
    # ========================================================

    start = time.perf_counter()

    results.sort(
        key=lambda x: float(
            x.get(
                "overall_score",
                0
            )
        ),
        reverse=True
    )

    print(
        f"📊 Final ranking sorting        : "
        f"{time.perf_counter() - start:.2f} sec"
    )

    # ========================================================
    # FINAL RANKING DISPLAY
    # ========================================================

    print()
    print("=" * 70)
    print("🏆 FINAL CONTEXTUAL RANKING")
    print("=" * 70)

    for index, result in enumerate(
        results,
        start=1
    ):

        candidate_name = (
            result.get("candidate_name")
            or result.get("name")
            or result.get("resume", {}).get(
                "candidate_name",
                "Unknown Candidate"
            )
        )

        print()
        print(
            f"{index}. {candidate_name}"
        )

        print(
            f"Overall Fit: "
            f"{result.get('overall_score', 0)}"
        )

        print(
            f"Recommendation: "
            f"{result.get('recommendation', 'Under Review')}"
        )

        print(
            f"Confidence: "
            f"{result.get('confidence', 'Unknown')}"
        )

        print(
            f"Role Fit: "
            f"{result.get('role_fit', '')}"
        )

        print(
            f"Semantic Similarity: "
            f"{result.get('semantic_score', 0):.2f}"
        )

        print(
            f"Reason: "
            f"{result.get('reason', '')}"
        )

    # ========================================================
    # JSON SAFE CONVERSION
    # ========================================================

    start = time.perf_counter()

    results = make_json_safe(
        results
    )

    print()
    print(
        f"🔄 JSON conversion              : "
        f"{time.perf_counter() - start:.2f} sec"
    )

    # ========================================================
    # TOTAL TIME
    # ========================================================

    total_elapsed = (
        time.perf_counter()
        - total_start
    )

    print()
    print("=" * 70)

    print(
        f"⏱️ TOTAL /search_candidates() : "
        f"{total_elapsed:.2f} sec"
    )

    print("=" * 70)

    print(
        "✅ CANDIDATE SEARCH COMPLETED"
    )

    print("=" * 70)

    return results