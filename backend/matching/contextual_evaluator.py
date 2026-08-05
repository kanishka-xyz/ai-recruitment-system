"""
matching/contextual_evaluator.py

Performs dynamic and situation-based candidate evaluation.

The final candidate suitability is NOT calculated using fixed weights.
Instead, Gemini evaluates the complete relationship between the JD,
resume and structured evidence.
"""

import json
import os
import re
import time

from dotenv import load_dotenv
from google import genai


# =========================================================
# Load Environment Variables
# =========================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found in .env file"
    )


# =========================================================
# Gemini Client
# =========================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# =========================================================
# JSON Extractor
# =========================================================

def _extract_json(text):
    """
    Safely extract JSON from Gemini response.
    """

    if not text:
        raise ValueError(
            "Empty response from contextual evaluator"
        )

    text = text.strip()

    # Remove markdown code blocks
    text = re.sub(
        r"^```json\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"^```\s*",
        "",
        text
    )

    text = re.sub(
        r"\s*```$",
        "",
        text
    )

    # Sometimes model may return text before JSON
    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1:
        raise ValueError(
            "No valid JSON object found in Gemini response"
        )

    text = text[start:end + 1]

    return json.loads(text)


# =========================================================
# Contextual Candidate Evaluator
# =========================================================

def contextual_evaluate(
    jd,
    resume,
    evidence,
    semantic_score=0
):
    """
    Evaluate candidate suitability dynamically.

    IMPORTANT:
    This function does NOT use fixed weights.

    It considers the complete candidate profile in
    relation to the specific job.
    """

    prompt = f"""
You are an expert recruitment evaluator.

Your task is to determine how suitable THIS PARTICULAR candidate is
for THIS PARTICULAR job.

This is a CONTEXTUAL evaluation.

You must evaluate the candidate like an experienced recruiter who
reads the complete resume and job description together.

============================================================
CORE PRINCIPLE
============================================================

DO NOT use fixed scoring weights.

Never assume rules such as:

skills = 30%
experience = 30%
education = 20%
projects = 10%

The importance of every factor must be determined dynamically from
the job description and candidate profile.

Two candidates applying for the same job may have completely
different strengths.

Similarly, the same candidate may be highly suitable for one job
and unsuitable for another.

============================================================
EVALUATE THE COMPLETE PROFILE
============================================================

Consider ALL available evidence together:

- required skills
- related skills
- technical knowledge
- domain knowledge
- relevant experience
- total experience
- responsibilities handled
- projects
- education
- certifications
- achievements
- internships
- tools and technologies
- industry exposure
- career progression
- semantic relevance between JD and resume

Do NOT make the final decision from one parameter.

============================================================
RELATIONSHIPS BETWEEN FACTORS
============================================================

Evaluate how factors SUPPORT or COMPENSATE for each other.

For example:

A candidate with a lower formal qualification may still be highly
suitable if they demonstrate extensive directly relevant professional
experience and strong domain expertise.

A candidate with the preferred degree should NOT automatically receive
a high score if their actual experience and skills are unrelated.

For an entry-level candidate, strong projects, internships and
demonstrated technical skills may provide strong evidence even when
professional experience is limited.

A candidate with many years of experience should NOT automatically
receive a high score if those years are unrelated to the position.

Relevant professional experience should normally provide stronger
evidence than unrelated experience.

Projects should matter according to their relevance and complexity,
not simply because projects exist.

Certifications should matter when they demonstrate relevant expertise
or when the JD specifically requires them.

Achievements should matter when they provide meaningful evidence of
capability relevant to the position.

Internships should be evaluated according to the actual work performed,
especially for early-career candidates.

============================================================
EDUCATION
============================================================

Do NOT treat education as a universal requirement.

Determine its importance from THIS JD.

If a particular degree is genuinely mandatory, its absence should
matter significantly.

If education is preferred rather than essential, extensive relevant
experience or demonstrated expertise may compensate for it.

Do not automatically reject or strongly penalize a candidate simply
because the education title is different.

Evaluate what the candidate has actually demonstrated.

============================================================
EXPERIENCE
============================================================

Distinguish carefully between:

TOTAL EXPERIENCE

and

RELEVANT EXPERIENCE.

Example:

10 years of unrelated experience is NOT equivalent to
10 years of directly relevant experience.

Look at:

- responsibilities
- domain
- technologies
- tools
- industry
- seniority
- complexity of work
- similarity to JD responsibilities

============================================================
SKILLS
============================================================

Do not rely only on exact keyword matching.

Understand semantically equivalent and related skills.

Also examine whether the resume provides evidence that the candidate
actually USED those skills through:

- experience
- projects
- internships
- responsibilities
- achievements

A skill merely appearing in a skill list is weaker evidence than
demonstrated usage.

============================================================
MANDATORY REQUIREMENTS
============================================================

Identify whether the JD contains genuinely non-negotiable requirements.

Examples may include:

- legally required licenses
- mandatory certifications
- explicit minimum requirements
- regulatory requirements
- requirements explicitly stated as mandatory

Do NOT casually compensate for genuinely mandatory requirements.

However, do NOT invent mandatory requirements that are not stated
or strongly implied by the JD.

============================================================
CONTEXTUAL COMPARISON
============================================================

Your central question is:

"Based on the complete evidence available in this resume, how capable
and suitable does this candidate appear to be for THIS specific job?"

The final score must represent OVERALL ROLE FIT.

It must NOT represent:

education score,
skill score,
experience score,
or any other individual parameter.

============================================================
JOB DESCRIPTION
============================================================

{json.dumps(jd, indent=2, default=str)}

============================================================
FULL CANDIDATE PROFILE
============================================================

{json.dumps(resume, indent=2, default=str)}

============================================================
STRUCTURED EVIDENCE
============================================================

{json.dumps(evidence, indent=2, default=str)}

============================================================
SEMANTIC SIMILARITY
============================================================

{semantic_score}

Semantic similarity is supporting evidence only.

Do NOT treat semantic similarity as the final decision.

============================================================
OUTPUT
============================================================

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations outside JSON.

Use exactly this structure:

{{
    "overall_fit_score": 0,

    "recommendation": "",

    "confidence": "",

    "role_fit": "",

    "strengths": [],

    "gaps": [],

    "compensating_factors": [],

    "critical_requirements_missing": [],

    "factor_analysis": {{

        "skills": "",

        "experience": "",

        "projects": "",

        "education": "",

        "certifications": "",

        "achievements": "",

        "internships": "",

        "domain_relevance": ""

    }},

    "reason": ""
}}

============================================================
SCORING GUIDANCE
============================================================

overall_fit_score must be between 0 and 100.

The score must represent overall contextual suitability.

Use the full range realistically.

Do not inflate scores simply because some requirements match.

============================================================
RECOMMENDATION
============================================================

Recommendation must be exactly one of:

"Highly Recommended"
"Recommended"
"Consider"
"Not Recommended"

The recommendation must agree with the overall evaluation.

============================================================
CONFIDENCE
============================================================

Confidence must be exactly one of:

"High"
"Medium"
"Low"

Confidence represents how much evidence is available in the resume
to support your evaluation.

A sparse resume may produce lower confidence even if the candidate
appears suitable.

============================================================
FINAL INSTRUCTION
============================================================

Think about the candidate holistically.

Do NOT calculate the result using predetermined percentages.

Do NOT allow one strong factor to dominate automatically.

Do NOT allow one weak non-critical factor to reject an otherwise
strong candidate automatically.

Consider relationships, relevance, evidence, compensation,
job context and overall capability.

Return ONLY the JSON object.
"""

    # =====================================================
    # Call Gemini
    # =====================================================

       # =====================================================
    # Call Gemini
    # =====================================================

    response = None
    last_error = None

    MAX_RETRIES = 3

    for attempt in range(MAX_RETRIES):

        try:

            print(
                f"Contextual Gemini evaluation "
                f"attempt {attempt + 1}/{MAX_RETRIES}"
            )

            response = client.models.generate_content(
                model="gemini-flash-latest",
                contents=prompt
            )

            # Make sure Gemini actually returned text
            if (
                response is None
                or not getattr(response, "text", None)
            ):
                raise ValueError(
                    "Gemini returned an empty response."
                )

            # Success
            break

        except Exception as e:

            last_error = e

            error_text = str(e)

            print(
                f"Contextual evaluation attempt "
                f"{attempt + 1}/{MAX_RETRIES} failed:"
            )

            print(error_text)

            # ---------------------------------------------
            # Temporary server overload
            # ---------------------------------------------

            is_503 = (
                "503" in error_text
                or "UNAVAILABLE" in error_text
                or "high demand" in error_text.lower()
            )

            # ---------------------------------------------
            # Quota / rate limit
            # ---------------------------------------------

            is_429 = (
                "429" in error_text
                or "RESOURCE_EXHAUSTED" in error_text
                or "quota" in error_text.lower()
            )

            # ---------------------------------------------
            # Retry only temporary failures
            # ---------------------------------------------

            if attempt < MAX_RETRIES - 1:

                if is_503:

                    wait_time = 5 * (attempt + 1)

                    print(
                        f"Gemini temporarily unavailable. "
                        f"Retrying in {wait_time}s..."
                    )

                    time.sleep(wait_time)

                    continue

                if is_429:

                    wait_time = 10 * (attempt + 1)

                    print(
                        f"Gemini quota/rate limit reached. "
                        f"Retrying in {wait_time}s..."
                    )

                    time.sleep(wait_time)

                    continue

            # Don't repeatedly retry programming errors,
            # invalid requests, malformed input, etc.
            if not is_503 and not is_429:
                break

    # =====================================================
    # Gemini unavailable
    # =====================================================

    if response is None:

        print(
            "Gemini contextual evaluation could not "
            "be completed."
        )

        raise RuntimeError(
            "Contextual evaluation unavailable: "
            f"{last_error}"
        )

    # =====================================================
    # Parse Response
    # =====================================================

    try:

        result = _extract_json(
            response.text
        )

    except Exception as e:

        raise RuntimeError(
            "Gemini returned an invalid contextual "
            f"evaluation response: {e}"
        )

    # =====================================================
    # Validate Score
    # =====================================================

    score = result.get(
        "overall_fit_score",
        0
    )

    try:

        score = float(score)

    except (TypeError, ValueError):

        score = 0

    score = max(
        0,
        min(score, 100)
    )

    result["overall_fit_score"] = round(
        score,
        2
    )

    # =====================================================
    # Validate Recommendation
    # =====================================================

    valid_recommendations = [
        "Highly Recommended",
        "Recommended",
        "Consider",
        "Not Recommended"
    ]

    recommendation = result.get(
        "recommendation",
        "Consider"
    )

    if recommendation not in valid_recommendations:

        result["recommendation"] = "Consider"

    # =====================================================
    # Validate Confidence
    # =====================================================

    valid_confidence = [
        "High",
        "Medium",
        "Low"
    ]

    confidence = result.get(
        "confidence",
        "Low"
    )

    if confidence not in valid_confidence:

        result["confidence"] = "Low"

    # =====================================================
    # Make Sure Lists Exist
    # =====================================================

    list_fields = [
        "strengths",
        "gaps",
        "compensating_factors",
        "critical_requirements_missing"
    ]

    for field in list_fields:

        if not isinstance(
            result.get(field),
            list
        ):
            result[field] = []

    # =====================================================
    # Factor Analysis Safety
    # =====================================================

    required_factors = [
        "skills",
        "experience",
        "projects",
        "education",
        "certifications",
        "achievements",
        "internships",
        "domain_relevance"
    ]

    factor_analysis = result.get(
        "factor_analysis"
    )

    if not isinstance(
        factor_analysis,
        dict
    ):
        factor_analysis = {}

    for factor in required_factors:

        if factor not in factor_analysis:

            factor_analysis[factor] = (
                "No sufficient evaluation available."
            )

    result["factor_analysis"] = (
        factor_analysis
    )

    # =====================================================
    # String Field Safety
    # =====================================================

    if not result.get("role_fit"):

        result["role_fit"] = (
            "Role fit not specified."
        )

    if not result.get("reason"):

        result["reason"] = (
            "No detailed reason was returned."
        )

    # =====================================================
    # Add Evaluation Metadata
    # =====================================================

    result["evaluation_status"] = "completed"

    # =====================================================
    # Return Contextual Evaluation
    # =====================================================

    return result