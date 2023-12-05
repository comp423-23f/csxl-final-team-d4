"""ReservationService#calculate_percentage_of_longer_stays tests."""

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


def test_calculate_percentage_of_longer_stays_for_day(
    reservation_svc: ReservationService,
):
    end_date = datetime.now()
    time_range = "day"

    expect_calculate_pentage = reservation_svc.calculate_percentage_of_longer_stays(
        user_data.user, time_range
    )

    start_date = reservation_svc._get_start_date_for_time_range(end_date, time_range)

    user_reservations = [
        reservation
        for reservation in reservation_data.reservations
        if (
            reservation.users == [user_data.user]
            and ReservationState.CHECKED_OUT in reservation.state
            and reservation.start >= start_date
            and reservation.end <= end_date
        )
    ]
    if not user_reservations:
        assert expect_calculate_pentage == 0
        return

    all_reservations = [
        reservation
        for reservation in reservation_data.reservations
        if (
            ReservationState.CHECKED_OUT in reservation.state
            and reservation.start >= start_date
            and reservation.end <= end_date
        )
    ]

    user_stay_times = [
        (res.end - res.start).total_seconds() for res in user_reservations
    ]
    all_stay_times = [(res.end - res.start).total_seconds() for res in all_reservations]

    count_longer_stays = sum(
        user_stay > other_stay
        for user_stay in user_stay_times
        for other_stay in all_stay_times
    )
    total_comparisons = len(user_stay_times) * len(all_stay_times)

    percentage = (
        (count_longer_stays / total_comparisons) * 100 if total_comparisons else 0.00
    )
    calculate_pentage = round(percentage, 2)

    assert calculate_pentage == expect_calculate_pentage


def test_calculate_percentage_of_longer_stays_for_week(
    reservation_svc: ReservationService,
):
    end_date = datetime.now()
    time_range = "week"

    expect_calculate_pentage = reservation_svc.calculate_percentage_of_longer_stays(
        user_data.user, time_range
    )

    start_date = reservation_svc._get_start_date_for_time_range(end_date, time_range)

    user_reservations = [
        reservation
        for reservation in reservation_data.reservations
        if (
            reservation.users == [user_data.user]
            and ReservationState.CHECKED_OUT in reservation.state
            and reservation.start >= start_date
            and reservation.end <= end_date
        )
    ]
    if not user_reservations:
        assert expect_calculate_pentage == 0
        return

    all_reservations = [
        reservation
        for reservation in reservation_data.reservations
        if (
            ReservationState.CHECKED_OUT in reservation.state
            and reservation.start >= start_date
            and reservation.end <= end_date
        )
    ]

    user_stay_times = [
        (res.end - res.start).total_seconds() for res in user_reservations
    ]
    all_stay_times = [(res.end - res.start).total_seconds() for res in all_reservations]

    count_longer_stays = sum(
        user_stay > other_stay
        for user_stay in user_stay_times
        for other_stay in all_stay_times
    )
    total_comparisons = len(user_stay_times) * len(all_stay_times)

    percentage = (
        (count_longer_stays / total_comparisons) * 100 if total_comparisons else 0.00
    )
    calculate_pentage = round(percentage, 2)

    assert calculate_pentage == expect_calculate_pentage


def test_calculate_percentage_of_longer_stays_for_month(
    reservation_svc: ReservationService,
):
    end_date = datetime.now()
    time_range = "month"

    expect_calculate_pentage = reservation_svc.calculate_percentage_of_longer_stays(
        user_data.user, time_range
    )

    start_date = reservation_svc._get_start_date_for_time_range(end_date, time_range)

    user_reservations = [
        reservation
        for reservation in reservation_data.reservations
        if (
            reservation.users == [user_data.user]
            and ReservationState.CHECKED_OUT in reservation.state
            and reservation.start >= start_date
            and reservation.end <= end_date
        )
    ]
    if not user_reservations:
        assert expect_calculate_pentage == 0
        return

    all_reservations = [
        reservation
        for reservation in reservation_data.reservations
        if (
            ReservationState.CHECKED_OUT in reservation.state
            and reservation.start >= start_date
            and reservation.end <= end_date
        )
    ]

    user_stay_times = [
        (res.end - res.start).total_seconds() for res in user_reservations
    ]
    all_stay_times = [(res.end - res.start).total_seconds() for res in all_reservations]

    count_longer_stays = sum(
        user_stay > other_stay
        for user_stay in user_stay_times
        for other_stay in all_stay_times
    )
    total_comparisons = len(user_stay_times) * len(all_stay_times)

    percentage = (
        (count_longer_stays / total_comparisons) * 100 if total_comparisons else 0.00
    )
    calculate_pentage = round(percentage, 2)

    assert calculate_pentage == expect_calculate_pentage


def test_calculate_percentage_of_longer_stays_for_year(
    reservation_svc: ReservationService,
):
    end_date = datetime.now()
    time_range = "year"

    expect_calculate_pentage = reservation_svc.calculate_percentage_of_longer_stays(
        user_data.user, time_range
    )

    start_date = reservation_svc._get_start_date_for_time_range(end_date, time_range)

    user_reservations = [
        reservation
        for reservation in reservation_data.reservations
        if (
            reservation.users == [user_data.user]
            and ReservationState.CHECKED_OUT in reservation.state
            and reservation.start >= start_date
            and reservation.end <= end_date
        )
    ]
    if not user_reservations:
        assert expect_calculate_pentage == 0
        return

    all_reservations = [
        reservation
        for reservation in reservation_data.reservations
        if (
            ReservationState.CHECKED_OUT in reservation.state
            and reservation.start >= start_date
            and reservation.end <= end_date
        )
    ]

    user_stay_times = [
        (res.end - res.start).total_seconds() for res in user_reservations
    ]
    all_stay_times = [(res.end - res.start).total_seconds() for res in all_reservations]

    count_longer_stays = sum(
        user_stay > other_stay
        for user_stay in user_stay_times
        for other_stay in all_stay_times
    )
    total_comparisons = len(user_stay_times) * len(all_stay_times)

    percentage = (
        (count_longer_stays / total_comparisons) * 100 if total_comparisons else 0.00
    )
    calculate_pentage = round(percentage, 2)

    assert calculate_pentage == expect_calculate_pentage
