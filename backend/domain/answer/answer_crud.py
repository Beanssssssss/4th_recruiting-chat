from datetime import datetime
from zoneinfo import ZoneInfo
from sqlalchemy.orm import Session
from models import Question, Answer
from domain.answer.answer_schema import AnswerCreate, AnswerUpdate

KST = ZoneInfo("Asia/Seoul")

def create_answer(db: Session, question: Question, answer_create: AnswerCreate):
    answer = Answer(
        content=answer_create.content,
        create_date=datetime.now(KST),   # 🔥 UTC → KST
        question=question
    )
    db.add(answer)
    db.commit()
    db.refresh(answer)
    return answer


def get_answer(db: Session, answer_id: int):
    return db.query(Answer).filter(Answer.id == answer_id).first()


def get_answer_list(db: Session, question_id: int):
    return (
        db.query(Answer)
        .filter(Answer.question_id == question_id)
        .order_by(Answer.create_date.asc())
        .all()
    )


def update_answer(db: Session, db_answer: Answer, answer_update: AnswerUpdate):
    db_answer.content = answer_update.content
    db_answer.modify_date = datetime.now(KST)  # 🔥 KST로 수정일 저장
    db.commit()
    db.refresh(db_answer)
    return db_answer


def delete_answer(db: Session, db_answer: Answer):
    db.delete(db_answer)
    db.commit()
    return True