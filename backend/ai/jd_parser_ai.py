import os
import json
import time

from dotenv import load_dotenv
from fastapi import HTTPException
from google import genai
from google.genai.errors import ServerError

# ---------------------------------------------------
# Load Environment Variables
# ---------------------------------------------------

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise Exception("GEMINI_API_KEY not found in .env file")

print("Gemini API Loaded Successfully")
print("API Key:", api_key[:15] + "********")

client = genai.Client(api_key=api_key)

MODEL_NAME = "gemini-flash-latest"

# ---------------------------------------------------
# Parse Job Description
# ---------------------------------------------------

def parse_job_description(jd_text: str):

    prompt = f"""
You are an expert HR recruiter.

Extract the following information from the given Job Description.

Return ONLY valid JSON.

JSON Schema:

{{
    "job_title": "",
    "department": "",
    "industry": "",
    "experience": {{
        "min": 0,
        "max": 0
    }},
    "location": "",
    "education": [],
    "skills": [],
    "certifications": [],
    "tools": [],
    "summary": ""
}}

Job Description:

{jd_text}
"""

    retries = 3

    for attempt in range(retries):

        try:

            print("\n====================================")
            print(f"Using Model : {MODEL_NAME}")
            print("Calling Gemini...")
            print("====================================\n")

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )

            text = response.text.strip()

            # Remove markdown formatting if returned
            if text.startswith("```"):
                text = (
                    text.replace("```json", "")
                    .replace("```", "")
                    .strip()
                )

            print("\n========== GEMINI RESPONSE ==========")
            print(text)
            print("=====================================\n")

            return json.loads(text)

        except ServerError:

            print(f"Gemini busy... Retry {attempt + 1}/{retries}")
            time.sleep(3)

        except json.JSONDecodeError:

            print("\nInvalid JSON Returned\n")
            print(text)

            raise HTTPException(
                status_code=500,
                detail="Gemini returned invalid JSON."
            )

        except Exception as e:

            print("\n========== GEMINI ERROR ==========")
            print(type(e))
            print(e)
            print("==================================\n")

            raise HTTPException(
                status_code=500,
                detail=str(e)
            )

    raise HTTPException(
        status_code=503,
        detail="Gemini service temporarily unavailable."
    )