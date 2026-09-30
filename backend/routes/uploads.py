'''from fastapi import APIRouter, UploadFile, File
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
    }'''

from fastapi import APIRouter, UploadFile, File
import shutil
import os
import json
import time

from matching.text_converter import resume_to_text
from ai.resume_parser_ai import parse_resume
from matching.embedding import create_embedding
from parser.pdf_parser import extract_text_from_pdf
from database.mongodb import resume_collection

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/uploadResume")
async def upload_resume(file: UploadFile = File(...)):

    total_start = time.time()

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    # -----------------------------
    # 1. Save uploaded file
    # -----------------------------
    start = time.time()

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"📁 File saving: {time.time() - start:.2f} sec")

    # -----------------------------
    # 2. Extract PDF text
    # -----------------------------
    start = time.time()

    extracted_text = ""

    if file.filename.lower().endswith(".pdf"):
        extracted_text = extract_text_from_pdf(file_path)

    print(f"📄 PDF extraction: {time.time() - start:.2f} sec")

    # -----------------------------
    # 3. Gemini resume parsing
    # -----------------------------
    start = time.time()

    resume_json = parse_resume(extracted_text)

    print(f"🤖 Gemini resume parsing: {time.time() - start:.2f} sec")

    print(json.dumps(resume_json, indent=2))

    resume_json["resume_text"] = extracted_text

    # -----------------------------
    # 4. Convert JSON to text
    # -----------------------------
    start = time.time()

    resume_text = resume_to_text(resume_json)

    print(f"📝 Text conversion: {time.time() - start:.2f} sec")

    # -----------------------------
    # 5. Create embedding
    # -----------------------------
    start = time.time()

    embedding = create_embedding(resume_text)

    print(f"🧠 Embedding creation: {time.time() - start:.2f} sec")

    resume_json["embedding"] = embedding.tolist()

    # -----------------------------
    # 6. Store file information
    # -----------------------------
    resume_json["resume_path"] = file_path
    resume_json["resume_file"] = file.filename

    # -----------------------------
    # 7. MongoDB insert
    # -----------------------------
    start = time.time()

    result = resume_collection.insert_one(resume_json)

    print(f"🍃 MongoDB insert: {time.time() - start:.2f} sec")

    # -----------------------------
    # TOTAL
    # -----------------------------
    total_time = time.time() - total_start

    print("=" * 50)
    print(f"⏱️ TOTAL RESUME UPLOAD TIME: {total_time:.2f} sec")
    print("=" * 50)

    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
        "id": str(result.inserted_id)
    }