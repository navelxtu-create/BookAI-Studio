from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.ai.writer import writer
from app.db.session import get_db
from app.models.chapter import Chapter
from app.schemas.chapter import ChapterResponse


router = APIRouter(
    prefix="/ai",
    tags=["AI Writer"]
)


class OutlineRequest(BaseModel):
    topic: str


class ChapterRequest(BaseModel):
    project_id: int
    title: str
    instruction: str


@router.post("/outline")
def create_outline(
    request: OutlineRequest
):

    return writer.create_outline(
        request.topic
    )


@router.post(
    "/chapter",
    response_model=ChapterResponse
)
def create_chapter(
    request: ChapterRequest,
    db: Session = Depends(get_db)
):

    content = writer.write_chapter(
        request.title,
        request.instruction
    )

    chapter = Chapter(
        project_id=request.project_id,
        title=request.title,
        content=content
    )

    db.add(chapter)
    db.commit()
    db.refresh(chapter)

    return chapter
