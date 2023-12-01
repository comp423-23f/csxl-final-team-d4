"""Coworking Client Reservation API

This API is used to make and manage reservations."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException

from backend.services.user import UserService
from ..authentication import authenticated_pid, registered_user
from starlette.responses import JSONResponse
from ...services.coworking.reservation import ReservationService
from ...models import User
from ...models.coworking import (
    Reservation,
    ReservationRequest,
    ReservationPartial,
    ReservationState,
)

__authors__ = ["Kris Jordan"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"


api = APIRouter(prefix="/api/coworking")
openapi_tags = {
    "name": "Coworking",
    "description": "Coworking reservations, status, and XL Ambassador functionality.",
}


@api.post("/reservation", tags=["Coworking"])
def draft_reservation(
    reservation_request: ReservationRequest,
    subject: User = Depends(registered_user),
    reservation_svc: ReservationService = Depends(),
) -> Reservation:
    """Draft a reservation request."""
    return reservation_svc.draft_reservation(subject, reservation_request)


@api.get("/reservation/{id}", tags=["Coworking"])
def get_reservation(
    id: int,
    subject: User = Depends(registered_user),
    reservation_svc: ReservationService = Depends(),
) -> Reservation:
    return reservation_svc.get_reservation(subject, id)


@api.put("/reservation/{id}", tags=["Coworking"])
def update_reservation(
    reservation: ReservationPartial,
    subject: User = Depends(registered_user),
    reservation_svc: ReservationService = Depends(),
) -> Reservation:
    """Modify a reservation."""
    return reservation_svc.change_reservation(subject, reservation)


@api.delete("/reservation/{id}", tags=["Coworking"])
def cancel_reservation(
    id: int,
    subject: User = Depends(registered_user),
    reservation_svc: ReservationService = Depends(),
) -> Reservation:
    """Cancel a reservation."""
    return reservation_svc.change_reservation(
        subject, ReservationPartial(id=id, state=ReservationState.CANCELLED)
    )


@api.get("/statistics/get-daily", tags=["Coworking"])
def get_daily_reservation_counts(
    year_start: int,
    month_start: int,
    day_start: int,
    year_end: int,
    month_end: int,
    day_end: int,
    subject: User = Depends(registered_user),
    reservation_svc: ReservationService = Depends(),
):
    """Get daily reservation counts with start and end dates specified as year, month, day."""

    try:
        start_date = datetime(year=year_start, month=month_start, day=day_start)
        end_date = datetime(
            year=year_end, month=month_end, day=day_end, hour=23, minute=59, second=59
        )
        print("Start:", start_date)

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid date: {exc}")
    counts = reservation_svc.count_reservations_by_date(subject, start_date, end_date)
    print(counts)

    return counts


@api.get("/statistics/get_personal_statistical_history", tags=["Coworking"])
def get_personal_statistical_history(
    subject: User = Depends(registered_user),
    reservation_svc: ReservationService = Depends(),
    pid_onyen: tuple[int, str] = Depends(authenticated_pid),
    user_svc: UserService = Depends(),
):
    """Get Personal Statistical History"""
    pid, onyen = pid_onyen
    user = user_svc.get(pid)
    if user:
        reservation = reservation_svc.get_personl_reservation_history(user)
    else:
        raise Exception("User is None")
    return reservation
