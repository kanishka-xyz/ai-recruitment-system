import json
import os
import urllib.error
import urllib.request
from urllib.parse import quote, urlparse

from .utils import create_finding, extract_candidate_urls, is_public_http_url, normalize_text


TECH_TERMS = {
    "python", "java", "javascript", "typescript", "react", "node", "node.js",
    "express", "fastapi", "spring", "spring boot", "mongodb", "mysql", "postgresql",
    "tensorflow", "pytorch", "docker", "kubernetes", "aws", "azure", "gcp",
    "pandas", "numpy", "scikit-learn", "flask", "django", "git",
}


def _github_request(path):
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "AI-Recruitment-System/1.0",
    }
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    request = urllib.request.Request(
        f"https://api.github.com{path}",
        headers=headers,
        method="GET",
    )
    with urllib.request.urlopen(request, timeout=8) as response:
        body = response.read(512 * 1024).decode("utf-8")
        return response.status, json.loads(body)


def _check_http_url(url):
    if not is_public_http_url(url):
        return {
            "status": "Unverified",
            "evidence": ["The URL was not checked because it did not pass the public-host safety filter."],
        }

    request = urllib.request.Request(
        url,
        headers={"User-Agent": "AI-Recruitment-System/1.0"},
        method="GET",
    )
    try:
        with urllib.request.urlopen(request, timeout=8) as response:
            return {
                "status": "Verified" if 200 <= response.status < 400 else "Unverified",
                "evidence": [f"Public URL responded with HTTP {response.status}. Final URL: {response.geturl()}"],
            }
    except urllib.error.HTTPError as exc:
        return {"status": "Unverified", "evidence": [f"URL returned HTTP {exc.code}."]}
    except (urllib.error.URLError, TimeoutError) as exc:
        return {"status": "Unverified", "evidence": [f"URL could not be reached: {exc}"]}


def _github_readme(owner, repo):
    try:
        status, payload = _github_request(f"/repos/{quote(owner)}/{quote(repo)}/readme")
        if status != 200:
            return {"available": False}
        encoded = payload.get("content") or ""
        import base64
        content = base64.b64decode(encoded).decode("utf-8", errors="replace")
        return {
            "available": True,
            "name": payload.get("name"),
            "html_url": payload.get("html_url"),
            "content_excerpt": content[:4000],
        }
    except Exception as exc:
        return {"available": False, "error": str(exc)}


def _github_repo_details(owner, repo):
    status, payload = _github_request(f"/repos/{quote(owner)}/{quote(repo)}")
    if status != 200:
        return None

    try:
        _, languages = _github_request(f"/repos/{quote(owner)}/{quote(repo)}/languages")
    except Exception:
        languages = {}

    readme = _github_readme(owner, repo)

    return {
        "full_name": payload.get("full_name"),
        "html_url": payload.get("html_url"),
        "description": payload.get("description") or "",
        "default_branch": payload.get("default_branch"),
        "fork": bool(payload.get("fork")),
        "archived": bool(payload.get("archived")),
        "owner_login": (payload.get("owner") or {}).get("login"),
        "languages": sorted(languages.keys()),
        "topics": payload.get("topics") or [],
        "stargazers_count": payload.get("stargazers_count", 0),
        "readme": readme,
    }


def _claimed_tech(resume):
    values = []
    for key in ("skills", "technical_skills", "tools", "programming_languages", "projects"):
        raw = resume.get(key)
        raw = raw if isinstance(raw, list) else [raw]
        values.extend(normalize_text(value) for value in raw)
    joined = " ".join(values)
    return {term for term in TECH_TERMS if term in joined}


