from ats.mongodb_provider import fetch_candidates


def get_candidates(search_query):
    """
    ATS Service

    Today:
        MongoDB

    Future:
        LinkedIn Recruiter
        Naukri Recruiter
        Workday
        Greenhouse
    """

    return fetch_candidates(search_query)