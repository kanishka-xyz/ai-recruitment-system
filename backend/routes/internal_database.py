from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from database.mongodb import resume_collection

from ai.resume_parser_ai import parse_resume
from matching.embedding import create_embedding
from matching.text_converter import resume_to_text
from parser.pdf_parser import extract_text_from_pdf

import os
import hashlib
import time
import zipfile
import shutil


router = APIRouter()


# ============================================================
# CONFIGURATION
# ============================================================

INTERNAL_RESUME_FOLDER = os.path.join(
    "internal_database",
    "resumes"
)

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx"
}


# Make sure the resume folder exists
os.makedirs(
    INTERNAL_RESUME_FOLDER,
    exist_ok=True
)


# ============================================================
# FILE HASH
# ============================================================

def calculate_file_hash(file_path):

    sha256 = hashlib.sha256()

    with open(file_path, "rb") as f:

        while chunk := f.read(8192):
            sha256.update(chunk)

    return sha256.hexdigest()


# ============================================================
# FILE / FOLDER UPLOAD
# ============================================================

@router.post("/uploadResumeFiles")
async def upload_resume_files(
    files: list[UploadFile] = File(...)
):
    """
    Upload one or more PDF/DOCX resumes directly.

    The frontend also uses this endpoint for folder selection. Browsers
    submit every supported file in the selected folder as a multipart file.
    """
    start_time = time.perf_counter()

    if not files:
        return {
            "success": False,
            "message": "No resume files selected."
        }

    uploaded_files = []
    rejected_files = []

    try:
        for upload in files:
            original_name = os.path.basename(upload.filename or "")
            extension = os.path.splitext(original_name)[1].lower()

            if not original_name:
                rejected_files.append({
                    "filename": "",
                    "error": "Missing filename."
                })
                continue

            if extension not in ALLOWED_EXTENSIONS:
                rejected_files.append({
                    "filename": original_name,
                    "error": "Only PDF and DOCX files are supported."
                })
                continue

            destination = os.path.join(
                INTERNAL_RESUME_FOLDER,
                original_name
            )

            # Avoid overwriting an existing resume with the same filename.
            if os.path.exists(destination):
                base, ext = os.path.splitext(original_name)
                counter = 1

                while os.path.exists(destination):
                    new_filename = f"{base}_{counter}{ext}"
                    destination = os.path.join(
                        INTERNAL_RESUME_FOLDER,
                        new_filename
                    )
                    counter += 1

                stored_filename = new_filename
            else:
                stored_filename = original_name

            with open(destination, "wb") as target:
                shutil.copyfileobj(upload.file, target)

            uploaded_files.append(stored_filename)

        sync_result = sync_internal_database()

        elapsed = time.perf_counter() - start_time

        return {
            "success": True,
            "message": (
                "Resume files uploaded and synchronized successfully."
            ),
            "uploaded_files": uploaded_files,
            "uploaded_count": len(uploaded_files),
            "rejected_count": len(rejected_files),
            "rejected": rejected_files,
            "processed_count": sync_result["processed_count"],
            "skipped_count": sync_result["skipped_count"],
            "failed_count": sync_result["failed_count"],
            "processed": sync_result["processed"],
            "skipped": sync_result["skipped"],
            "failed": sync_result["failed"],
            "processing_time": round(elapsed, 2),
        }

    except Exception as exc:
        print(f"❌ Direct resume upload failed: {exc}")

        return {
            "success": False,
            "message": "Resume file upload failed.",
            "error": str(exc),
            "uploaded_files": uploaded_files,
            "rejected": rejected_files,
        }


# ============================================================
# ZIP UPLOAD
# ============================================================

