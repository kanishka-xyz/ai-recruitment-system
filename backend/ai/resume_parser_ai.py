import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def parse_resume(resume_text):

    prompt = f"""
You are an expert ATS Resume Parser.

Extract the resume into EXACTLY the following JSON.

Return ONLY valid JSON.

{{
"candidate_name":"",
"email":"",
"phone":"",
"location":"",
"current_role":"",
"current_company":"",
"total_experience_years":0,
"skills":[],
"technical_skills":[],
"soft_skills":[],
"education":[],
"certifications":[],
"projects":[],
"industries":[],
"tools":[],
"programming_languages":[],
"notice_period":"",
"current_ctc":"",
"expected_ctc":"",
"summary":""
}}

Resume:

{resume_text}
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )

    text = response.text.strip()

    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)