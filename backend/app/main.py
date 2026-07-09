from fastapi import FastAPI

from app.api.routes import projects
from app.api.routes import chapters
from app.api.routes import ai


app = FastAPI(
    title="BookAI Studio"
)


app.include_router(projects.router)
app.include_router(chapters.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {
        "message": "BookAI Studio API online"
    }
