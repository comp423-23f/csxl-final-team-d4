from typing import List
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import db_session
from ...models.coworking import Query
from ..exceptions import UserPermissionException, ResourceNotFoundException
from ...entities.coworking import QueryEntity

from ..permission import PermissionService
from ...models.user import User


class QueryException(Exception):
    def __init__(self, message: str):
        super().__init__(message)


class QueryService:
    def __init__(
        self,
        session: Session = Depends(db_session),
        permission_svc: PermissionService = Depends(),
    ):
        self._session = session
        self._permission_svc = permission_svc

    def get_all(self, subject: User) -> List[Query]:
        # self._permission_svc.enforce(subject, "coworking.queries.read", f"user/*")
        print("backend service method called")
        entities = self._session.query(QueryEntity).all()
        return [entity.to_model() for entity in entities]

    def add(self, subject: User, query_data: dict) -> Query:
        self._permission_svc.enforce(subject, "coworking.queries.manage", f"user/*")
        existing_query = (
            self._session.query(QueryEntity).filter_by(name=query_data["name"]).first()
        )
        if existing_query:
            raise HTTPException(
                status_code=400, detail="A saved report with this name already exists"
            )
        new_query = QueryEntity(**query_data)
        self._session.add(new_query)
        self._session.commit()
        self._session.refresh(new_query)
        return new_query.to_model()

    def delete(self, subject: User, query_name: str) -> bool:
        self._permission_svc.enforce(subject, "coworking.queries.manage", f"user/*")
        query = self._session.query(QueryEntity).filter_by(name=query_name).first()
        if query:
            self._session.delete(query)
            self._session.commit()
            return True
        return False

    def update_share(self, subject: User, query_name: str) -> bool:
        self._permission_svc.enforce(subject, "coworking.queries.manage", f"user/*")
        query = self._session.query(QueryEntity).filter_by(name=query_name).first()
        if query:
            query.share = not query.share
            self._session.commit()
            return query.share
        raise HTTPException(status_code=404, detail="Query not found")

    def get_shared(self) -> List[Query]:
        shared_entities = self._session.query(QueryEntity).filter_by(share=True).all()
        return [entity.to_model() for entity in shared_entities]
