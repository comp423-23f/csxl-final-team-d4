from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from backend.api.authentication import registered_user, authenticated_pid
from backend.models.user import User
from ...database import db_session
from ...services.coworking.query import QueryService
from ...models.coworking import Query, Query_noID

api = APIRouter(prefix="/api/admin/queries")
openapi_tags = {
    "name": "Query",
    "description": "Methods to deal with query table",
}


@api.get("/get_all_queries", response_model=List[Query], tags=["Coworking"])
def get_all_queries(
    # user: User = Depends(authenticated_pid),
    subject: User = Depends(registered_user),
    query_svc: QueryService = Depends(),
) -> List[Query]:
    try:
        return query_svc.get_all(subject)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


@api.post("/save_reports", response_model=Query, tags=["Coworking"])
def create_query(
    query_data: Query_noID,
    subject: User = Depends(registered_user),
    query_svc: QueryService = Depends(),
    # user: User = Depends(authenticated_pid),
) -> Query:
    return query_svc.add(subject, query_data.model_dump())


@api.delete("/delete_query/{query_name}", response_model=bool, tags=["Coworking"])
def delete_query(
    query_name: str,
    subject: User = Depends(registered_user),
    query_svc: QueryService = Depends(),
    # user: User = Depends(authenticated_pid),
) -> bool:
    if not query_svc.delete(subject, query_name):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Query not found"
        )
    return True


@api.get("/update_share/{query_name}", response_model=bool, tags=["Coworking"])
def update_query_share(
    query_name: str,
    subject: User = Depends(registered_user),
    query_svc: QueryService = Depends(),
    # user: User = Depends(authenticated_pid),
) -> bool:
    try:
        return query_svc.update_share(subject, query_name)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


@api.get("/get_shared_queries", response_model=List[Query], tags=["Coworking"])
def get_shared_queries(
    user: User = Depends(registered_user),
    query_svc: QueryService = Depends(QueryService),
) -> List[Query]:
    try:
        return query_svc.get_shared()
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
