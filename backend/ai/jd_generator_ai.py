import os
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-3.1-flash-lite")


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

    response = model.generate_content(prompt)

    return response.text