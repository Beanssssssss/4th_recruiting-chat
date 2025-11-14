from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from domain.answer import answer_schema, answer_crud
from domain.question import question_crud
from models import Answer

router = APIRouter(prefix="/board/answers", tags=["Answer"])

# 답변 리스트
@router.get("/list/{question_id}", response_model=list[answer_schema.Answer])
def answer_list(question_id: int, db: Session = Depends(get_db)):
    return db.query(Answer).filter(Answer.question_id == question_id).all()

# CREATE
@router.post("/create/{question_id}", response_model=answer_schema.Answer)
def answer_create(question_id: int,
                  _answer_create: answer_schema.AnswerCreate,
                  db: Session = Depends(get_db)):
    
    question = question_crud.get_question(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return answer_crud.create_answer(db, question, _answer_create)

# DETAIL
@router.get("/detail/{answer_id}", response_model=answer_schema.Answer)
def answer_detail(answer_id: int, db: Session = Depends(get_db)):
    answer = answer_crud.get_answer(db, answer_id)
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")
    return answer

# UPDATE
@router.put("/update", response_model=answer_schema.Answer)
def answer_update(_answer_update: answer_schema.AnswerUpdate,
                  db: Session = Depends(get_db)):

    db_answer = answer_crud.get_answer(db, _answer_update.answer_id)
    if not db_answer:
        raise HTTPException(status_code=404, detail="Answer not found")
    
    return answer_crud.update_answer(db, db_answer, _answer_update)

# DELETE
@router.delete("/delete", status_code=status.HTTP_204_NO_CONTENT)
def answer_delete(_answer_delete: answer_schema.AnswerDelete,
                  db: Session = Depends(get_db)):
    
    db_answer = answer_crud.get_answer(db, _answer_delete.answer_id)
    if not db_answer:
        raise HTTPException(status_code=404, detail="Answer not found")

    answer_crud.delete_answer(db, db_answer)
    return