from fastapi import APIRouter
from pydantic import BaseModel

from ai.jd_parser_ai import parse_job_description
from matching.search import search_candidates

router = APIRouter()


class JDRequest(BaseModel):
    jd: str


@router.post("/matchResume")
def match_resume(request: JDRequest):

    # Parse Job Description using Gemini
    jd_json = parse_job_description(request.jd)

    # Search Candidates
    candidates = search_candidates(jd_json)

    return {
        "job_description": jd_json,
        "total_candidates": len(candidates),
        "candidates": candidates
    }