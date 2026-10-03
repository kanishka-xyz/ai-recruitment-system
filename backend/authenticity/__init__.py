"""Advanced resume authenticity and fraud-signal analysis package."""

from .report import analyze_resume_authenticity, get_latest_report, list_reports

__all__ = [
    "analyze_resume_authenticity",
    "get_latest_report",
    "list_reports",
]
