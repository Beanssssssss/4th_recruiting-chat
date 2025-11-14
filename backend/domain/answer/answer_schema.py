import datetime
from typing import Optional, List
from pydantic import BaseModel, field_validator


class AnswerCreate(BaseModel):
    content: str

    @field_validator('content')
    @classmethod
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('빈 값은 허용되지 않습니다.')
        return v


class Answer(BaseModel):
    id: int
    content: str
    create_date: datetime.datetime
    question_id: int
    modify_date: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True  # Pydantic v2에서는 orm_mode 대신 from_attributes 사용


class AnswerUpdate(AnswerCreate):
    answer_id: int


class AnswerDelete(BaseModel):
    answer_id: int


class AnswerVote(BaseModel):
    answer_id: int