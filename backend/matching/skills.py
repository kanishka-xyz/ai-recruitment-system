"""
matching/skills.py

Calculates the skill matching score between
Job Description and Resume.
"""

from matching.config.aliases import normalize_skill_list
from matching.config.taxonomy import has_related_skill


def skill_match_score(jd, resume):
    """
    Calculates skill match score.

    Parameters
    ----------
    jd : dict

    resume : dict

    Returns
    -------
    dict
    """

    # ----------------------------------------
    # Normalize Skills (with aliases)
    # ----------------------------------------

    mandatory = normalize_skill_list(
        jd.get("mandatory_skills", [])
    )

    preferred = normalize_skill_list(
        jd.get("preferred_skills", [])
    )

    resume_skills = normalize_skill_list(
        resume.get("skills", [])
    )

    # ----------------------------------------
    # Mandatory Skill Matching
    # ----------------------------------------

    matched_mandatory = []
    partial_matches = []
    missing_mandatory = []

    for skill in mandatory:

        if skill in resume_skills:

            matched_mandatory.append(skill)

        elif has_related_skill(skill, resume_skills):

            partial_matches.append(skill)

        else:

            missing_mandatory.append(skill)

    # ----------------------------------------
    # Preferred Skill Matching
    # ----------------------------------------

    matched_preferred = [
        skill
        for skill in preferred
        if skill in resume_skills
    ]

    # ----------------------------------------
    # Score Calculation
    # ----------------------------------------

    mandatory_score = 0

    if mandatory:

        mandatory_score = (

            (
                len(matched_mandatory)
                +
                (0.5 * len(partial_matches))
            )

            /

            len(mandatory)

        ) * 80

    preferred_score = 0

    if preferred:

        preferred_score = (

            len(matched_preferred)

            /

            len(preferred)

        ) * 20

    total_score = mandatory_score + preferred_score

    total_score = round(min(total_score, 100), 2)

    # ----------------------------------------
    # Return
    # ----------------------------------------

    return {

        "score": total_score,

        "mandatory_skills": mandatory,

        "preferred_skills": preferred,

        "resume_skills": resume_skills,

        "matched_skills": matched_mandatory,

        "partial_matches": partial_matches,

        "missing_skills": missing_mandatory,

        "matched_preferred": matched_preferred,

        "mandatory_match_percent": round(

            (
                (
                    len(matched_mandatory)
                    +
                    (0.5 * len(partial_matches))
                )

                /

                len(mandatory)

                * 100
            ) if mandatory else 100,

            2

        ),

        "preferred_match_percent": round(

            (
                len(matched_preferred)

                /

                len(preferred)

                * 100
            ) if preferred else 100,

            2

        )

    }


# -------------------------------------------------
# Testing
# -------------------------------------------------

if __name__ == "__main__":

    jd = {

        "mandatory_skills": [
            "Python",
            "FastAPI",
            "JavaScript",
            "Docker"
        ],

        "preferred_skills": [
            "AWS",
            "React"
        ]

    }

    resume = {

        "skills": [
            "python",
            "Fast API",
            "JS",
            "ReactJS",
            "AWS"
        ]

    }

    result = skill_match_score(
        jd,
        resume
    )

    from pprint import pprint

    pprint(result)