# Resume Authenticity Module

The module adds an independent, evidence-based review layer. It does not modify ATS
matching, semantic retrieval, contextual scoring, or candidate ranking.

## Flow

Resume record
  -> document integrity checks
  -> duplicate/content-overlap checks
  -> employment timeline checks
  -> education/certification checks
  -> GitHub/portfolio checks
  -> Gemini content consistency review
  -> MongoDB authenticity report
  -> Candidate Profile UI

Status values are:
- Verified
- Potentially Inconsistent
- Unverified
- Not Checked

The module deliberately does not create a "Fake Candidate" verdict.

## Optional environment variables

GITHUB_TOKEN
  Optional GitHub token for higher public API limits.

CREDENTIAL_VERIFICATION_API_URL
  Approved credential verification service URL.

CREDENTIAL_VERIFICATION_API_KEY
  Secret key for that approved service.

AUTHENTICITY_GEMINI_MODEL
  Gemini model override. Default: gemini-3.1-flash-lite.

AUTHENTICITY_ANALYSIS_VERSION
  Report version label. Default: 1.0.

AUTHENTICITY_REUSE_SECONDS
  Reuse window for normal Analyze calls. Default: 900 seconds.
