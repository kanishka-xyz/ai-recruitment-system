import os
import uuid
from datetime import datetime, timezone
from pathlib import Path

from bson import ObjectId
from fastapi import HTTPException

from database.mongodb import resume_collection, db
from .ai_content import analyze_ai_assisted_content
from .credentials import analyze_credentials
from .document_integrity import analyze_document
from .duplicate_detection import analyze_duplicate_and_plagiarism
from .github_portfolio import analyze_github_portfolio
from .timeline import analyze_employment_timeline
from .utils import make_json_safe, resolve_resume_path


report_collection = db["resume_authenticity_reports"]

try:
    report_collection.create_index([("resume_id", 1), ("run_id", 1)], unique=True)
    report_collection.create_index([("resume_id", 1), ("analyzed_at", -1)])
except Exception:
    pass


def _object_id(value):
    try:
        return ObjectId(str(value))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid resume ID.")


def _overall_status(checks, findings):
    if any(item.get("status") == "Potentially Inconsistent" for item in findings):
        return "Potentially Inconsistent"

    statuses = []
    for check in checks.values():
        status = check.get("status")
        if status:
            statuses.append(status)

    if not statuses or all(status == "Not Checked" for status in statuses):
        return "Not Checked"
    if any(status == "Unverified" for status in statuses):
        return "Unverified"
    if all(status == "Verified" for status in statuses):
        return "Verified"
    return "Unverified"


def _recommended_actions(findings):
    unique = []
    seen = set()
    for item in findings:
        action = str(item.get("recommended_action") or "").strip()
        if action and action not in seen:
            seen.add(action)
            unique.append(action)
    return unique[:20]


def analyze_resume_authenticity(resume_id, force=False):
    object_id = _object_id(resume_id)

    resume = resume_collection.find_one({"_id": object_id})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume record not found.")

    existing = report_collection.find_one(
        {"resume_id": object_id},
        sort=[("analyzed_at", -1)],
    )

    if existing and not force:
        age_seconds = (
            datetime.now(timezone.utc) - existing["analyzed_at"]
        ).total_seconds()
        reuse_window = int(os.getenv("AUTHENTICITY_REUSE_SECONDS", "900"))
        if age_seconds <= reuse_window:
            return make_json_safe(existing)

    file_path = resolve_resume_path(resume)
    if not file_path:
        raise HTTPException(
            status_code=404,
            detail="Stored resume file could not be found in an approved resume directory.",
        )

    run_id = str(uuid.uuid4())
    analyzed_at = datetime.now(timezone.utc)

    document_result = analyze_document(file_path)
    extracted_text = document_result.get("extracted_text") or ""

    if not extracted_text.strip():
        document_result["status"] = "Unverified"
        document_result["summary"] = "No text could be extracted from the resume."
        document_result.setdefault("findings", []).append({
            "category": "document_integrity",
            "status": "Unverified",
            "description": "No machine-readable text was extracted.",
            "evidence": [],
            "recommended_action": "Review the original file manually or use an approved OCR workflow.",
            "confidence": 0.92,
        })

    credentials = analyze_credentials(resume)

    checks = {
        "document_integrity": document_result,
        "duplicate_detection": analyze_duplicate_and_plagiarism(
            object_id,
            resume,
            file_path,
            extracted_text,
        ),
        "employment_timeline": analyze_employment_timeline(
            resume,
            extracted_text,
        ),
        "education": {
            "status": credentials["checks"]["education"]["status"],
            "summary": "Education entries extracted and checked for available authoritative verification.",
            "checks": credentials["checks"]["education"],
            "findings": [
                item for item in credentials["findings"]
                if item.get("category") == "education"
            ],
        },
        "certifications": {
            "status": credentials["checks"]["certifications"]["status"],
            "summary": "Certification entries extracted and checked for available authoritative verification.",
            "checks": credentials["checks"]["certifications"],
            "findings": [
                item for item in credentials["findings"]
                if item.get("category") == "certifications"
            ],
        },
        "github_portfolio": analyze_github_portfolio(resume, extracted_text),
        "ai_content_analysis": analyze_ai_assisted_content(resume, extracted_text),
    }

    findings = []
    for result in checks.values():
        findings.extend(result.get("findings", []))

    report = {
        "resume_id": object_id,
        "filename": resume.get("resume_file") or os.path.basename(file_path),
        "candidate_name": resume.get("candidate_name") or resume.get("name") or "",
        "analysis_version": os.getenv("AUTHENTICITY_ANALYSIS_VERSION", "1.0"),
        "run_id": run_id,
        "overall_status": _overall_status(checks, findings),
        "checks": checks,
        "findings": findings,
        "recommended_actions": _recommended_actions(findings),
        "analyzed_at": analyzed_at,
    }

    try:
        report_collection.insert_one(report)
    except Exception as exc:
        existing_run = report_collection.find_one(
            {"resume_id": object_id, "run_id": run_id}
        )
        if not existing_run:
            raise HTTPException(
                status_code=500,
                detail=f"Could not store authenticity report: {exc}",
            )

    return make_json_safe(report)


def get_latest_report(resume_id):
    object_id = _object_id(resume_id)
    report = report_collection.find_one(
        {"resume_id": object_id},
        sort=[("analyzed_at", -1)],
    )
    if not report:
        raise HTTPException(
            status_code=404,
            detail="No authenticity report exists for this resume.",
        )
    return make_json_safe(report)


def list_reports(limit=50):
    safe_limit = max(1, min(int(limit), 100))
    reports = list(
        report_collection.find(
            {},
            {
                "_id": 1,
                "resume_id": 1,
                "candidate_name": 1,
                "filename": 1,
                "analysis_version": 1,
                "run_id": 1,
                "overall_status": 1,
                "analyzed_at": 1,
                "findings": 1,
                "recommended_actions": 1,
            },
        )
        .sort("analyzed_at", -1)
        .limit(safe_limit)
    )
    return make_json_safe(reports)
