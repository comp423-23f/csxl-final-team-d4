"""Models for statistic query history."""

from pydantic import BaseModel, root_validator
from .time_range import TimeRange
from datetime import datetime
from typing import Dict, Any


class QueryIdentity(BaseModel):
    """The identity of the query."""

    id: int


class Query(QueryIdentity):
    """The query history of the XL."""

    name: str = ""
    start_date: datetime
    end_date: datetime
    compare_start_date: datetime | None
    compare_end_date: datetime | None
    share: bool = False


class Query_noID(BaseModel):
    name: str = ""
    start_date: datetime
    end_date: datetime
    compare_start_date: datetime | None
    compare_end_date: datetime | None
    share: bool = False
