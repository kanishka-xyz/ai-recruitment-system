"""
matching/search.py

Candidate search pipeline:

1. Fetch candidates
2. Calculate semantic similarity locally
3. Preselect the most relevant candidates
4. Run full contextual evaluation on shortlisted candidates
5. Rank by contextual overall suitability
6. Return JSON-safe candidate data
"""

from sklearn.metrics.pairwise import cosine_similarity
from bson import ObjectId

from matching.embedding import create_embedding
from matching.text_converter import resume_to_text, jd_to_text
from matching.ranking import calculate_ranking

from ats.ats_service import get_candidates


# =========================================================
# JSON SAFE CONVERTER
# =========================================================

def make_json_safe(value):
    """
    Recursively converts MongoDB/Python values into
    values FastAPI can safely serialize.
    """

    if isinstance(value, ObjectId):
        return str(value)

    if isinstance(value, dict):
        return {
            key: make_json_safe(item)
            for key, item in value.items()
        }

    if isinstance(value, (list, tuple)):
        return [
            make_json_safe(item)
            for item in value
        ]

    # Handles numpy scalar values if they appear
    if hasattr(value, "item"):
        try:
            return value.item()
        except Exception:
            pass

    return value


# =========================================================
# CANDIDATE SEARCH
# =========================================================

def search_candidates(jd_json):

    print("\n" + "=" * 60)
    print("JD RECEIVED")
    print("=" * 60)
    print(jd_json)

    # =====================================================
    # 1. JD -> TEXT
    # =====================================================

    jd_text = jd_to_text(jd_json)

    # =====================================================
    # 2. CREATE JD EMBEDDING
    # =====================================================

    jd_embedding = create_embedding(
        jd_text
    )

    # =====================================================
    # 3. FETCH CANDIDATES
    # =====================================================

    resumes = get_candidates(
        jd_json
    )

    print(
        f"\nCandidates fetched: {len(resumes)}"
    )

    # =====================================================