@router.post("/uploadResumeDatabase")
async def upload_resume_database(
    file: UploadFile = File(...)
):

    start_time = time.perf_counter()


    # --------------------------------------------------------
    # CHECK ZIP
    # --------------------------------------------------------

    if not file.filename:

        return {
            "success": False,
            "message": "No file selected."
        }


    if not file.filename.lower().endswith(".zip"):

        return {
            "success": False,
            "message": "Please upload a ZIP file."
        }


    # --------------------------------------------------------
    # TEMP FOLDER
    # --------------------------------------------------------

    temp_folder = os.path.join(
        "internal_database",
        "temp"
    )

    os.makedirs(
        temp_folder,
        exist_ok=True
    )


    # --------------------------------------------------------
    # SAVE ZIP
    # --------------------------------------------------------

    zip_filename = os.path.basename(
        file.filename
    )

    zip_path = os.path.join(
        temp_folder,
        zip_filename
    )


    extracted_files = []


    try:

        with open(
            zip_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )


        # ----------------------------------------------------
        # OPEN ZIP
        # ----------------------------------------------------

        with zipfile.ZipFile(
            zip_path,
            "r"
        ) as zip_ref:

            for member in zip_ref.infolist():

                # Ignore directories
                if member.is_dir():
                    continue


                original_name = member.filename


                extension = os.path.splitext(
                    original_name
                )[1].lower()


                # ------------------------------------------------
                # ONLY RESUME FILES
                # ------------------------------------------------

                if extension not in ALLOWED_EXTENSIONS:
                    continue


                # ------------------------------------------------
                # SECURITY
                # Ignore ZIP folder structure
                # ------------------------------------------------

                filename = os.path.basename(
                    original_name
                )


                if not filename:
                    continue


                destination = os.path.join(
                    INTERNAL_RESUME_FOLDER,
                    filename
                )


                # ------------------------------------------------
                # HANDLE SAME FILENAME
                # ------------------------------------------------

                if os.path.exists(destination):

                    base, ext = os.path.splitext(
                        filename
                    )

                    counter = 1


                    while os.path.exists(destination):

                        new_filename = (
                            f"{base}_{counter}{ext}"
                        )

                        destination = os.path.join(
                            INTERNAL_RESUME_FOLDER,
                            new_filename
                        )

                        counter += 1

                        filename = new_filename


                # ------------------------------------------------
                # EXTRACT FILE
                # ------------------------------------------------

                with zip_ref.open(member) as source:

                    with open(
                        destination,
                        "wb"
                    ) as target:

                        shutil.copyfileobj(
                            source,
                            target
                        )


                extracted_files.append(
                    filename
                )


        # ----------------------------------------------------
        # DELETE TEMP ZIP
        # ----------------------------------------------------

        if os.path.exists(zip_path):

            os.remove(zip_path)


        # ----------------------------------------------------
        # AUTOMATICALLY SYNC
        # ----------------------------------------------------

        sync_result = sync_internal_database()


        elapsed = (
            time.perf_counter()
            - start_time
        )


        return {

            "success": True,

            "message":
                "Resume database uploaded and synchronized successfully.",

            "uploaded_files":
                extracted_files,

            "uploaded_count":
                len(extracted_files),

            "processed_count":
                sync_result[
                    "processed_count"
                ],

            "skipped_count":
                sync_result[
                    "skipped_count"
                ],

            "failed_count":
                sync_result[
                    "failed_count"
                ],

            "processed":
                sync_result[
                    "processed"
                ],

            "skipped":
                sync_result[
                    "skipped"
                ],

            "failed":
                sync_result[
                    "failed"
                ],

            "processing_time":
                round(
                    elapsed,
                    2
                )
        }


    except Exception as e:

        # ----------------------------------------------------
        # DELETE TEMP ZIP IF ERROR
        # ----------------------------------------------------

        if os.path.exists(zip_path):

            try:
                os.remove(zip_path)

            except Exception:
                pass


        print(
            f"❌ Resume database upload failed: {e}"
        )


        return {

            "success": False,

            "message":
                "Resume database upload failed.",

            "error":
                str(e)
        }


# ============================================================
# SYNC INTERNAL DATABASE
# ============================================================

