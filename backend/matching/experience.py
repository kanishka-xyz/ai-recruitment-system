"""
matching/experience.py

Calculates experience matching score.
"""

from difflib import SequenceMatcher


def similarity(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def experience_match_score(jd, resume):
    """
    Calculates experience score.

    Returns:
        dict
    """

    jd_exp = jd.get("experience", {})

    min_exp = jd_exp.get("min", 0)

    candidate_exp = resume.get("experience_years", 0)

    try:
        candidate_exp = float(candidate_exp)
    except:
        candidate_exp = 0

    # -----------------------------
    # Years Score
    # -----------------------------

    if candidate_exp >= min_exp:
        years_score = 100

    elif min_exp == 0:
        years_score = 100

    else:
        years_score = round(
            (candidate_exp / min_exp) * 100,
            2
        )

    # -----------------------------
    # Role Match
    # -----------------------------

    jd_role = jd.get("job_title", "")

    resume_role = resume.get("current_role", "")

    role_score = round(
        similarity(jd_role, resume_role) * 100,
        2
    )

    # -----------------------------
    # Responsibility Match
    # -----------------------------

    jd_resp = [
        r.lower()
        for r in jd.get("responsibilities", [])
    ]

    resume_resp = [
        r.lower()
        for r in resume.get("responsibilities", [])
    ]

    matched = 0

    for jd_item in jd_resp:

        for resume_item in resume_resp:

            if similarity(jd_item, resume_item) >= 0.70:
                matched += 1
                break

    if jd_resp:
        responsibility_score = round(
            matched / len(jd_resp) * 100,
            2
        )
    else:
        responsibility_score = 100

    # -----------------------------
    # Final Score
    # -----------------------------

    total = (
        years_score * 0.5 +
        role_score * 0.2 +
        responsibility_score * 0.3
    )

    return {
        "score": round(total, 2),
        "years_score": years_score,
        "role_score": role_score,
        "responsibility_score": responsibility_score
    }


if __name__ == "__main__":

    jd = {
        "job_title": "Software Engineer",
        "experience": {
            "min": 3,
            "max": 5
        },
        "responsibilities": [
            "Develop REST APIs",
            "Deploy Docker containers",
            "Write SQL queries"
        ]
    }

    resume = {
        "experience_years": 4,
        "current_role": "Software Engineer",
        "responsibilities": [
            "Develop REST APIs",
            "Deploy Docker containers",
            "React Development"
        ]
    }

    print(experience_match_score(jd, resume))