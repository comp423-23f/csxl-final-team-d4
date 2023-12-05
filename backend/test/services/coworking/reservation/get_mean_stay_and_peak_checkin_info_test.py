"""ReservationService#get_mean_stay_and_peak_checkin_info tests."""

from unittest.mock import create_autospec, call

import pandas as pd

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


def test_mean_stay(reservation_svc: ReservationService):
    """Revised test to cover individual dates and edge cases."""
    start_date = datetime(2023, 10, 29)
    end_date = datetime(2023, 11, 30)

    mean_stay_and_peak_checkin = reservation_svc.get_mean_stay_and_peak_checkin_info(
        user_data.user, start_date, end_date
    )

    mean_stay = mean_stay_and_peak_checkin.get("mean_stay_time")

    checked_out_reservations = [
        reservation
        for reservation in reservation_data.reservations
        if (
            ReservationState.CANCELLED not in reservation.state
            and ReservationState.DRAFT not in reservation.state
            and ReservationState.CHECKED_OUT in reservation.state
            and reservation.start >= start_date
            and reservation.end <= end_date
        )
    ]

    stay_times = [(r.end - r.start).total_seconds() for r in checked_out_reservations]

    expect_mean_stay = (
        timedelta(seconds=sum(stay_times) / len(stay_times))
        if stay_times
        else timedelta(0)
    )

    assert mean_stay == str(expect_mean_stay), "Mean stay mismatch"


def test_most_common_checkin_day(reservation_svc: ReservationService):
    """Revised test to cover individual dates and edge cases."""
    start_date = datetime(2023, 10, 29)
    end_date = datetime(2023, 11, 30)

    mean_stay_and_peak_checkin = reservation_svc.get_mean_stay_and_peak_checkin_info(
        user_data.user, start_date, end_date
    )

    most_common_checkin_day = mean_stay_and_peak_checkin.get("most_common_checkin_day")

    checkin_reservations = [
        reservation
        for reservation in reservation_data.reservations
        if (
            ReservationState.CHECKED_IN in reservation.state
            and ReservationState.CONFIRMED in reservation.state
            and ReservationState.CHECKED_OUT in reservation.state
            and reservation.start >= start_date
            and reservation.start < end_date
        )
    ]

    df = pd.DataFrame(
        [{"day": r.start.weekday(), "hour": r.start.hour} for r in checkin_reservations]
    )

    most_common_day = df["day"].mode()[0] if not df.empty else None

    days_of_week = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]

    expect_most_common_day_str = (
        days_of_week[most_common_day] if most_common_day is not None else "N/A"
    )

    assert (
        most_common_checkin_day == expect_most_common_day_str
    ), "Most common checkin day mismatch"


def test_most_common_checkin_hour(reservation_svc: ReservationService):
    """Revised test to cover individual dates and edge cases."""
    start_date = datetime(2023, 10, 29)
    end_date = datetime(2023, 11, 30)

    mean_stay_and_peak_checkin = reservation_svc.get_mean_stay_and_peak_checkin_info(
        user_data.user, start_date, end_date
    )

    most_common_checkin_hour = mean_stay_and_peak_checkin.get(
        "most_common_checkin_hour"
    )

    checkin_reservations = [
        reservation
        for reservation in reservation_data.reservations
        if (
            ReservationState.CHECKED_IN in reservation.state
            and ReservationState.CONFIRMED in reservation.state
            and ReservationState.CHECKED_OUT in reservation.state
            and reservation.start >= start_date
            and reservation.start < end_date
        )
    ]

    df = pd.DataFrame(
        [{"day": r.start.weekday(), "hour": r.start.hour} for r in checkin_reservations]
    )

    most_common_hour = df["hour"].mode()[0] if not df.empty else None

    expect_most_common_hour_str = (
        f"{most_common_hour:02d}:00-{(most_common_hour+1)%24:02d}:00"
        if most_common_hour is not None
        else "N/A"
    )

    assert (
        most_common_checkin_hour == expect_most_common_hour_str
    ), "Most common checkin hour mismatch"
