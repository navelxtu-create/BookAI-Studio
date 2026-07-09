from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Chapter(Base):

    __tablename__ = "chapters"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id")
    )

    title: Mapped[str] = mapped_column(
        String(255)
    )

    content: Mapped[str] = mapped_column(
        Text
    )

    project: Mapped["Project"] = relationship(
        "Project",
        back_populates="chapters"
    )
