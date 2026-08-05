from fastapi import APIRouter, UploadFile, File
import shutil
import os
import json 
from matching.text_converter import resume_to_text


from ai.resume_parser_ai import parse_resume
from matching.embedding import create_embedding
from parser.pdf_parser import extract_text_from_pdf 

from database.mongodb import resume_collection

router = APIRouter()

UPLOAD_FOLDER = "uploads"

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/uploadResume")
async def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

        extracted_text = ""

    if file.filename.lower().endswith(".pdf"):
        extracted_text = extract_text_from_pdf(file_path)
        resume_json = parse_resume(extracted_text)

        print(json.dumps(resume_json, indent=2))
        resume_json["resume_text"] = extracted_text

        resume_text = resume_to_text(resume_json)

        embedding = create_embedding(resume_text)

        resume_json["embedding"] = embedding.tolist()

        # Store original PDF path
        resume_json["resume_path"] = file_path

        # Store original filename
        resume_json["resume_file"] = file.filename

        result = resume_collection.insert_one(resume_json)


    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
         "id": str(result.inserted_id)
    }

    