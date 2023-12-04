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
    """Revised test to cover individual dates and edge cases."""
    start_date = datetime(2023, 10, 29)
    end_date = datetime(2023, 11, 30)

    # Call the method under test
    reservation_count_by_date = reservation_svc.count_reservations_by_date(
        user_data.user, start_date, end_date
    )
    # Check the count for each date in the range
    for single_date in (
        start_date + timedelta(days=n) for n in range((end_date - start_date).days + 1)
    ):
        expected_count = len(
            [
                reservation
                for reservation in reservation_data.reservations
                if (
                    reservation.start.date() == single_date.date()
                    and ReservationState.CANCELLED not in reservation.state
                    and ReservationState.DRAFT not in reservation.state
                )
            ]
        )
        assert (
            reservation_count_by_date[single_date.date()] == expected_count
        ), f"Mismatch on date: {single_date.date()}"

    # Verify total count
    total_count = sum(reservation_count_by_date.values())
    non_cancelled_reservations = [
        reservation
        for reservation in reservation_data.reservations
        if (
            ReservationState.CANCELLED not in reservation.state
            and ReservationState.DRAFT not in reservation.state
            and reservation.start >= start_date
            and reservation.end < end_date + timedelta(days=1)
        )
    ]
    assert total_count == len(non_cancelled_reservations), "Total count mismatch"

    # Verify that there are no counts for dates outside the range
    for date_outside_range in [
        start_date - timedelta(days=1),
        end_date + timedelta(days=1),
    ]:
        assert (
            date_outside_range.date() not in reservation_count_by_date
        ), f"Unexpected count for date outside range: {date_outside_range.date()}"
