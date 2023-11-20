"""Query data for tests."""
import pytest
from sqlalchemy import text, select
from sqlalchemy.orm import Session
from .....entities.coworking import ReservationEntity, QueryEntity
from .....models.coworking import Reservation, ReservationState, ReservationRequest
from .....models.user import UserIdentity
from .....models.coworking.seat import SeatIdentity
from ..time import *
from .....models.coworking import Query

from ...core_data import user_data
from ...reset_table_id_seq import reset_table_id_seq
from .. import seat_data
from .. import operating_hours_data

# query_1: Query with no compare_start_date and compare_end_date
query_1: Query

# query_2: Query with compare_start_date and compare_end_date
query_2: Query

queries: list[Query]


def instantiate_global_models():
    global query_1, query_2
    global queries
    query_1 = Query(
        id=1,
        name="jkkk",
        start_date=datetime(2023, 10, 29),
        end_date=datetime(2023, 11, 29),
        compare_start_date=None,
        compare_end_date=None,
        share=False,
    )
    query_2 = Query(
        id=2,
        name="mango",
        start_date=datetime(2023, 10, 30),
        end_date=datetime(2023, 11, 30),
        compare_start_date=datetime(2023, 11, 29),
        compare_end_date=datetime(2023, 11, 30),
        share=True,
    )
    queries = [query_1, query_2]


@pytest.fixture(autouse=True)
def fake_data_fixture(session: Session):
    insert_fake_data(session)
    session.commit()


def insert_fake_data(session: Session):
    instantiate_global_models()

    for query in queries:
        entity = QueryEntity.from_model(query)
        session.add(entity)

    reset_table_id_seq(session, QueryEntity, QueryEntity.id, len(queries) + 1)
