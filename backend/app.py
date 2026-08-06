from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.uploads import router as upload_router
from routes.resumes import router as resume_router


from routes.job import router as job_router
from routes.match import router as match_router
from fastapi.staticfiles import StaticFiles
from routes.search_candidates import router as search_router
from routes.jd import router as jd_router
from routes.generate_jd import router as generate_jd_router

app = FastAPI()

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(upload_router)
app.include_router(resume_router)
app.include_router(job_router)
app.include_router(match_router)
app.include_router(search_router)
app.include_router(jd_router)

app.include_router(generate_jd_router)

@app.get("/")
def home():
    return {"message": "AI Resume Matcher API Running"}
    