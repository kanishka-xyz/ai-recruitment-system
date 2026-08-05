"""
matching/gap_analysis.py

Generates recruiter-friendly gap analysis.
"""


def analyze_gaps(jd, resume, breakdown):

    strengths = []

    gaps = []

    suggestions = []

    # -----------------------------
    # Skills
    # -----------------------------

    skills = breakdown["skills"]

    if skills["matched_skills"]:

        strengths.append(

            f"Matched {len(skills['matched_skills'])} mandatory skill(s)."

        )

    if skills["partial_matches"]:

        strengths.append(

            f"{len(skills['partial_matches'])} related technologies matched."

        )

    if skills["missing_skills"]:

        gaps.append(

            f"Missing {len(skills['missing_skills'])} mandatory skill(s)."

        )

        suggestions.extend(

            skills["missing_skills"]

        )

    # -----------------------------
    # Experience
    # -----------------------------

    experience = breakdown["experience"]

    if experience["score"] >= 80:

        strengths.append(

            "Relevant industry experience."

        )

    else:

        gaps.append(

            "Experience is below the job requirement."

        )

    # -----------------------------
    # Education
    # -----------------------------

    education = breakdown["education"]

    if education["score"] == 100:

        strengths.append(

            "Education requirement satisfied."

        )

    else:

        gaps.append(

            education["reason"]

        )

    # -----------------------------
    # Certifications
    # -----------------------------

    cert = breakdown["certifications"]

    if cert["matched_certifications"]:

        strengths.append(

            "Relevant certifications found."

        )

    if cert["missing_certifications"]:

        gaps.append(

            "Required certifications missing."

        )

        suggestions.extend(

            cert["missing_certifications"]

        )

    # -----------------------------
    # Projects
    # -----------------------------

    projects = breakdown["projects"]

    if projects["score"] >= 70:

        strengths.append(

            "Strong project portfolio."

        )

    # -----------------------------
    # Achievements
    # -----------------------------

    achievements = breakdown["achievements"]

    if achievements["score"] >= 50:

        strengths.append(

            "Relevant achievements."

        )

    # -----------------------------
    # Internships
    # -----------------------------

    internships = breakdown["internships"]

    if internships["score"] >= 60:

        strengths.append(

            "Relevant internship experience."

        )

    return {

        "strengths": strengths,

        "gaps": gaps,

        "upskilling_suggestions": sorted(
            list(set(suggestions))
        )

    }