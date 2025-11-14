from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from database import get_db
from . import question_crud
from .question_schema import (
    QuestionList, Question, QuestionCreate,
    QuestionUpdate, QuestionDelete
)

router = APIRouter(prefix="/board/questions", tags=["Question"])


# 📌 질문 목록 조회 (페이징 + 검색)
@router.get("/list", response_model=QuestionList)
def question_list(
    page: int = 0,
    size: int = 10,
    keyword: str = "",
    db: Session = Depends(get_db)
):
    total, items = question_crud.get_question_list(db, skip=page * size, limit=size, keyword=keyword)
    return {"total": total, "question_list": items}


# 📌 질문 상세 조회
@router.get("/detail/{question_id}", response_model=Question)
def question_detail(question_id: int, db: Session = Depends(get_db)):
    q = question_crud.get_question(db, question_id)
    if not q:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="데이터를 찾을 수 없습니다.")
    return q


# 📌 질문 생성
@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=Question)
def question_create(payload: QuestionCreate, db: Session = Depends(get_db)):
    q = question_crud.create_question(db, payload)
    return q


# 📌 질문 수정
@router.put("/update", response_model=Question)
def question_update(payload: QuestionUpdate, db: Session = Depends(get_db)):
    q = question_crud.update_question(db, payload)
    if not q:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="데이터를 찾을 수 없습니다.")
    return q


# 📌 질문 삭제
@router.delete("/delete", status_code=status.HTTP_204_NO_CONTENT)
def question_delete(payload: QuestionDelete, db: Session = Depends(get_db)):
    ok = question_crud.delete_question(db, payload.question_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="데이터를 찾을 수 없습니다.")
    return






