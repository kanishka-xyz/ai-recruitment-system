import os
import time
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set")

client = genai.Client(api_key=api_key)

print("Calling Gemini...")
start = time.time()

response = client.models.generate_content(
    model="gemini-3.1-flash-lite",
    contents="Write a one sentence description for a Data Analyst job."
)

end = time.time()

print("\nResponse:")
print(response.text)

print(f"\nTime taken: {end - start:.2f} seconds")