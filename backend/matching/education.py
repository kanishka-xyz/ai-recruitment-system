"""
matching/education.py

Role-aware education evaluation with
experience-based qualification compensation.
"""

from matching.weights import classify_job


DEGREE_LEVEL = {
    "iti": 1,
    "certificate": 1,

    "diploma": 2,

    "bsc": 3,
    "bca": 3,
    "be": 3,
    "b.e": 3,
    "b.tech": 3,
    "btech": 3,
    "bachelor": 3,
    "bachelor's": 3,
    "bachelors": 3,

    "msc": 4,
    "mca": 4,
    "me": 4,
    "m.e": 4,
    "m.tech": 4,
    "mtech": 4,
    "mba": 4,
    "master": 4,

    "phd": 5
}


def normalize_degree(degree):

    if degree is None:
        return ""

    if isinstance(degree, dict):
        degree = (
            degree.get("degree")
            or degree.get("qualification")
            or degree.get("education")
            or degree.get("course")
            or ""
        )

    text = str(degree).strip().lower()

    # Detect degree from longer text

    if "diploma" in text:
        return "diploma"

    if "b.tech" in text or "btech" in text:
        return "b.tech"

    if "b.e" in text:
        return "be"

    if "bachelor" in text:
        return "b.tech"

    if "m.tech" in text or "mtech" in text:
        return "m.tech"

    if "mba" in text:
        return "mba"

    if "master" in text:
        return "m.tech"

    if "phd" in text or "doctorate" in text:
        return "phd"

    if "iti" in text:
        return "iti"

    return text


def highest_degree(degrees):

    if not degrees:
        return ""

    if not isinstance(degrees, list):
        degrees = [degrees]

    highest = ""
    highest_level = 0

    for degree in degrees:

        normalized = normalize_degree(degree)

        level = DEGREE_LEVEL.get(normalized, 0)

        if level > highest_level:
            highest_level = level
            highest = normalized

    return highest


def get_experience_years(resume):

    value = resume.get("experience_years", 0)

    try:
        return float(value)
    except:
        pass

    # If structured experience exists
    experience = resume.get("experience", [])

    if isinstance(experience, dict):

        value = (
            experience.get("years")
            or experience.get("total_years")
            or 0
        )

        try:
            return float(value)
        except:
            return 0

    return 0


def education_match_score(jd, resume):

    job_type = classify_job(jd)

    required = highest_degree(
        jd.get("education", [])
    )

    candidate = highest_degree(
        resume.get("education", [])
    )

    experience = get_experience_years(resume)

    # ---------------------------------------
    # SUPPORT ROLE
    # ---------------------------------------
    # Degree should not drive recommendation.

    if job_type == "support":

        return {
            "score": 100,
            "matched_degree": candidate,
            "required_degree": required,
            "reason":
                "Education is not a ranking priority for support roles."
        }

    # ---------------------------------------
    # No education requirement
    # ---------------------------------------

    if not required:

        return {
            "score": 100,
            "matched_degree": candidate,
            "required_degree": "",
            "reason": "No mandatory education requirement"
        }

    required_level = DEGREE_LEVEL.get(required, 0)
    candidate_level = DEGREE_LEVEL.get(candidate, 0)

    # ---------------------------------------
    # Exact / Higher Qualification
    # ---------------------------------------

    if (
        candidate_level >= required_level
        and required_level > 0
    ):

        return {
            "score": 100,
            "matched_degree": candidate,
            "required_degree": required,
            "reason": "Required education satisfied"
        }

    # ---------------------------------------
    # Diploma + 10 Years Compensation
    # ---------------------------------------

    if (
        candidate == "diploma"
        and required_level == 3
        and experience >= 10
    ):

        return {
            "score": 90,
            "matched_degree": candidate,
            "required_degree": required,
            "reason":
                "Diploma compensated by 10+ years of relevant experience"
        }

    # Diploma + 7 years = partial compensation

    if (
        candidate == "diploma"
        and required_level == 3
        and experience >= 7
    ):

        return {
            "score": 75,
            "matched_degree": candidate,
            "required_degree": required,
            "reason":
                "Diploma partially compensated by extensive experience"
        }

    # ---------------------------------------
    # Lower Qualification
    # ---------------------------------------

    if required_level == 0:

        return {
            "score": 50,
            "matched_degree": candidate,
            "required_degree": required,
            "reason": "Education requirement could not be classified"
        }

    score = round(
        (candidate_level / required_level) * 100,
        2
    )

    return {
        "score": min(score, 100),
        "matched_degree": candidate,
        "required_degree": required,
        "reason": "Lower qualification than preferred"
    }