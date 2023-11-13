"""Models for statistic query history."""


from pydantic import BaseModel, root_validator
from .time_range import TimeRange
from datetime import datetime
from typing import Dict, Any


class Query(BaseModel):
    """The query history of the XL."""

    id: int
    name: str = ""
    start_date: datetime
    end_date: datetime
    compare_start_date: datetime | None
    compare_end_date: datetime | None


class Query_(BaseModel):
    """The query history of the XL."""

    name: str = ""
    start_date: datetime
    end_date: datetime
    compare_start_date: datetime | None
    compare_end_date: datetime | None
