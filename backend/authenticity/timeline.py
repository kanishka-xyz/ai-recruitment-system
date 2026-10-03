import calendar
import re
from datetime import date

from .utils import create_finding

MONTHS = {name.lower(): index for index, name in enumerate(calendar.month_name) if name}
MONTHS.update({name.lower(): index for index, name in enumerate(calendar.month_abbr) if name})


def _month_number(month):
    if not month:
        return None
    token = str(month).strip().lower().rstrip(".")
    if token.isdigit():
        value = int(token)
        return value if 1 <= value <= 12 else None
    return MONTHS.get(token)


def _to_month(year, month=1):
    return int(year) * 12 + (int(month) - 1)


def _parse_endpoint(text, default_month=1):
    text = text.strip()
    if re.fullmatch(r"(?i)(present|current|now)", text):
        today = date.today()
        return _to_month(today.year, today.month), "Present"

    patterns = [
        r"(?i)^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[ ./\-](\d{4})$",
        r"^(\d{1,2})[\/\-](\d{4})$",
        r"^(\d{4})$",
    ]
    for pattern in patterns:
        match = re.match(pattern, text)
        if not match:
            continue
        if len(match.groups()) == 2:
            first, second = match.groups()
            if first.isdigit():
                month, year = int(first), int(second)
            else:
                month, year = _month_number(first), int(second)
            if month:
                return _to_month(year, month), text
        else:
            return _to_month(int(match.group(1)), default_month), text
    return None, text


def _extract_range(text):
    if not text:
        return None, None
    match = re.search(
        r"(?i)([A-Za-z]{3,9}[ ./\-]\d{4}|\d{1,2}[\/\-]\d{4}|\d{4})\s*(?:-|–|—|to)\s*(Present|Current|Now|[A-Za-z]{3,9}[ ./\-]\d{4}|\d{1,2}[\/\-]\d{4}|\d{4})",
        text,
    )
    if not match:
        return None, None
    start, _ = _parse_endpoint(match.group(1))
    end, _ = _parse_endpoint(match.group(2))
    return start, end


def extract_employment_periods(resume_text, resume):
    periods = []

    structured = resume.get("experience") or resume.get("work_experience") or resume.get("employment")
    if isinstance(structured, list):
        for item in structured:
            if not isinstance(item, dict):
                continue
            dates = str(
                item.get("dates")
                or item.get("date_range")
                or item.get("duration")
                or item.get("period")
                or ""
            )
            start, end = _extract_range(dates)
            if start is not None and end is not None:
                periods.append({
                    "company": item.get("company") or item.get("organization") or "",
                    "role": item.get("role") or item.get("title") or item.get("designation") or "",
                    "start_month": start,
                    "end_month": end,
                    "date_text": dates,
                    "source": "structured_resume",
                })

    if periods:
        return periods

    lines = [line.strip() for line in str(resume_text or "").splitlines() if line.strip()]
    range_pattern = re.compile(
        r"(?i)("
        r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[ ./\-]\d{4}"
        r"|\d{1,2}[\/\-]\d{4}"
        r"|\d{4}"
        r")\s*(?:-|–|—|to)\s*("
        r"(?:Present|Current|Now|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[ ./\-]\d{4}|\d{1,2}[\/\-]\d{4}|\d{4})"
        r")"
    )

    for index, line in enumerate(lines):
        match = range_pattern.search(line)
        if not match:
            continue

        start, _ = _parse_endpoint(match.group(1))
        end, _ = _parse_endpoint(match.group(2))
        if start is None or end is None:
            continue

        context_before = lines[max(0, index - 2):index]
        label = " | ".join(context_before[-2:])
        periods.append({
            "company": "",
            "role": label,
            "start_month": start,
            "end_month": end,
            "date_text": match.group(0),
            "source": "resume_text",
        })

    return periods


def _union_months(periods):
    months = set()
    for period in periods:
        start, end = period["start_month"], period["end_month"]
        if end < start:
            continue
        months.update(range(start, end + 1))
    return months


def analyze_employment_timeline(resume, resume_text):
    periods = extract_employment_periods(resume_text, resume)
    findings = []

    if not periods:
        return {
            "status": "Unverified",
            "summary": "No employment date ranges could be reliably extracted from the resume.",
            "checks": {
                "periods_detected": 0,
                "periods": [],
                "claimed_total_experience_years": resume.get("total_experience_years"),
            },
            "findings": [
                create_finding(
                    "employment_timeline",
                    "Unverified",
                    "Employment periods could not be reliably reconstructed from the available resume text.",
                    [],
                    0.45,
                    "Review the original resume or request employment records before making a verification decision.",
                )
            ],
        }

    overlaps = []
    ordered = sorted(periods, key=lambda item: item["start_month"])
    for index, current in enumerate(ordered):
        for other in ordered[index + 1:]:
            overlap_start = max(current["start_month"], other["start_month"])
            overlap_end = min(current["end_month"], other["end_month"])
            if overlap_start <= overlap_end:
                overlaps.append((current, other, overlap_end - overlap_start + 1))

    if overlaps:
        for left, right, months in overlaps[:5]:
            findings.append(
                create_finding(
                    "employment_timeline",
                    "Potentially Inconsistent",
                    "Two reported employment periods overlap.",
                    [
                        f"{left.get('role') or 'Role'} {left.get('company') or ''}: {left['date_text']}",
                        f"{right.get('role') or 'Role'} {right.get('company') or ''}: {right['date_text']}",
                        f"Overlap length: {months} month(s).",
                    ],
                    0.74,
                    "Confirm whether the overlap represents concurrent employment, consulting, internship, part-time work, or a data-entry error.",
                )
            )

    inferred_union_years = len(_union_months(periods)) / 12.0
    claimed = resume.get("total_experience_years")
    try:
        claimed_value = float(claimed)
    except (TypeError, ValueError):
        claimed_value = None

    if claimed_value is not None:
        discrepancy = abs(claimed_value - inferred_union_years)
        if discrepancy >= 1.5:
            findings.append(
                create_finding(
                    "employment_timeline",
                    "Potentially Inconsistent",
                    "Claimed total experience differs materially from the union of the extracted employment ranges.",
                    [
                        f"Claimed experience: {claimed_value:.1f} years.",
                        f"Timeline-derived experience: {inferred_union_years:.1f} years.",
                        f"Difference: {discrepancy:.1f} years.",
                    ],
                    0.67,
                    "Review missing/part-time periods and the source of the claimed experience total.",
                )
            )

    status = "Potentially Inconsistent" if findings else "Unverified"
    summary = (
        "At least one timeline pattern requires human review."
        if findings
        else "Employment dates are internally consistent within what could be extracted, but external verification was not performed."
    )

    return {
        "status": status,
        "summary": summary,
        "checks": {
            "periods_detected": len(periods),
            "periods": periods,
            "claimed_total_experience_years": claimed,
            "timeline_derived_years": round(inferred_union_years, 2),
            "overlap_count": len(overlaps),
        },
        "findings": findings,
    }
