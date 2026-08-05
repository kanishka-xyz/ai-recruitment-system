"""
matching/decision.py

Makes final recommendation using the COMPLETE
ATS evaluation rather than one individual parameter.
"""


def make_decision(score, breakdown, jd):

    skill_data = breakdown.get(
        "skills",
        {}
    )

    skill_score = skill_data.get(
        "score",
        0
    )

    mandatory_match = skill_data.get(
        "mandatory_match_percent",
        skill_score
    )

    priority_scores = breakdown.get(
        "priority_scores",
        {}
    )

    skills_experience = priority_scores.get(
        "skills_experience",
        0
    )

    # =========================================
    # Initial Overall Decision
    # =========================================

    if score >= 80:

        recommendation = "Highly Recommended"
        confidence = "High"

    elif score >= 65:

        recommendation = "Recommended"
        confidence = "High"

    elif score >= 50:

        recommendation = "Consider"
        confidence = "Medium"

    else:

        recommendation = "Not Recommended"
        confidence = "High"

    # =========================================
    # Mandatory Skills Safeguard
    # =========================================

    if mandatory_match < 40:

        recommendation = "Not Recommended"
        confidence = "High"

        reason = (
            "Overall profile does not satisfy enough "
            "mandatory skills required for the role."
        )

        return {
            "recommendation": recommendation,
            "confidence": confidence,
            "reason": reason
        }

    # Candidate cannot become Highly Recommended
    # with weak mandatory skill coverage.

    if (
        mandatory_match < 60
        and recommendation == "Highly Recommended"
    ):

        recommendation = "Recommended"
        confidence = "Medium"

    # =========================================
    # Priority-1 Safeguard
    # =========================================

    if (
        skills_experience < 50
        and recommendation == "Highly Recommended"
    ):

        recommendation = "Recommended"
        confidence = "Medium"

    # =========================================
    # Explanation
    # =========================================

    reason = (
        f"Overall ATS score: {score}%. "
        f"Skill score: {round(skill_score, 2)}%. "
        f"Mandatory skill match: "
        f"{round(mandatory_match, 2)}%. "
        f"Skills + Experience priority score: "
        f"{round(skills_experience, 2)}%. "
        f"Recommendation is based on the complete "
        f"candidate profile."
    )

    return {
        "recommendation": recommendation,
        "confidence": confidence,
        "reason": reason
    }