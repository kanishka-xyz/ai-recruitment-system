"""
matching/ranking.py

Collects structured candidate evidence and performs
contextual candidate evaluation.

IMPORTANT:
The final candidate recommendation is contextual.
No fixed final weights are used.
"""

from matching.skills import skill_match_score
from matching.experience import experience_match_score
from matching.education import education_match_score
from matching.projects import project_match_score
from matching.certifications import certification_match_score
from matching.achievements import achievement_match_score
from matching.internships import internship_match_score

from matching.explanation import generate_explanation
from matching.gap_analysis import analyze_gaps

from matching.contextual_evaluator import contextual_evaluate


def calculate_ranking(
    jd,
    resume,
    semantic_score=0
):
    """
    Evaluate candidate suitability for a specific JD.

    Individual matching modules provide structured evidence.

    Gemini then evaluates the complete candidate profile
    contextually instead of applying fixed final weights.
    """

    # =====================================================
    # 1. COLLECT STRUCTURED EVIDENCE
    # =====================================================

    skill_result = skill_match_score(
        jd,
        resume
    )

    experience_result = experience_match_score(
        jd,
        resume
    )

    education_result = education_match_score(
        jd,
        resume
    )

    project_result = project_match_score(
        jd,
        resume
    )

    certification_result = certification_match_score(
        jd,
        resume
    )

    achievement_result = achievement_match_score(
        jd,
        resume
    )

    internship_result = internship_match_score(
        jd,
        resume
    )

    # =====================================================
    # 2. SEMANTIC SCORE
    # =====================================================

    try:
        semantic_percentage = round(
            float(semantic_score) * 100,
            2
        )
    except (TypeError, ValueError):
        semantic_percentage = 0

    # =====================================================
    # 3. COMPLETE EVIDENCE OBJECT
    # =====================================================

    breakdown = {
        "skills": skill_result,
        "experience": experience_result,
        "projects": project_result,
        "education": education_result,
        "certifications": certification_result,
        "achievements": achievement_result,
        "internships": internship_result,
        "semantic_similarity": semantic_percentage
    }

    # =====================================================
    # 4. CONTEXTUAL AI EVALUATION
    # =====================================================
    #
    # IMPORTANT:
    #
    # Do NOT convert Gemini/API failure into:
    #
    # score = 0
    # recommendation = Consider
    #
    # API failure is NOT a recruitment decision.
    #
    # If contextual_evaluate() fails, the exception is
    # intentionally allowed to propagate to search.py.
    # =====================================================

    contextual_result = contextual_evaluate(
        jd=jd,
        resume=resume,
        evidence=breakdown,
        semantic_score=semantic_percentage
    )

    # =====================================================
    # 5. VALIDATE CONTEXTUAL RESULT
    # =====================================================

    if not isinstance(
        contextual_result,
        dict
    ):
        raise ValueError(
            "Contextual evaluator returned "
            "an invalid result."
        )

    overall_score = contextual_result.get(
        "overall_fit_score"
    )

    if overall_score is None:
        raise ValueError(
            "Contextual evaluator did not return "
            "overall_fit_score."
        )

    try:
        overall_score = float(
            overall_score
        )
    except (TypeError, ValueError):
        raise ValueError(
            "Invalid overall_fit_score returned "
            "by contextual evaluator."
        )

    overall_score = round(
        max(
            0,
            min(overall_score, 100)
        ),
        2
    )

    # =====================================================
    # 6. DETERMINISTIC GAP ANALYSIS
    # =====================================================

    try:

        gap_analysis = analyze_gaps(
            jd,
            resume,
            breakdown
        )

    except Exception as e:

        print(
            "Gap analysis error:",
            e
        )

        gap_analysis = {}

    # =====================================================
    # 7. DETERMINISTIC EXPLANATION
    # =====================================================

    try:

        explanation = generate_explanation(
            breakdown
        )

    except Exception as e:

        print(
            "Explanation error:",
            e
        )

        explanation = {}

    # =====================================================
    # 8. FINAL RESULT
    # =====================================================

    return {

        # -----------------------------------------
        # Evaluation status
        # -----------------------------------------

        "evaluation_status":
            contextual_result.get(
                "evaluation_status",
                "completed"
            ),

        # -----------------------------------------
        # FINAL contextual score
        # -----------------------------------------

        "overall_score":
            overall_score,

        # -----------------------------------------
        # Final AI recommendation
        # -----------------------------------------

        "recommendation":
            contextual_result.get(
                "recommendation",
                "Consider"
            ),

        "confidence":
            contextual_result.get(
                "confidence",
                "Low"
            ),

        "role_fit":
            contextual_result.get(
                "role_fit",
                ""
            ),

        "reason":
            contextual_result.get(
                "reason",
                ""
            ),

        # -----------------------------------------
        # Contextual evidence
        # -----------------------------------------

        "strengths":
            contextual_result.get(
                "strengths",
                []
            ),

        "gaps":
            contextual_result.get(
                "gaps",
                []
            ),

        "compensating_factors":
            contextual_result.get(
                "compensating_factors",
                []
            ),

        "critical_requirements_missing":
            contextual_result.get(
                "critical_requirements_missing",
                []
            ),

        # -----------------------------------------
        # Contextual factor explanations
        # -----------------------------------------

        "factor_analysis":
            contextual_result.get(
                "factor_analysis",
                {}
            ),

        # -----------------------------------------
        # Deterministic supporting evidence
        # -----------------------------------------

        "breakdown":
            breakdown,

        "gap_analysis":
            gap_analysis,

        "explanation":
            explanation,

        # -----------------------------------------
        # Semantic similarity is supporting
        # evidence, NOT final ATS score
        # -----------------------------------------

        "semantic_score":
            semantic_percentage
    }