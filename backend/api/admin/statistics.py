from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
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

from fastapi import Depends


api = APIRouter(prefix="/api/statistics")
openapi_tags = {
    "name": "Statistics",
    "description": "Analysis of registration statisitcs.",
}


@api.get("/get_stats/{start_date}/{end_date}", tags=["Statistics"])
def get_stats(
    start_date: datetime,
    end_date: datetime,
    reservation_svc: ReservationService = Depends(),
    user: User = Depends(authenticated_pid),
) -> dict:
    try:
        return reservation_svc.get_mean_stay_and_peak_checkin_info(
            user, start_date, end_date
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
