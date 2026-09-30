from fastapi import APIRouter
from matching.search import search_candidates
import time

router = APIRouter()


@router.post("/searchCandidates")
def search_candidates_api(jd_json: dict):

    # ============================================================
    # TOTAL TIMER
    # ============================================================
    total_start = time.perf_counter()

    print("\n")
    print("=" * 70)
    print("🔎 SEARCH CANDIDATES STARTED")
    print("=" * 70)

    # ============================================================
    # SEARCH / MATCHING
    # ============================================================
    start = time.perf_counter()

    candidates = search_candidates(jd_json)

    search_time = time.perf_counter() - start

    print(f"🧠 Candidate matching    : {search_time:.2f} sec")
    print(f"👥 Candidates returned   : {len(candidates)}")

    # ============================================================
    # TOTAL TIME
    # ============================================================
    total_time = time.perf_counter() - total_start

    print("-" * 70)
    print(f"⏱️ TOTAL /searchCandidates: {total_time:.2f} sec")
    print("=" * 70)
    print()

    return candidates