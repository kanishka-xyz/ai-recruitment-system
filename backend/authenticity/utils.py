import datetime as dt
import hashlib
import ipaddress
import os
import re
import socket
from urllib.parse import urlparse
from bson import ObjectId

STATUS_VALUES = {
    "Verified",
    "Potentially Inconsistent",
    "Unverified",
    "Not Checked",
}

AUTHENTICITY_ALLOWED_EXTENSIONS = {".pdf", ".docx"}

BACKEND_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(BACKEND_ROOT, ".."))

# The existing application uses relative storage paths. Depending on where
# Uvicorn is started, those paths resolve either from the repository root or
# from the backend directory. Keep both locations in the approved roots.
RESUME_ROOTS = [
    os.path.abspath(os.path.join(BACKEND_ROOT, "internal_database", "resumes")),
    os.path.abspath(os.path.join(BACKEND_ROOT, "uploads")),
    os.path.abspath(os.path.join(PROJECT_ROOT, "internal_database", "resumes")),
    os.path.abspath(os.path.join(PROJECT_ROOT, "uploads")),
]


def safe_status(value, fallback="Not Checked"):
    value = str(value or "").strip()
    return value if value in STATUS_VALUES else fallback


def make_json_safe(value):
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, (dt.datetime, dt.date)):
        return value.isoformat()
    if isinstance(value, dict):
        return {str(k): make_json_safe(v) for k, v in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [make_json_safe(v) for v in value]
    if hasattr(value, "item"):
        try:
            return value.item()
        except Exception:
            pass
    return value


def normalize_text(value):
    if value is None:
        return ""
    value = str(value).lower()
    value = re.sub(r"\s+", " ", value)
    return re.sub(r"[^a-z0-9+#./-]+", " ", value).strip()


def flatten_text(value):
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if isinstance(value, dict):
        return " ".join(flatten_text(v) for v in value.values())
    if isinstance(value, (list, tuple)):
        return " ".join(flatten_text(v) for v in value)
    return str(value)


def redact_pii(text):
    """Remove the most obvious direct identifiers before sending text to an LLM."""
    redacted = str(text or "")
    redacted = re.sub(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", "[EMAIL]", redacted, flags=re.I)
    redacted = re.sub(r"(?<!\d)(?:\+?\d[\d .()\-]{7,}\d)(?!\d)", "[PHONE]", redacted)
    redacted = re.sub(r"\b(?:https?://)?(?:www\.)?linkedin\.com/in/[A-Za-z0-9._\-/]+\b", "[LINKEDIN]", redacted, flags=re.I)
    return redacted


def calculate_sha256(file_path):
    digest = hashlib.sha256()
    with open(file_path, "rb") as handle:
        while True:
            chunk = handle.read(1024 * 1024)
            if not chunk:
                break
            digest.update(chunk)
    return digest.hexdigest()


def _is_within(path, root):
    try:
        return os.path.commonpath([path, root]) == root
    except ValueError:
        return False


def resolve_resume_path(resume):
    """Resolve a stored resume path without allowing arbitrary filesystem access."""
    raw_path = str(resume.get("resume_path") or "").strip()
    filename = os.path.basename(str(resume.get("resume_file") or "").strip())

    candidates = []
    if raw_path:
        # Resolve the stored relative path against both common application
        # working directories before falling back to filename-based lookup.
        if os.path.isabs(raw_path):
            candidates.append(os.path.abspath(raw_path))
        else:
            candidates.append(os.path.abspath(raw_path))
            clean_path = raw_path.lstrip("/\\")
            candidates.append(os.path.abspath(os.path.join(BACKEND_ROOT, clean_path)))
            candidates.append(os.path.abspath(os.path.join(PROJECT_ROOT, clean_path)))

    for root in RESUME_ROOTS:
        if filename:
            candidates.append(os.path.abspath(os.path.join(root, filename)))

    for candidate in candidates:
        if not os.path.isfile(candidate):
            continue
        if any(_is_within(candidate, root) for root in RESUME_ROOTS):
            return candidate

    return None


def extract_candidate_urls(resume_text, resume):
    found = set()

    for value in re.findall(r"https?://[^\s<>()\[\]{}]+", resume_text or "", flags=re.I):
        found.add(value.rstrip(".,;:"))

    def collect(value):
        if isinstance(value, str):
            if "://" in value:
                found.add(value.strip().rstrip(".,;:"))
        elif isinstance(value, dict):
            for item in value.values():
                collect(item)
        elif isinstance(value, (list, tuple)):
            for item in value:
                collect(item)

    for key in ("github", "github_url", "github_profile", "portfolio", "portfolio_url", "website", "links", "urls"):
        collect(resume.get(key))

    return sorted(found)


def is_public_http_url(url):
    try:
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"} or not parsed.hostname:
            return False

        host = parsed.hostname.lower().rstrip(".")
        if host in {"localhost", "127.0.0.1", "::1"} or host.endswith(".local"):
            return False

        try:
            ip = ipaddress.ip_address(host)
            return ip.is_global
        except ValueError:
            pass

        try:
            resolved = socket.gethostbyname_ex(host)[2]
        except socket.gaierror:
            return False

        return all(ipaddress.ip_address(address).is_global for address in resolved)
    except Exception:
        return False


def create_finding(
    category,
    status,
    description,
    evidence=None,
    confidence=None,
    recommended_action=None,
):
    item = {
        "category": category,
        "status": safe_status(status),
        "description": str(description or "").strip(),
        "evidence": evidence if isinstance(evidence, list) else ([str(evidence)] if evidence else []),
        "recommended_action": str(recommended_action or "").strip(),
    }

    if confidence is not None:
        try:
            item["confidence"] = round(max(0.0, min(1.0, float(confidence))), 2)
        except (TypeError, ValueError):
            pass

    return item
