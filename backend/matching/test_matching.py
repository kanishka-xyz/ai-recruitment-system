from matching.text_converter import resume_to_text, jd_to_text
from matching.search import semantic_score

resume = {
    "name": "Rahul",
    "skills": [
        "React.js",
        "Node.js",
        "Python",
        "MongoDB"
    ],
    "education": [
        "B.Tech Computer Science"
    ],
    "experience": [
        {
            "role": "Full Stack Developer"
        }
    ]
}

jd = {
    "job_title": "Graphic Designer",
    "skills": [
        "Adobe Photoshop",
        "Illustrator",
        "Figma",
        "UI/UX Design",
        "Video Editing"
    ],
    "tools": [
        "Photoshop",
        "Illustrator"
    ],
    "education": [
        "Bachelor of Design"
    ],
    "experience": {
        "min": 1,
        "max": 3
    }
}

resume_text = resume_to_text(resume)
jd_text = jd_to_text(jd)

score = semantic_score(resume_text, jd_text)

print("Similarity Score:", score)