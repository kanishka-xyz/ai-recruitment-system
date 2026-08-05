"""
Skill taxonomy.

Defines related technologies that receive
partial matching.
"""

SKILL_TAXONOMY = {

    "python": [
        "django",
        "flask",
        "fastapi"
    ],

    "java": [
        "spring boot"
    ],

    "react": [
        "next.js",
        "redux"
    ],

    "javascript": [
        "typescript"
    ],

    "node.js": [
        "express"
    ],

    "docker": [
        "kubernetes"
    ]
}


def get_related_skills(skill):

    return SKILL_TAXONOMY.get(
        skill.lower(),
        []
    )


def has_related_skill(skill, resume_skills):

    related = get_related_skills(skill.lower())

    resume_skills = [
        s.lower()
        for s in resume_skills
    ]

    return any(
        r.lower() in resume_skills
        for r in related
    )