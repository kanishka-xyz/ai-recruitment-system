def resume_to_text(resume):

    text = []

    # Name
    text.append(f"Name: {resume.get('name', '')}")

    # Skills
    skills = []
    for skill in resume.get("skills", []):
        if isinstance(skill, dict):
            skills.append(
                skill.get("name")
                or skill.get("skill")
                or skill.get("technology")
                or ""
            )
        else:
            skills.append(str(skill))

    text.append("Skills: " + ", ".join(filter(None, skills)))

    # Education
    education = []
    for edu in resume.get("education", []):
        if isinstance(edu, dict):

            degree = edu.get("degree", "")
            institution = edu.get("institution", "")
            year = edu.get("year", "")

            education.append(
                f"{degree} {institution} {year}".strip()
            )

        else:
            education.append(str(edu))

    text.append("Education: " + ", ".join(filter(None, education)))

    # Experience
    experiences = []
    for exp in resume.get("experience", []):

        if isinstance(exp, dict):

            role = exp.get("role", "")
            company = exp.get("company", "")
            duration = exp.get("duration", "")

            experiences.append(
                f"{role} {company} {duration}".strip()
            )

        else:
            experiences.append(str(exp))

    text.append("Experience: " + ", ".join(filter(None, experiences)))

    # Projects
    projects = []
    for project in resume.get("projects", []):

        if isinstance(project, dict):
            projects.append(
                project.get("title")
                or project.get("name")
                or ""
            )

        else:
            projects.append(str(project))

    text.append("Projects: " + ", ".join(filter(None, projects)))

    # Certifications
    certifications = []

    for cert in resume.get("certifications", []):

        if isinstance(cert, dict):
            certifications.append(
                cert.get("name")
                or cert.get("title")
                or ""
            )

        else:
            certifications.append(str(cert))

    text.append("Certifications: " + ", ".join(filter(None, certifications)))

    return "\n".join(text)


def jd_to_text(jd):

    text = []

    text.append(f"Job Title: {jd.get('job_title','')}")

    text.append(f"Department: {jd.get('department','')}")

    text.append(f"Industry: {jd.get('industry','')}")

    # Skills
    skills = []

    for skill in jd.get("skills", []):

        if isinstance(skill, dict):
            skills.append(
                skill.get("name")
                or skill.get("skill")
                or ""
            )

        else:
            skills.append(str(skill))

    text.append("Skills: " + ", ".join(filter(None, skills)))

    # Education
    education = []

    for edu in jd.get("education", []):

        if isinstance(edu, dict):
            education.append(
                edu.get("degree")
                or edu.get("name")
                or ""
            )

        else:
            education.append(str(edu))

    text.append("Education: " + ", ".join(filter(None, education)))

    # Certifications
    certs = []

    for cert in jd.get("certifications", []):

        if isinstance(cert, dict):
            certs.append(
                cert.get("name")
                or cert.get("title")
                or ""
            )

        else:
            certs.append(str(cert))

    text.append("Certifications: " + ", ".join(filter(None, certs)))

    # Tools
    tools = []

    for tool in jd.get("tools", []):

        if isinstance(tool, dict):
            tools.append(
                tool.get("name")
                or tool.get("tool")
                or ""
            )

        else:
            tools.append(str(tool))

    text.append("Tools: " + ", ".join(filter(None, tools)))

    # Experience
    experience = jd.get("experience", {})

    if isinstance(experience, dict):
        text.append(
            f"Experience: {experience.get('min',0)}-{experience.get('max',0)} years"
        )
    else:
        text.append(f"Experience: {experience}")

    text.append(f"Summary: {jd.get('summary','')}")

    return "\n".join(text)