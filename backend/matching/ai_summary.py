import google.generativeai as genai
import os

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def generate_ai_summary(
    jd,
    resume,
    ranking
):

    prompt = f"""
You are an experienced HR recruiter.

Evaluate the following candidate.

Job Description:
{jd}

Resume:
{resume}

ATS Result:
{ranking}

Generate a professional recruiter summary.

Include:

1. Overall assessment
2. Candidate strengths
3. Weaknesses
4. Missing skills
5. Final hiring recommendation

Limit to 120 words.

Return plain text only.
"""

    response = model.generate_content(prompt)

    return response.text.strip()