def analyze_github_portfolio(resume, resume_text):
    urls = extract_candidate_urls(resume_text, resume)
    github_urls = [url for url in urls if "github.com" in (urlparse(url).netloc or "").lower()]
    other_urls = [url for url in urls if url not in github_urls]

    findings = []
    repo_details = []
    claimed = _claimed_tech(resume)

    if not urls:
        return {
            "status": "Not Checked",
            "summary": "No GitHub or portfolio URL was detected in the resume data.",
            "checks": {"urls": [], "github": [], "portfolio": []},
            "findings": [],
        }

    for url in github_urls[:8]:
        path = urlparse(url).path.strip("/")
        parts = [part for part in path.split("/") if part]
        if not parts:
            continue

        owner = parts[0]
        repo = parts[1] if len(parts) >= 2 else None

        try:
            if repo:
                details = _github_repo_details(owner, repo)
            else:
                status, payload = _github_request(f"/users/{quote(owner)}/repos?per_page=30&sort=updated")
                details = {
                    "profile": owner,
                    "repo_count": len(payload) if status == 200 and isinstance(payload, list) else 0,
                    "repos": [item.get("full_name") for item in payload[:10]] if isinstance(payload, list) else [],
                }

            if not details:
                findings.append(
                    create_finding(
                        "github_portfolio",
                        "Unverified",
                        f"GitHub URL {url} could not be resolved through the public GitHub API.",
                        ["The URL may be invalid, deleted, private, rate-limited, or temporarily unavailable."],
                        0.75,
                        "Open the URL manually and confirm whether the claimed public evidence exists.",
                    )
                )
                continue

            repo_details.append(details)

            if repo:
                public_tech = {normalize_text(name) for name in details.get("languages", [])}
                overlap = sorted(
                    term for term in claimed
                    if any(
                        term == language or term.replace(" ", "") == language.replace(" ", "")
                        for language in public_tech
                    )
                )
                findings.append(
                    create_finding(
                        "github_portfolio",
                        "Verified",
                        f"Public GitHub repository {details.get('full_name')} is accessible.",
                        [
                            f"Repository URL: {details.get('html_url')}",
                            f"Public languages: {', '.join(details.get('languages') or []) or 'None reported'}",
                            f"Technology overlap with resume claims: {', '.join(overlap) if overlap else 'No direct language overlap found'}",
                            f"README available: {'yes' if details.get('readme', {}).get('available') else 'no'}",
                        ],
                        0.93,
                        "Remember that public repository access does not by itself prove authorship or ownership by the candidate.",
                    )
                )

                if claimed and not overlap:
                    findings.append(
                        create_finding(
                            "github_portfolio",
                            "Unverified",
                            "The public repository does not show a direct programming-language overlap with the technologies claimed in the resume.",
                            [
                                f"Resume technology claims sampled: {', '.join(sorted(claimed)[:12])}.",
                                f"Repository languages: {', '.join(details.get('languages') or []) or 'None reported'}.",
                                "Frameworks, dependencies, generated code, or non-code evidence can explain a missing language match.",
                            ],
                            0.49,
                            "Review the repository contents and README before interpreting the mismatch.",
                        )
                    )
        except Exception as exc:
            findings.append(
                create_finding(
                    "github_portfolio",
                    "Unverified",
                    f"GitHub URL {url} could not be checked.",
                    [str(exc)],
                    0.65,
                    "Retry later or verify the URL manually.",
                )
            )

    portfolio_results = []
    for url in other_urls[:8]:
        result = _check_http_url(url)
        portfolio_results.append({"url": url, **result})
        findings.append(
            create_finding(
                "github_portfolio",
                result["status"],
                f"Portfolio/website URL check for {url}.",
                result["evidence"],
                0.86 if result["status"] == "Verified" else 0.62,
                "Open the portfolio manually and compare the visible work with the resume claims.",
            )
        )

    status = (
        "Potentially Inconsistent"
        if any(item["status"] == "Potentially Inconsistent" for item in findings)
        else "Unverified"
        if findings and any(item["status"] == "Unverified" for item in findings)
        else "Verified" if findings else "Not Checked"
    )

    return {
        "status": status,
        "summary": (
            "Detected public links responded successfully; accessibility does not independently establish authorship."
            if findings and all(item["status"] == "Verified" for item in findings)
            else "Public-link evidence was checked where possible; review any unverified or inconsistent signals."
        ),
        "checks": {
            "urls": urls,
            "github_urls": github_urls,
            "portfolio_urls": other_urls,
            "github": repo_details,
            "portfolio": portfolio_results,
        },
        "findings": findings,
    }
