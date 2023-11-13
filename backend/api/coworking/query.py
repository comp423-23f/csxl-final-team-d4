from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from backend.api.authentication import registered_user, authenticated_pid
from backend.models.user import User
from ...database import db_session
from ...services.coworking.query import QueryService
from ...models.coworking import Query, Query_

api = APIRouter(prefix="/api/coworking/queries")
openapi_tags = {
    "name": "Coworking",
    "description": "Methods to deal with query table",
}


@api.get("/get-all-queries/", response_model=List[Query], tags=["Coworking"])
def get_all_queries(
    user: User = Depends(authenticated_pid),
    query_svc: QueryService = Depends(QueryService),
) -> List[Query]:
    return query_svc.get_all()


@api.post("/save-reports", response_model=Query, tags=["Coworking"])
def create_query(
    query_data: Query_,  # Changed from Query to Query_
    query_svc: QueryService = Depends(QueryService),
    user: User = Depends(authenticated_pid),
) -> Query:
    return query_svc.add(query_data.model_dump())


@api.delete("/delete-query/{query_name}", response_model=bool, tags=["Coworking"])
def delete_query(
    query_name: str,
    query_svc: QueryService = Depends(QueryService),
    user: User = Depends(authenticated_pid),
) -> bool:
    if not query_svc.delete(query_name):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Query not found"
        )
    return True
