from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import projects
from app.api.routes import chapters
from app.api.routes import ai


app = FastAPI(
    title="BookAI Studio"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(projects.router)
app.include_router(chapters.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {
        "message": "BookAI Studio API online"
    }
