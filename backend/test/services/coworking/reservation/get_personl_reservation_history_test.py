"""ReservationService#get_current_reservations_for_user tests."""

from unittest.mock import create_autospec

from backend.services.exceptions import ResourceNotFoundException

from .....services.coworking import ReservationService

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


def test_get_personal_reservation_for_user_as_user(
    reservation_svc: ReservationService,
):
    """Get reservations for each user _as the user themself_."""
    reservations = reservation_svc.get_personl_reservation_history(user_data.user)
    assert len(reservations) == 1
    assert reservations[0].id == reservation_data.reservation_1.id

    reservations = reservation_svc.get_personl_reservation_history(user_data.ambassador)
    assert len(reservations) == 1
    assert reservations[0].id == reservation_data.reservation_2.id

    reservations = reservation_svc.get_personl_reservation_history(user_data.root)
    assert len(reservations) == 1
    assert reservations[0].id == reservation_data.reservation_3.id


def test_get_non_existing_personal_reservation(
    reservation_svc: ReservationService,
):
    reservations = reservation_svc.get_personl_reservation_history(user_data.user)
    assert len(reservations) == 1
    assert reservations[1] == None
