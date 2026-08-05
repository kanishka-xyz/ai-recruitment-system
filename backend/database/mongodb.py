from dotenv import load_dotenv
import os
from pymongo import MongoClient

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

db = client["AIRecruitment"]

resume_collection = db["resumes"]
