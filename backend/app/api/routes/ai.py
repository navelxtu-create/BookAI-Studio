from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.writer import writer

router = APIRouter(
    prefix="/ai",
    tags=["AI Writer"]
)


class OutlineRequest(BaseModel):
    topic: str


class ChapterRequest(BaseModel):
    title: str
    instruction: str


class BookRequest(BaseModel):
    topic: str


@router.post("/outline")
def create_outline(request: OutlineRequest):

    return writer.create_outline(
        request.topic
    )


@router.post("/chapter")
def create_chapter(request: ChapterRequest):

    content = writer.write_chapter(
        request.title,
        request.instruction
    )

    return {
        "title": request.title,
        "content": content
    }
