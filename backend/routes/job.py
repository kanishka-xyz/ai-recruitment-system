from fastapi import APIRouter
from pydantic import BaseModel

from ai.jd_parser_ai import parse_job_description

router = APIRouter()

class JobRequest(BaseModel):
    jd: str


@router.post("/parseJD")
def parse_jd(request: JobRequest):

    result = parse_job_description(request.jd)

    return result