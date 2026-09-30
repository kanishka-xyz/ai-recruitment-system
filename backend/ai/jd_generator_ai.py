import time
import os
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_job_description(user_prompt):

    prompt = f"""
You are an experienced HR Manager.

The recruiter gave these requirements:

{user_prompt}

Generate a professional Job Description.

Return in this exact format.

# Job Title

# Location

# Employment Type

# Experience

# About the Role

# Responsibilities
- bullet points

# Required Skills
- bullet points

# Preferred Skills
- bullet points

# Qualifications
- bullet points

# Benefits
- bullet points

Write professionally.
Do not explain anything.
Only return the Job Description.
"""

    start = time.time()
    print("🚀 Calling Gemini...")

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )

    end = time.time()

    print(f"✅ Gemini response time: {end - start:.2f} seconds")

    return response.text