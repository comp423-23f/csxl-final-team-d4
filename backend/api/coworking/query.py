from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.api.authentication import registered_user
from backend.models.user import User
from ...database import db_session
from ...services.coworking.query import QueryService
from ...models.coworking import Query

openapi_tags = {
    "name": "Coworking",
    "description": "Methods to handle requests of queries",
}

api = APIRouter(prefix="/api/coworking/queries")


@api.get("/get-all-query/", response_model=List[Query], tags=["Coworking"])
def get_all_queries(
    subject: User = Depends(registered_user),
    query_svc: QueryService = Depends(QueryService),
) -> List[Query]:
    return query_svc.get_all()


@api.post("/create-query", response_model=Query, tags=["Coworking"])
def create_query(
    query: Query, query_svc: QueryService = Depends(QueryService)
) -> Query:
    return query_svc.add(query.model_dump())


@api.delete("/delete-query/{query_id}", response_model=bool, tags=["Coworking"])
def delete_query(
    query_id: int, query_svc: QueryService = Depends(QueryService)
) -> bool:
    deleted_query = query_svc.delete(query_id)
    if not deleted_query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Query not found"
        )
    return deleted_query
