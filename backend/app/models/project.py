from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Project(Base):

    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    title: Mapped[str] = mapped_column(
        String(255)
    )

    description: Mapped[str | None]

    chapters: Mapped[list["Chapter"]] = relationship(
        "Chapter",
        back_populates="project",
        cascade="all, delete-orphan"
    )
