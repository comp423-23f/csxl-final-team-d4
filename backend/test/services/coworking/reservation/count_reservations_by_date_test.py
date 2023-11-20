"""ReservationService#get_seat_reservations_by_date tests."""

from unittest.mock import create_autospec, call

from backend.models.coworking.reservation import ReservationState

from .....services.coworking import ReservationService
from .....services import PermissionService
from .....models.coworking import Reservation
from .....services.exceptions import ResourceNotFoundException, UserPermissionException

# Imported fixtures provide dependencies injected for the tests as parameters.
# Dependent fixtures (seat_svc) are required to be imported in the testing module.
from ..fixtures import (
    reservation_svc,
    permission_svc,
    seat_svc,
    policy_svc,
    operating_hours_svc,
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


def test_count_reservations_by_date(reservation_svc: ReservationService):
    """Expected case of this service method."""
    count: int = sum(
        reservation_svc.count_reservations_by_date(
            user_data.ambassador, datetime(2023, 10, 29), datetime(2023, 11, 15)
        ).values()
    )
    non_cancelled_reservations = [
        reservation
        for reservation in reservation_data.reservations
        if (
            ReservationState.CANCELLED not in reservation.state
            and reservation.start >= datetime(2023, 10, 29)
            and reservation.end < datetime(2023, 11, 15) + timedelta(days=1)
        )
    ]

    # Assert that the method returns the correct count
    assert count == len(non_cancelled_reservations)
