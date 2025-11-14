from sqlalchemy.orm import Session
from models import Question
from datetime import datetime
from .question_schema import QuestionCreate, QuestionUpdate


def get_question_list(db: Session, skip: int = 0, limit: int = 10, keyword: str = ""):
    """
    질문 목록 조회 (검색 + 페이징)
    """
    query = db.query(Question)

    # 검색어가 존재하면 subject 또는 content에서 LIKE 검색
    if keyword:
        like = f"%{keyword}%"
        query = query.filter(
            Question.subject.ilike(like) |
            Question.content.ilike(like)
        )

    total = query.count()

    # 최신순 정렬 + 페이징 처리
    question_list = (
        query.order_by(Question.create_date.desc())
             .offset(skip).limit(limit)
             .all()
    )

    return total, question_list


def get_question(db: Session, question_id: int):
    """
    question_id로 단일 질문 조회
    """
    return db.query(Question).filter(Question.id == question_id).first()


def create_question(db: Session, question_create: QuestionCreate):
    """
    새로운 질문 생성
    """
    q = Question(
        subject=question_create.subject,
        content=question_create.content,
        create_date=datetime.utcnow()
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return q


def update_question(db: Session, question_update: QuestionUpdate):
    """
    질문 수정 (subject, content 변경)
    """
    q = get_question(db, question_update.question_id)
    if not q:
        return None  # 존재하지 않으면 None 반환

    q.subject = question_update.subject
    q.content = question_update.content
    q.modify_date = datetime.utcnow()

    db.commit()
    db.refresh(q)
    return q


def delete_question(db: Session, question_id: int):
    """
    질문 삭제
    """
    q = get_question(db, question_id)
    if not q:
        return False  # 삭제할 대상 없으면 False

    db.delete(q)
    db.commit()
    return True