"""
matching/explanation.py

Generates recruiter-friendly explanations
for ATS results.
"""


def generate_explanation(breakdown):

    strengths = []
    weaknesses = []
    missing_skills = []

    # ---------------------------------------
    # Skills
    # ---------------------------------------

    skills = breakdown["skills"]

    if skills["score"] >= 80:
        strengths.append(
            "Excellent skill match."
        )

    elif skills["score"] >= 60:
        strengths.append(
            "Good skill match."
        )

    else:
        weaknesses.append(
            "Low skill match."
        )

    if skills["missing_skills"]:

        missing_skills.extend(
            skills["missing_skills"]
        )

        weaknesses.append(
            f"Missing {len(skills['missing_skills'])} mandatory skill(s)."
        )

    # ---------------------------------------
    # Experience
    # ---------------------------------------

    experience = breakdown["experience"]

    if experience["years_score"] == 100:
        strengths.append(
            "Experience meets or exceeds requirement."
        )
    else:
        weaknesses.append(
            "Experience below requirement."
        )

    # ---------------------------------------
    # Education
    # ---------------------------------------

    education = breakdown["education"]

    if education["score"] == 100:
        strengths.append(
            "Required education satisfied."
        )
    else:
        weaknesses.append(
            education["reason"]
        )

    # ---------------------------------------
    # Certifications
    # ---------------------------------------

    cert = breakdown["certifications"]

    if cert["matched_certifications"]:
        strengths.append(
            "Relevant certifications available."
        )

    if cert["missing_certifications"]:
        weaknesses.append(
            "Some required certifications are missing."
        )

    # ---------------------------------------
    # Projects
    # ---------------------------------------

    projects = breakdown["projects"]

    if projects["score"] >= 70:
        strengths.append(
            "Relevant projects found."
        )

    # ---------------------------------------
    # Achievements
    # ---------------------------------------

    achievements = breakdown["achievements"]

    if achievements["score"] >= 50:
        strengths.append(
            "Relevant achievements available."
        )

    # ---------------------------------------
    # Internships
    # ---------------------------------------

    internships = breakdown["internships"]

    if internships["score"] >= 60:
        strengths.append(
            "Relevant internship experience."
        )

    # ---------------------------------------
    # Summary
    # ---------------------------------------

    if len(strengths) > len(weaknesses):

        summary = (
            "Strong candidate with good alignment to the job requirements."
        )

    elif len(strengths) == len(weaknesses):

        summary = (
            "Candidate partially matches the job requirements."
        )

    else:

        summary = (
            "Candidate requires further evaluation."
        )

    return {

        "strengths": strengths,

        "weaknesses": weaknesses,

        "missing_skills": list(set(missing_skills)),

        "summary": summary
    }