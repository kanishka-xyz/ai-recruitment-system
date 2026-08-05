"""
matching/certifications.py

Calculates certification matching score.
"""


def normalize_list(items):
    """
    Normalize certification list.
    Supports both strings and dictionaries.
    """

    if not items:
        return []

    normalized = []

    for item in items:

        if isinstance(item, dict):

            item = (
                item.get("name")
                or item.get("certificate")
                or item.get("certification")
                or item.get("title")
                or ""
            )

        item = str(item).strip().lower()

        if item:
            normalized.append(item)

    return sorted(list(set(normalized)))


def certification_match_score(jd, resume):
    """
    Compare JD certifications with Resume certifications.

    Returns
    -------
    dict
    """

    required = normalize_list(
        jd.get("certifications", [])
    )

    preferred = normalize_list(
        jd.get("preferred_certifications", [])
    )

    candidate = normalize_list(
        resume.get("certifications", [])
    )

    matched_required = [
        cert
        for cert in required
        if cert in candidate
    ]

    missing_required = [
        cert
        for cert in required
        if cert not in candidate
    ]

    matched_preferred = [
        cert
        for cert in preferred
        if cert in candidate
    ]

    # ------------------------------------
    # Required Certifications Score (80%)
    # ------------------------------------

    required_score = 0

    if required:

        required_score = (
            len(matched_required)
            / len(required)
        ) * 80

    # ------------------------------------
    # Preferred Certifications Score (20%)
    # ------------------------------------

    preferred_score = 0

    if preferred:

        preferred_score = (
            len(matched_preferred)
            / len(preferred)
        ) * 20

    total = round(
        min(required_score + preferred_score, 100),
        2
    )

    return {

        "score": total,

        "matched_certifications": matched_required,

        "matched_preferred": matched_preferred,

        "missing_certifications": missing_required
    }


# ------------------------------------------
# Testing
# ------------------------------------------

if __name__ == "__main__":

    jd = {

        "certifications": [

            "AWS Certified Developer",

            "Oracle Java Certification"
        ],

        "preferred_certifications": [

            "Docker",

            "Kubernetes"
        ]
    }

    resume = {

        "certifications": [

            "AWS Certified Developer",

            "Docker",

            "Azure Fundamentals"
        ]
    }

    result = certification_match_score(
        jd,
        resume
    )

    print(result)