"""
matching/achievements.py

Calculates achievement score.
"""

# ======================================================
# Achievement Keywords with Weight
# ======================================================

ACHIEVEMENT_WEIGHTS = {

    # Software
    "hackathon": 20,
    "winner": 20,
    "runner up": 15,
    "open source": 20,
    "github": 15,
    "patent": 25,
    "research paper": 20,
    "publication": 20,

    # Manufacturing
    "cost saving": 25,
    "lean": 20,
    "kaizen": 20,
    "six sigma": 20,
    "zero defect": 25,
    "best employee": 20,
    "quality award": 20,

    # Sales
    "top performer": 20,
    "employee of the month": 15,
    "revenue": 20,

    # Generic
    "award": 15,
    "certificate of appreciation": 10,
    "recognition": 10
}


# ======================================================
# Normalize
# ======================================================

def normalize(items):

    if not items:
        return []

    return [
        item.strip().lower()
        for item in items
        if item
    ]


# ======================================================
# Achievement Score
# ======================================================

def achievement_match_score(jd, resume):

    achievements = normalize(
        resume.get("achievements", [])
    )

    if not achievements:

        return {

            "score": 0,

            "matched_achievements": [],

            "total_achievements": 0
        }

    score = 0

    matched = []

    for achievement in achievements:

        for keyword, value in ACHIEVEMENT_WEIGHTS.items():

            if keyword in achievement:

                score += value

                matched.append(achievement)

                break

    score = min(score, 100)

    return {

        "score": round(score, 2),

        "matched_achievements": matched,

        "total_achievements": len(achievements)
    }


# ======================================================
# Testing
# ======================================================

if __name__ == "__main__":

    resume = {

        "achievements": [

            "Winner of National Hackathon",

            "Implemented Cost Saving Project",

            "Best Employee Award"
        ]
    }

    print(

        achievement_match_score(
            {},
            resume
        )

    )