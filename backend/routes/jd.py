from fastapi import APIRouter, UploadFile, File
import shutil
import os

from parser.pdf_parser import extract_text_from_pdf
from ai.jd_parser_ai import parse_job_description
from matching.search import search_candidates

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/uploadJD")
async def upload_jd(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    jd_text = extract_text_from_pdf(file_path)
    print("========== JD TEXT ==========")
    print(jd_text)
    print("=============================")

    jd_json = parse_job_description(jd_text)
    print("========== PARSED JD ==========")
    print(jd_json)
    print("===============================")

    candidates = search_candidates(jd_json)

    return {
        "job_description": jd_json,
        "candidates": candidates
    }