# REMOVE DUPLICATE CANDIDATES
# =====================================================

    unique_resumes = []
    seen_candidates = set()

    for resume in resumes:

        # Prefer email because it should uniquely identify
        # a candidate. Fall back to phone, then name.
        unique_key = (
            str(resume.get("email", "")).strip().lower()
            or str(resume.get("phone", "")).strip()
            or str(resume.get("name", "")).strip().lower()
            or str(resume.get("candidate", "")).strip().lower()
            or str(resume.get("_id", ""))
        )

        if unique_key not in seen_candidates:
            seen_candidates.add(unique_key)
            unique_resumes.append(resume)

    resumes = unique_resumes

    print(
        f"Candidates after duplicate removal: {len(resumes)}"
    )

    # =====================================================
    # 4. LOCAL PRESELECTION
    # =====================================================
    #
    # IMPORTANT:
    #
    # Gemini is NOT called here.
    #
    # Semantic similarity is only being used to reduce
    # the candidate pool before the expensive contextual
    # evaluation.
    #
    # It is NOT the final ATS score.
    # =====================================================

    preliminary_candidates = []

    for resume in resumes:

        try:

            # ---------------------------------------------
            # Resume -> text
            # ---------------------------------------------

            resume_text = resume_to_text(
                resume
            )

            # ---------------------------------------------
            # Resume embedding
            # ---------------------------------------------

            resume_embedding = create_embedding(
                resume_text
            )

            # ---------------------------------------------
            # Semantic similarity
            # ---------------------------------------------

            similarity = float(
                cosine_similarity(
                    [resume_embedding],
                    [jd_embedding]
                )[0][0]
            )

            preliminary_candidates.append(
                {
                    "resume": resume,
                    "semantic_similarity": similarity
                }
            )

        except Exception as e:

            candidate_name = (
                resume.get("name")
                or resume.get("candidate")
                or resume.get("candidate_name")
                or resume.get("full_name")
                or resume.get("personal_info", {}).get("name")
                or "Unknown Candidate"
            )

            print(
                f"Preselection error for "
                f"{candidate_name}: {e}"
            )

    # =====================================================
    # 5. SORT PRELIMINARY CANDIDATES
    # =====================================================

    preliminary_candidates.sort(
        key=lambda candidate:
        candidate["semantic_similarity"],
        reverse=True
    )

    # =====================================================
    # 6. TAKE TOP 5 FOR CONTEXTUAL EVALUATION
    # =====================================================
    #
    # TEMPORARY DEMO/QUOTA CONTROL.
    #
    # Once API limits allow more calls, this can be
    # increased or removed.
    # =====================================================

    CONTEXTUAL_LIMIT = 5

    shortlisted = preliminary_candidates[
        :CONTEXTUAL_LIMIT
    ]

    print(
        f"Candidates selected for contextual evaluation: "
        f"{len(shortlisted)}"
    )

    print("\nPreselected candidates:")

    for index, item in enumerate(
        shortlisted,
        start=1
    ):

        resume = item["resume"]

        print(
            f"{index}. "
            f"{resume.get('name', 'Unknown Candidate')} "
            f"- Semantic: "
            f"{round(item['semantic_similarity'] * 100, 2)}%"
        )

    # =====================================================
    # 7. FULL CONTEXTUAL EVALUATION
    # =====================================================
    #
    # calculate_ranking() should now:
    #
    # 1. Build structured evidence
    # 2. Call contextual_evaluator.py
    # 3. Let Gemini evaluate the complete candidate
    # 4. Return overall contextual fit
    #
    # NO fixed final weights are applied here.
    # =====================================================

    results = []

    for item in shortlisted:

        resume = item["resume"]

        similarity = item[
            "semantic_similarity"
        ]

        candidate_name = (
            resume.get("name")
            or resume.get("candidate")
            or "Unknown Candidate"
        )

        print("\n" + "-" * 60)
        print(
            f"Contextually evaluating: {candidate_name}"
        )
        print("-" * 60)

        try:

            candidate = calculate_ranking(
                jd=jd_json,
                resume=resume,
                semantic_score=similarity
            )

            # ---------------------------------------------
            # Store semantic similarity separately
            # ---------------------------------------------

            candidate[
                "semantic_score"
            ] = round(
                similarity * 100,
                2
            )

            # ---------------------------------------------
            # Attach EXACT resume from DB
            # ---------------------------------------------

            candidate["resume"] = resume

            # ---------------------------------------------
            # Add result
            # ---------------------------------------------

            results.append(
                candidate
            )

            print(
                "Overall Fit:",
                candidate.get(
                    "overall_score",
                    0
                )
            )

            print(
                "Recommendation:",
                candidate.get(
                    "recommendation",
                    "N/A"
                )
            )

            print(
                "Confidence:",
                candidate.get(
                    "confidence",
                    "N/A"
                )
            )

        except Exception as e:

            print(
                f"Contextual evaluation failed for "
                f"{candidate_name}: {e}"
            )

            failed_candidate = {

                "evaluation_status":
                    "failed",

                "overall_score":
                    None,

                "recommendation":
                    "Evaluation Unavailable",

                "confidence":
                    "N/A",

                "role_fit":
                    "Contextual evaluation unavailable",

                "reason":
                    "The AI contextual evaluation could "
                    "not be completed because the evaluation "
                    "service was temporarily unavailable.",

                "strengths": [],

                "gaps": [],

                "compensating_factors": [],

                "critical_requirements_missing": [],

                "factor_analysis": {},

                "breakdown": {},

                "gap_analysis": {},

                "explanation": {},

                "semantic_score": round(
                    similarity * 100,
                    2
                ),

                "resume":
                    resume
            }

            results.append(
                failed_candidate
            )

                # IMPORTANT:
                # Do not create a fake contextual score.
                # If Gemini fails, skip that candidate from
                # final contextual ranking.

            continue

    # =====================================================
    # 8. SORT BY FINAL OVERALL CONTEXTUAL SCORE
    # =====================================================

    results.sort(
        key=lambda candidate: float(
             candidate.get("overall_score") or 0
        ),
        reverse=True
    )

    # =====================================================
    # 9. DEBUG FINAL RANKING
    # =====================================================

    print("\n" + "=" * 60)
    print("FINAL CONTEXTUAL RANKING")
    print("=" * 60)

    for index, candidate in enumerate(
        results,
        start=1
    ):

        resume = candidate.get(
            "resume",
            {}
        )

        print(
            f"\n{index}. "
            f"{resume.get('name', 'Unknown Candidate')}"
        )

        print(
            "Overall Fit:",
            candidate.get(
                "overall_score",
                0
            )
        )

        print(
            "Recommendation:",
            candidate.get(
                "recommendation",
                "N/A"
            )
        )

        print(
            "Confidence:",
            candidate.get(
                "confidence",
                "N/A"
            )
        )

        print(
            "Role Fit:",
            candidate.get(
                "role_fit",
                "N/A"
            )
        )

        print(
            "Semantic Similarity:",
            candidate.get(
                "semantic_score",
                0
            )
        )

        print(
            "Reason:",
            candidate.get(
                "reason",
                "N/A"
            )
        )

    # =====================================================
    # 10. CONVERT MongoDB ObjectId -> STRING
    # =====================================================

    safe_results = make_json_safe(
        results
    )

    # =====================================================
    # 11. RETURN
    # =====================================================

    return safe_results