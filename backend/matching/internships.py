"""
matching/internships.py

Calculates internship score.
"""

from typing import List


def normalize_list(items: List[str]) -> List[str]:
    """
    Normalize strings.
    """

    if not items:
        return []

    return list(
        set(
            item.strip().lower()
            for item in items
            if item
        )
    )


def internship_match_score(jd, resume):
    """
    Calculates internship relevance score.

    Parameters
    ----------
    jd : dict

    resume : dict

    Returns
    -------
    dict
    """

    jd_skills = normalize_list(
        jd.get("mandatory_skills", [])
        + jd.get("preferred_skills", [])
    )

    internships = resume.get("internships", [])

    if not internships:

        return {
            "score": 0,
            "matched_internships": [],
            "matched_skills": [],
            "internship_count": 0
        }

    matched_internships = []
    matched_skills = []

    for internship in internships:

        company = internship.get("company", "")

        skills = normalize_list(
            internship.get("skills", [])
        )

        common = list(
            set(skills) &
            set(jd_skills)
        )

        if common:

            matched_internships.append(company)

            matched_skills.extend(common)

    matched_skills = list(set(matched_skills))

    # ----------------------------------
    # Score
    # ----------------------------------

    if jd_skills:

        skill_score = (
            len(matched_skills)
            / len(jd_skills)
        ) * 80

    else:

        skill_score = 0

    internship_bonus = min(
        len(matched_internships) * 20,
        20
    )

    total = round(
        min(skill_score + internship_bonus, 100),
        2
    )

    return {

        "score": total,

        "matched_internships": matched_internships,

        "matched_skills": matched_skills,

        "internship_count": len(internships)
    }


# ---------------------------------------
# Testing
# ---------------------------------------

if __name__ == "__main__":

    jd = {

        "mandatory_skills": [
            "Python",
            "FastAPI",
            "SQL"
        ],

        "preferred_skills": [
            "Docker",
            "React"
        ]
    }

    resume = {

        "internships": [

            {

                "company": "Google",

                "skills": [
                    "Python",
                    "React",
                    "FastAPI"
                ]
            },

            {

                "company": "Infosys",

                "skills": [
                    "Java",
                    "Spring Boot"
                ]
            }

        ]
    }

    result = internship_match_score(
        jd,
        resume
    )

    print(result)