import json
import os
import urllib.error
import urllib.request

from .utils import create_finding


def _credential_items(resume):
    items = []
    for category, key in (("education", "education"), ("certifications", "certifications")):
        values = resume.get(key) or []
        if not isinstance(values, list):
            values = [values]

        for value in values:
            if isinstance(value, dict):
                item = {
                    "category": category,
                    "name": value.get("name") or value.get("degree") or value.get("title") or value.get("certification") or "",
                    "institution": value.get("institution") or value.get("organization") or value.get("issuing_organization") or "",
                    "year": value.get("year") or value.get("graduation_year") or value.get("date") or "",
                    "credential_id": value.get("id") or value.get("certificate_id") or value.get("credential_id") or "",
                }
            else:
                item = {
                    "category": category,
                    "name": str(value),
                    "institution": "",
                    "year": "",
                    "credential_id": "",
                }
            if item["name"] or item["institution"]:
                items.append(item)
    return items


def _external_verify(credential):
    endpoint = os.getenv("CREDENTIAL_VERIFICATION_API_URL")
    api_key = os.getenv("CREDENTIAL_VERIFICATION_API_KEY")
    if not endpoint or not api_key:
        return None

    payload = {
        "category": credential["category"],
        "credential_name": credential["name"],
        "institution": credential["institution"],
        "year": credential["year"],
        "credential_id": credential["credential_id"],
    }

    request = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
            "User-Agent": "AI-Recruitment-System/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=8) as response:
            if response.status >= 400:
                return {"available": False, "reason": f"HTTP {response.status}"}
            body = json.loads(response.read().decode("utf-8"))
            return {
                "available": True,
                "verified": bool(body.get("verified")),
                "source": body.get("source") or endpoint,
                "evidence": body.get("evidence") or body.get("message") or "",
            }
    except (urllib.error.URLError, TimeoutError, ValueError) as exc:
        return {"available": False, "reason": str(exc)}


def _analyze_item(credential, verifier_configured):
    result = _external_verify(credential) if verifier_configured else None

    if result and result.get("available"):
        status = "Verified" if result.get("verified") else "Potentially Inconsistent"
        evidence = [
            str(result.get("evidence") or "Authoritative verification service returned a result."),
            f"Verification source: {result.get('source')}",
        ]
        finding = create_finding(
            credential["category"],
            status,
            f"Credential verification result for {credential['name']}.",
            evidence,
            0.94,
            "Retain the authoritative verification record with the candidate file.",
        )
        return status, finding

    reason = "No authoritative verification integration is configured."
    if result and result.get("reason"):
        reason = f"Verification service unavailable: {result['reason']}"

    finding = create_finding(
        credential["category"],
        "Unverified",
        f"{credential['name']} could not be independently verified.",
        [reason],
        0.72,
        "Verify the credential through the issuing institution or an approved verification service.",
    )
    return "Unverified", finding


def analyze_credentials(resume):
    credentials = _credential_items(resume)
    verifier_configured = bool(
        os.getenv("CREDENTIAL_VERIFICATION_API_URL")
        and os.getenv("CREDENTIAL_VERIFICATION_API_KEY")
    )

    grouped = {"education": [], "certifications": []}
    findings = []

    for credential in credentials:
        status, finding = _analyze_item(credential, verifier_configured)
        grouped[credential["category"]].append({
            "name": credential["name"],
            "institution": credential["institution"],
            "year": credential["year"],
            "credential_id": credential["credential_id"],
            "status": status,
        })
        findings.append(finding)

        if credential["category"] == "education" and not credential["institution"]:
            findings.append(
                create_finding(
                    "education",
                    "Potentially Inconsistent",
                    f"Education entry '{credential['name']}' does not include an institution name.",
                    ["Institution field is missing from the parsed resume data."],
                    0.6,
                    "Ask the candidate for the awarding institution before verification.",
                )
            )

    def group_status(items):
        statuses = [item["status"] for item in items]
        if any(status == "Potentially Inconsistent" for status in statuses):
            return "Potentially Inconsistent"
        if any(status == "Unverified" for status in statuses):
            return "Unverified"
        if statuses and all(status == "Verified" for status in statuses):
            return "Verified"
        return "Not Checked"

    all_statuses = [finding["status"] for finding in findings]
    overall_status = (
        "Potentially Inconsistent"
        if "Potentially Inconsistent" in all_statuses
        else "Unverified"
        if "Unverified" in all_statuses
        else "Verified"
        if all_statuses
        else "Not Checked"
    )

    return {
        "status": overall_status,
        "summary": (
            "Credentials were checked through the configured authoritative service."
            if verifier_configured
            else "Credential records were extracted, but no authoritative verification service is configured, so they remain unverified."
        ),
        "checks": {
            "verification_integration_configured": verifier_configured,
            "education": {
                "status": group_status(grouped["education"]),
                "items": grouped["education"],
            },
            "certifications": {
                "status": group_status(grouped["certifications"]),
                "items": grouped["certifications"],
            },
        },
        "findings": findings,
    }
