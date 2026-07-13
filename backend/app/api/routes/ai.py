from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.ai.writer import writer
from app.core.config import settings

router = APIRouter(
    prefix="/ai",
    tags=["AI Writer"]
)


class OutlineRequest(BaseModel):
    topic: str
    chapter_count: int = 6
    genre: str = "román"
    tone: str = "pútavý"


class ChapterRequest(BaseModel):
    title: str
    instruction: str
    style: str = "literárny"
    tone: str = "pútavý"


class BookRequest(BaseModel):
    topic: str


class RuntimeConfigRequest(BaseModel):
    ai_provider: str | None = None
    openai_api_key: str | None = None
    openai_model: str | None = None
    ollama_url: str | None = None
    ollama_model: str | None = None


@router.get("/status")
def provider_status():

    return writer.get_provider_status()


@router.post("/config")
def update_runtime_config(request: RuntimeConfigRequest):

    if request.ai_provider is not None:
        settings.ai_provider = request.ai_provider

    if request.openai_api_key is not None:
        settings.openai_api_key = request.openai_api_key

    if request.openai_model is not None:
        settings.openai_model = request.openai_model

    if request.ollama_url is not None:
        settings.ollama_url = request.ollama_url

    if request.ollama_model is not None:
        settings.ollama_model = request.ollama_model

    try:
        writer.refresh_provider()
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        ) from error

    return writer.get_provider_status()


@router.post("/outline")
def create_outline(request: OutlineRequest):

    return writer.create_outline(
        topic=request.topic,
        chapter_count=request.chapter_count,
        genre=request.genre,
        tone=request.tone,
    )


@router.post("/chapter")
def create_chapter(request: ChapterRequest):

    try:
        content = writer.write_chapter(
            title=request.title,
            instruction=request.instruction,
            style=request.style,
            tone=request.tone,
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"AI provider error: {error}"
        ) from error

    return {
        "title": request.title,
        "content": content
    }
