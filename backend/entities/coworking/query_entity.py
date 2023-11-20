"""Entity for Query.""" ""

from sqlalchemy import Integer, String, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from ..entity_base import EntityBase
from ...models.coworking import Query  # type: ignore
from typing import Optional, Self
from datetime import datetime


class QueryEntity(EntityBase):
    """Entity for Query."""

    __tablename__ = "coworking__query"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    start_date: Mapped[datetime] = mapped_column(DateTime, index=True)
    end_date: Mapped[datetime] = mapped_column(DateTime, index=True)
    compare_start_date: Mapped[Optional[datetime]] = mapped_column(DateTime, index=True)
    compare_end_date: Mapped[Optional[datetime]] = mapped_column(DateTime, index=True)
    share: Mapped[bool] = mapped_column(Boolean, default=False)

    def to_model(self) -> Query:
        return Query(
            id=self.id,
            name=self.name,
            start_date=self.start_date,
            end_date=self.end_date,
            compare_start_date=self.compare_start_date,
            compare_end_date=self.compare_end_date,
            share=self.share,
        )

    @classmethod
    def from_model(cls, model: Query) -> Self:
        return cls(
            id=model.id,
            name=model.name,
            start_date=model.start_date,
            end_date=model.end_date,
            compare_start_date=model.compare_start_date,
            compare_end_date=model.compare_end_date,
            share=model.share,
        )
