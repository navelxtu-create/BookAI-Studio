from pydantic import BaseModel


class ChapterCreate(BaseModel):
    project_id: int
    title: str
    content: str


class ChapterResponse(BaseModel):
    id: int
    project_id: int
    title: str
    content: str

    class Config:
        from_attributes = True
