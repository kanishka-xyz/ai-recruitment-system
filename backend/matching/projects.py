"""
matching/projects.py

Calculates project relevance score for candidates,
primarily useful for freshers.
"""


def normalize_list(items):
    """
    Normalize strings for comparison.
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


def project_match_score(jd, resume):
    """
    Calculate project score.

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

    projects = resume.get("projects", [])

    if not projects:
        return {
            "score": 0,
            "matched_projects": [],
            "matched_skills": [],
            "project_count": 0
        }

    matched_projects = []
    matched_skills = []

    for project in projects:

        if isinstance(project, dict):
            project_name = project.get("name", "")
            project_skills = project.get("skills", [])

        else:
            project_name = str(project)
            project_skills = []

    project_name = project_name.lower()

    # --------------------------
    # Score Calculation
    # --------------------------

    if jd_skills:

        skill_score = (
            len(matched_skills)
            / len(jd_skills)
        ) * 80

    else:

        skill_score = 0

    project_bonus = min(
        len(matched_projects) * 10,
        20
    )

    total = round(
        min(skill_score + project_bonus, 100),
        2
    )

    return {
        "score": total,
        "matched_projects": matched_projects,
        "matched_skills": matched_skills,
        "project_count": len(projects)
    }


# ---------------------------------------------------
# Testing
# ---------------------------------------------------

if __name__ == "__main__":

    jd = {

        "mandatory_skills": [
            "Python",
            "FastAPI",
            "SQL"
        ],

        "preferred_skills": [
            "React",
            "Docker"
        ]
    }

    resume = {

        "projects": [

            {
                "name": "AI Resume Screening System",

                "skills": [
                    "Python",
                    "FastAPI",
                    "React"
                ]
            },

            {
                "name": "Library Management",

                "skills": [
                    "Java",
                    "MySQL"
                ]
            }

        ]
    }

    print(project_match_score(jd, resume))