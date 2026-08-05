from fastapi import APIRouter
from matching.search import search_candidates

router = APIRouter()


@router.post("/searchCandidates")
def search_candidates_api(jd_json: dict):

    candidates = search_candidates(jd_json)

    return candidates