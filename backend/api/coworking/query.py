from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ...database import db_session  # Adjust the import path as needed
from ...services.coworking.query import QueryService  # Adjust the import path as needed
from ...models.coworking import Query  # Adjust the import path as needed

api = APIRouter(prefix="/api/queries")


@api.get("/", response_model=List[Query], tags=["Queries"])
def get_all_queries(query_svc: QueryService = Depends(QueryService)) -> List[Query]:
    return query_svc.get_all()


@api.post("/", response_model=Query, tags=["Queries"])
def create_query(
    query: Query, query_svc: QueryService = Depends(QueryService)
) -> Query:
    """Endpoint to create a new query record."""
    return query_svc.add(query.model_dump())


@api.delete("/{query_id}", response_model=Query, tags=["Queries"])
def delete_query(
    query_id: int, query_svc: QueryService = Depends(QueryService)
) -> Query:
    """Endpoint to delete a query record by ID."""
    deleted_query = query_svc.delete(query_id)
    if not deleted_query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Query not found"
        )
    return deleted_query  # type: ignore
