"""
matching/weights.py

Defines priority weights for combined ATS evaluation.

Candidates are NOT ranked on a single parameter.
Every important parameter is evaluated together with skills.
"""


MANAGEMENT_KEYWORDS = [
    "manager",
    "head",
    "lead",
    "director",
    "supervisor",
    "project manager",
    "team lead",
    "engineering manager",
]

SUPPORT_KEYWORDS = [
    "technician",
    "operator",
    "helper",
    "support",
    "maintenance technician",
    "service engineer",
]

ENGINEERING_KEYWORDS = [
    "engineer",
    "developer",
    "software engineer",
    "design engineer",
    "quality engineer",
    "production engineer",
    "analyst",
    "programmer",
]


def classify_candidate(resume):

    experience = resume.get("experience_years", 0)

    # Some resumes store experience as list
    if isinstance(experience, list):
        experience = len(experience)

    try:
        experience = float(experience)
    except:
        experience = 0

    return "fresher" if experience < 1 else "experienced"


def classify_job(jd):

    title = str(jd.get("job_title", "")).lower()

    if any(word in title for word in MANAGEMENT_KEYWORDS):
        return "management"

    if any(word in title for word in SUPPORT_KEYWORDS):
        return "support"

    return "engineering"


def get_weights(jd, resume):

    candidate_type = classify_candidate(resume)
    job_type = classify_job(jd)

    # ---------------------------------
    # Fresher
    # ---------------------------------

    if candidate_type == "fresher":

        return {
            "skills_experience": 15,
            "skills_projects": 30,
            "skills_education": 15,
            "skills_certifications": 10,
            "skills_achievements": 10,
            "skills_internships": 15,
            "semantic": 5
        }

    # ---------------------------------
    # Management
    # ---------------------------------

    if job_type == "management":

        return {
            "skills_experience": 40,
            "skills_projects": 10,
            "skills_education": 25,
            "skills_certifications": 10,
            "skills_achievements": 10,
            "skills_internships": 0,
            "semantic": 5
        }

    # ---------------------------------
    # Support
    # Education intentionally ignored
    # ---------------------------------

    if job_type == "support":

        return {
            "skills_experience": 55,
            "skills_projects": 10,
            "skills_education": 0,
            "skills_certifications": 15,
            "skills_achievements": 5,
            "skills_internships": 10,
            "semantic": 5
        }

    # ---------------------------------
    # Engineering
    # ---------------------------------

    return {
        "skills_experience": 40,
        "skills_projects": 20,
        "skills_education": 15,
        "skills_certifications": 10,
        "skills_achievements": 5,
        "skills_internships": 5,
        "semantic": 5
    }