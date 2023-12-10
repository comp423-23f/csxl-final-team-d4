"""ReservationService#get_seat_reservations_by_date tests."""

from unittest.mock import create_autospec, call

from fastapi import HTTPException
from backend.models.coworking.reservation import ReservationState
from . import query_data
from .query_data import *
from .....models.coworking import Query
from .....services.coworking import ReservationService
from .....services import PermissionService
from .....models.coworking import Reservation
from .....services.exceptions import (
    QueryAlreadyExistsException,
    QueryDoesntExistsException,
    ResourceNotFoundException,
    UserPermissionException,
)
from .....services.coworking.query import QueryService

# Imported fixtures provide dependencies injected for the tests as parameters.
# Dependent fixtures (seat_svc) are required to be imported in the testing module.
from ..fixtures import (
    reservation_svc,
    permission_svc,
    seat_svc,
    policy_svc,
    operating_hours_svc,
    query_svc,
)
from ..time import *

# Import the setup_teardown fixture explicitly to load entities in database.
# The order in which these fixtures run is dependent on their imported alias.
# Since there are relationship dependencies between the entities, order matters.
from ...core_data import setup_insert_data_fixture as insert_order_0
from ..operating_hours_data import fake_data_fixture as insert_order_1
from ..room_data import fake_data_fixture as insert_order_2
from ..seat_data import fake_data_fixture as insert_order_3
from .reservation_data import fake_data_fixture as insert_order_4

# Import the fake model data in a namespace for test assertions
from ...core_data import user_data
from .. import seat_data
from . import reservation_data


def test_get_all(query_svc: QueryService):
    all: list[Query] = query_svc.get_all(user_data.ambassador)
    assert len(all) == len(query_data.queries)
    for query in query_data.queries:
        assert query in all


def test_add_existent(query_svc: QueryService):
    with pytest.raises(QueryAlreadyExistsException):
        new_query = dict(
            id=1,
            name="jkkk",
            start_date=datetime(2023, 10, 29),
            end_date=datetime(2023, 11, 29),
            compare_start_date=None,
            compare_end_date=None,
            share=False,
        )
        permission_svc = create_autospec(PermissionService)
        permission_svc.enforce.return_value = None
        query_svc._permission_svc = permission_svc

        query_svc.add(user_data.root, new_query)
        permission_svc.enforce.assert_called_once_with(
            user_data.root,
            "coworking.queries.manage",
            f"user/*",
        )


def test_add_non_existent(query_svc: QueryService):
    new_query = dict(
        id=3,
        name="sakai",
        start_date=datetime(2023, 10, 29),
        end_date=datetime(2023, 11, 29),
        compare_start_date=None,
        compare_end_date=None,
        share=False,
    )
    new_query_1 = Query(
        id=3,
        name="sakai",
        start_date=datetime(2023, 10, 29),
        end_date=datetime(2023, 11, 29),
        compare_start_date=None,
        compare_end_date=None,
        share=False,
    )

    permission_svc = create_autospec(PermissionService)
    permission_svc.enforce.return_value = None
    query_svc._permission_svc = permission_svc

    query = query_svc.add(user_data.root, new_query)
    assert query.id is not None
    permission_svc.enforce.assert_called_once_with(
        user_data.root,
        "coworking.queries.manage",
        f"user/*",
    )


def test_delete_existent(query_svc: QueryService):
    permission_svc = create_autospec(PermissionService)
    permission_svc.enforce.return_value = None
    query_svc._permission_svc = permission_svc

    boolean = query_svc.delete(user_data.root, "jkkk")
    deleted = [query for query in query_data.queries if query.name == "jkkk"]
    all: list[Query] = query_svc.get_all(user_data.root)
    assert len(all) == len(query_data.queries) - 1
    assert deleted[0] not in all
    assert boolean
    permission_svc.enforce.assert_called_once_with(
        user_data.root,
        "coworking.queries.manage",
        f"user/*",
    )


def test_delete_non_existent(query_svc: QueryService):
    permission_svc = create_autospec(PermissionService)
    permission_svc.enforce.return_value = None
    query_svc._permission_svc = permission_svc

    boolean = query_svc.delete(user_data.root, "jk")
    deleted = [query for query in query_data.queries if query.name == "jkkk"]
    all: list[Query] = query_svc.get_all(user_data.root)
    assert boolean == False

    permission_svc.enforce.assert_called_once_with(
        user_data.root,
        "coworking.queries.manage",
        f"user/*",
    )


def test_update_share(query_svc: QueryService):
    permission_svc = create_autospec(PermissionService)
    permission_svc.enforce.return_value = None
    query_svc._permission_svc = permission_svc

    boolean = query_svc.update_share(user_data.root, "jkkk")
    updated = [
        query for query in query_svc.get_all(user_data.root) if query.name == "jkkk"
    ]
    origin = [query for query in query_data.queries if query.name == "jkkk"]
    assert updated[0].share != origin[0].share
    assert boolean

    permission_svc.enforce.assert_called_once_with(
        user_data.root,
        "coworking.queries.manage",
        f"user/*",
    )


def test_update_non_exist_share(query_svc: QueryService):
    with pytest.raises(QueryDoesntExistsException):
        permission_svc = create_autospec(PermissionService)
        permission_svc.enforce.return_value = None
        query_svc._permission_svc = permission_svc
        query_svc.update_share(user_data.root, "jk")
        permission_svc.enforce.assert_called_once_with(
            user_data.root,
            "coworking.queries.manage",
            f"user/*",
        )


def test_get_share(query_svc: QueryService):
    shared = [query for query in query_svc.get_shared() if query.share == True]
    origin = [query for query in query_data.queries if query.share == True]
    assert shared == origin
