"""
Skill aliases used to normalize different names
of the same technology.
"""

SKILL_ALIASES = {

    "python": [
        "python"
    ],

    "java": [
        "java"
    ],

    "javascript": [
        "javascript",
        "js"
    ],

    "typescript": [
        "typescript",
        "ts"
    ],

    "react": [
        "react",
        "reactjs"
    ],

    "node.js": [
        "node",
        "nodejs",
        "node.js"
    ],

    "fastapi": [
        "fast api",
        "fastapi"
    ],

    "spring boot": [
        "springboot",
        "spring boot"
    ],

    "docker": [
        "docker"
    ],

    "kubernetes": [
        "kubernetes",
        "k8s"
    ],

    "aws": [
        "aws",
        "amazon web services"
    ],

    "azure": [
        "azure"
    ],

    "mysql": [
        "mysql"
    ],

    "mongodb": [
        "mongodb",
        "mongo"
    ],

    "sql": [
        "sql"
    ],

    "html": [
        "html"
    ],

    "css": [
        "css"
    ]
}


def normalize_skill(skill):

    if not skill:
        return ""

    skill = skill.strip().lower()

    for canonical, aliases in SKILL_ALIASES.items():

        if skill == canonical.lower():
            return canonical

        if skill in [a.lower() for a in aliases]:
            return canonical

    return skill


def normalize_skill_list(skills):

    normalized = [
        normalize_skill(skill)
        for skill in skills
    ]

    return sorted(list(set(normalized)))