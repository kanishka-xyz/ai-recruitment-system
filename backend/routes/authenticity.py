from fastapi import APIRouter, Query

from authenticity.report import (
    analyze_resume_authenticity,
    get_latest_report,
    list_reports,
)

router = APIRouter(prefix="/authenticity", tags=["Resume Authenticity"])


@router.post("/analyze/{resume_id}")
def analyze_resume(resume_id: str):
    return analyze_resume_authenticity(resume_id, force=False)


@router.post("/reanalyze/{resume_id}")
def reanalyze_resume(resume_id: str):
    return analyze_resume_authenticity(resume_id, force=True)


@router.get("/report/{resume_id}")
def get_authenticity_report(resume_id: str):
    return get_latest_report(resume_id)


@router.get("/reports")
def get_authenticity_reports(limit: int = Query(default=50, ge=1, le=100)):
    return list_reports(limit=limit)
