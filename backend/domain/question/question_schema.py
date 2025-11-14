from typing import Optional, List
from pydantic import BaseModel, field_validator
import datetime


class Question(BaseModel):
    id: int
    subject: str
    content: str
    create_date: datetime.datetime
    modify_date: Optional[datetime.datetime] = None


class QuestionCreate(BaseModel):
    subject: str
    content: str

    @field_validator("subject", "content")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("빈 값은 허용되지 않습니다.")
        return v


class QuestionList(BaseModel):
    total: int = 0
    question_list: List[Question] = []


class QuestionUpdate(QuestionCreate):
    question_id: int


class QuestionDelete(BaseModel):
    question_id: int







