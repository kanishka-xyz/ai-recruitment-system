from fastapi import APIRouter
from database.mongodb import resume_collection
import time

router = APIRouter()


@router.get("/resumes")
def get_resumes():

    total_start = time.perf_counter()

    print("\n" + "=" * 70)
    print("📋 FETCHING ALL RESUMES")
    print("=" * 70)

    # ------------------------------------------------------------
    # MongoDB fetch
    # ------------------------------------------------------------
    start = time.perf_counter()

    resumes = list(
        resume_collection.find(
            {},
            {"_id": 0}
        )
    )

    mongo_time = time.perf_counter() - start

    print(f"🍃 MongoDB fetch       : {mongo_time:.2f} sec")
    print(f"👥 Resumes fetched     : {len(resumes)}")

    # ------------------------------------------------------------
    # Total time
    # ------------------------------------------------------------
    total_time = time.perf_counter() - total_start

    print(f"⏱️ TOTAL /resumes TIME : {total_time:.2f} sec")

    print("=" * 70)
    print()

    return resumes