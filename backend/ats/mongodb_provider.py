from database.mongodb import resume_collection


def fetch_candidates(search_query=None):
    """
    Fetch candidates from MongoDB.
    search_query is ignored for now.
    """

    return list(resume_collection.find({}))