@router.post("/syncInternalDatabase")
def sync_internal_database():

    start_time = time.perf_counter()


    processed = []
    skipped = []
    failed = []


    # --------------------------------------------------------
    # GET FILES
    # --------------------------------------------------------

    try:

        files = os.listdir(
            INTERNAL_RESUME_FOLDER
        )

    except Exception as e:

        return {

            "message":
                "Unable to access internal resume folder.",

            "processed_count": 0,

            "skipped_count": 0,

            "failed_count": 1,

            "processed": [],

            "skipped": [],

            "failed": [
                {
                    "error": str(e)
                }
            ],

            "processing_time": 0
        }


    # --------------------------------------------------------
    # PROCESS EACH FILE
    # --------------------------------------------------------

    for filename in files:

        file_path = os.path.join(
            INTERNAL_RESUME_FOLDER,
            filename
        )


        # Ignore directories
        if not os.path.isfile(file_path):
            continue


        extension = os.path.splitext(
            filename
        )[1].lower()


        # Ignore unsupported files
        if extension not in ALLOWED_EXTENSIONS:
            continue


        try:

            # ==============================================
            # FILE HASH
            # ==============================================

            file_hash = calculate_file_hash(
                file_path
            )


            # ==============================================
            # CHECK DUPLICATE
            # ==============================================

            existing = resume_collection.find_one(
                {
                    "source":
                        "internal_database",

                    "file_hash":
                        file_hash
                }
            )


            if existing:

                skipped.append(
                    filename
                )

                continue


            # ==============================================
            # EXTRACT TEXT
            # ==============================================

            if extension == ".pdf":

                extracted_text = (
                    extract_text_from_pdf(
                        file_path
                    )
                )


            elif extension == ".docx":

                from docx import Document


                document = Document(
                    file_path
                )


                paragraphs = [

                    paragraph.text

                    for paragraph
                    in document.paragraphs

                    if paragraph.text.strip()
                ]


                extracted_text = "\n".join(
                    paragraphs
                )


            else:

                continue


            # ==============================================
            # CHECK TEXT
            # ==============================================

            if not extracted_text:

                failed.append(
                    {
                        "filename":
                            filename,

                        "error":
                            "No text could be extracted"
                    }
                )

                continue


            if not extracted_text.strip():

                failed.append(
                    {
                        "filename":
                            filename,

                        "error":
                            "No text could be extracted"
                    }
                )

                continue


            # ==============================================
            # GEMINI RESUME PARSING
            # ==============================================

            resume_json = parse_resume(
                extracted_text
            )


            if not isinstance(
                resume_json,
                dict
            ):

                failed.append(
                    {
                        "filename":
                            filename,

                        "error":
                            "Resume parser returned invalid data"
                    }
                )

                continue


            # ==============================================
            # STORE ORIGINAL TEXT
            # ==============================================

            resume_json[
                "resume_text"
            ] = extracted_text


            # ==============================================
            # SEARCH TEXT
            # ==============================================

            resume_text = resume_to_text(
                resume_json
            )


            # ==============================================
            # EMBEDDING
            # ==============================================

            embedding = create_embedding(
                resume_text
            )


            resume_json[
                "embedding"
            ] = embedding.tolist()


            # ==============================================
            # METADATA
            # ==============================================

            resume_json[
                "resume_file"
            ] = filename


            # Store normalized path
            resume_json[
                "resume_path"
            ] = os.path.normpath(
                file_path
            )


            resume_json[
                "source"
            ] = "internal_database"


            resume_json[
                "file_hash"
            ] = file_hash


            resume_json[
                "processed_at"
            ] = time.time()


            # ==============================================
            # MONGODB INSERT
            # ==============================================

            result = resume_collection.insert_one(
                resume_json
            )


            processed.append(
                {
                    "filename":
                        filename,

                    "id":
                        str(
                            result.inserted_id
                        )
                }
            )


        except Exception as e:

            print(
                f"❌ Failed processing "
                f"{filename}: {e}"
            )


            failed.append(
                {
                    "filename":
                        filename,

                    "error":
                        str(e)
                }
            )


    # ==============================================
    # TOTAL TIME
    # ==============================================

    elapsed = (
        time.perf_counter()
        - start_time
    )


    return {

        "message":
            "Internal database synchronization completed",

        "processed_count":
            len(processed),

        "skipped_count":
            len(skipped),

        "failed_count":
            len(failed),

        "processed":
            processed,

        "skipped":
            skipped,

        "failed":
            failed,

        "processing_time":
            round(
                elapsed,
                2
            )
    }


# ============================================================
# GET INTERNAL DATABASE
# ============================================================

@router.get("/internalDatabase")
def get_internal_database():

    resumes = list(
        resume_collection.find(
            {
                "source":
                    "internal_database"
            },
            {
                "embedding": 0
            }
        )
    )


    for resume in resumes:

        resume["_id"] = str(
            resume["_id"]
        )


    return resumes


# ============================================================
# GET RESUMES
# ============================================================

@router.get("/resumes")
def get_resumes():

    resumes = list(
        resume_collection.find(
            {
                "source":
                    "internal_database"
            },
            {
                "embedding": 0
            }
        )
    )


    for resume in resumes:

        resume["_id"] = str(
            resume["_id"]
        )


    return resumes


# ============================================================
# OPEN / SERVE RESUME FILE
# ============================================================

@router.get("/resume/{filename}")
def open_resume(filename: str):

    # --------------------------------------------------------
    # RESUME FOLDER
    # --------------------------------------------------------

    resume_folder = os.path.abspath(
        INTERNAL_RESUME_FOLDER
    )


    # --------------------------------------------------------
    # SECURITY
    #
    # Only allow the actual filename.
    # This prevents:
    #
    # ../something
    #
    # from accessing other files.
    # --------------------------------------------------------

    safe_filename = os.path.basename(
        filename
    )


    file_path = os.path.abspath(
        os.path.join(
            resume_folder,
            safe_filename
        )
    )


    # --------------------------------------------------------
    # PATH SECURITY CHECK
    # --------------------------------------------------------

    if not file_path.startswith(
        resume_folder + os.sep
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid resume filename."
        )


    # --------------------------------------------------------
    # FILE EXISTS?
    # --------------------------------------------------------

    if not os.path.isfile(
        file_path
    ):

        raise HTTPException(
            status_code=404,
            detail=(
                f"Resume file not found: "
                f"{safe_filename}"
            )
        )


    # --------------------------------------------------------
    # FILE TYPE
    # --------------------------------------------------------

    extension = os.path.splitext(
        file_path
    )[1].lower()


    if extension == ".pdf":

        media_type = (
            "application/pdf"
        )


    elif extension == ".docx":

        media_type = (
            "application/vnd.openxmlformats-officedocument."
            "wordprocessingml.document"
        )


    else:

        raise HTTPException(
            status_code=400,
            detail="Unsupported resume file type."
        )


    # --------------------------------------------------------
    # RETURN FILE
    #
    # inline = browser opens PDF instead of forcing
    # download.
    # --------------------------------------------------------

    return FileResponse(
        path=file_path,

        media_type=media_type,

        filename=safe_filename,

        content_disposition_type="inline"
    )