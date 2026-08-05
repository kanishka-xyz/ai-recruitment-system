from fastapi import APIRouter
from pydantic import BaseModel

from ai.jd_generator_ai import generate_job_description

router = APIRouter()


class GenerateJDRequest(BaseModel):
    prompt: str


@router.post("/generateJD")
def generate_jd(request: GenerateJDRequest):

    jd = generate_job_description(request.prompt)

    return {
        "job_description": jd
    }