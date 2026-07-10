from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.chapter import Chapter
from app.schemas.chapter import ChapterCreate, ChapterResponse


router = APIRouter(
    prefix="/chapters",
    tags=["Chapters"]
)


@router.post("/", response_model=ChapterResponse)
def create_chapter(
    chapter: ChapterCreate,
    db: Session = Depends(get_db)
):

    new_chapter = Chapter(
        project_id=chapter.project_id,
        title=chapter.title,
        content=chapter.content
    )

    db.add(new_chapter)
    db.commit()
    db.refresh(new_chapter)

    return new_chapter



@router.get("/{project_id}", response_model=list[ChapterResponse])
def get_chapters(
    project_id: int,
    db: Session = Depends(get_db)
):

    return db.query(Chapter).filter(
        Chapter.project_id == project_id
    ).all()



@router.put("/{chapter_id}", response_model=ChapterResponse)
def update_chapter(
    chapter_id: int,
    chapter: ChapterCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(Chapter).filter(
        Chapter.id == chapter_id
    ).first()


    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Kapitola nenájdená"
        )


    existing.title = chapter.title
    existing.content = chapter.content


    db.commit()
    db.refresh(existing)


    return existing
