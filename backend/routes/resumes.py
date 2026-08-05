from fastapi import APIRouter
from database.mongodb import resume_collection

router = APIRouter()

@router.get("/resumes")
def get_resumes():

    resumes = list(resume_collection.find({}, {"_id": 0}))

    return resumes