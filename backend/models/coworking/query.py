"""Models for statistic query history."""


from pydantic import BaseModel
from .time_range import TimeRange
from datetime import datetime


class Query(BaseModel):
    """The query history of the XL."""

    id: int | None = None
    name: str = ""
    start_date: datetime
    end_date: datetime
    compare_start_date: datetime | None
    compare_end_date: datetime | None
