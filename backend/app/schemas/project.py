from pydantic import BaseModel


class ProjectCreate(BaseModel):
    title: str
    description: str | None = None


class ChapterShortResponse(BaseModel):
    id: int
    project_id: int
    title: str
    content: str

    class Config:
        from_attributes = True


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    chapters: list[ChapterShortResponse] = []

    class Config:
        from_attributes = True
