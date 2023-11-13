from typing import List
from fastapi import Depends
from sqlalchemy.orm import Session
from ...database import db_session
from ...models.coworking import Query, Query_
from ...entities.coworking import QueryEntity


class QueryService:
    def __init__(self, session: Session = Depends(db_session)):
        self._session = session

    def get_all(self) -> List[Query]:
        entities = self._session.query(QueryEntity).all()
        return [entity.to_model() for entity in entities]

    def add(self, query_data: dict) -> Query:
        new_query = QueryEntity(**query_data)
        self._session.add(new_query)
        self._session.commit()
        self._session.refresh(new_query)
        return new_query.to_model()

    def delete(self, query_id: int) -> bool:
        query = self._session.query(QueryEntity).filter_by(id=query_id).first()
        if query:
            self._session.delete(query)
            self._session.commit()
            return True
        return False
