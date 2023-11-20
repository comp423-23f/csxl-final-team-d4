from typing import List
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from ...database import db_session
from ...models.coworking import Query
from ...entities.coworking import QueryEntity


class QueryService:
    def __init__(self, session: Session = Depends(db_session)):
        self._session = session

    def get_all(self) -> List[Query]:
        print("backend service method called")
        entities = self._session.query(QueryEntity).all()
        return [entity.to_model() for entity in entities]

    def add(self, query_data: dict) -> Query:
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

    def delete(self, query_name: str) -> bool:
        query = self._session.query(QueryEntity).filter_by(name=query_name).first()
        if query:
            self._session.delete(query)
            self._session.commit()
            return True
        return False

    def update_share(self, query_name: str) -> bool:
        query = self._session.query(QueryEntity).filter_by(name=query_name).first()
        if query:
            query.share = not query.share
            self._session.commit()
            return query.share
        raise HTTPException(status_code=404, detail="Query not found")
