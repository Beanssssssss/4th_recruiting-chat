# Placeholder CRUD layer. Replace with DB integration.
from typing import List, Tuple, Optional
from datetime import datetime
from .question_schema import Question, QuestionCreate, QuestionUpdate

_MEM_DB: List[Question] = []
_id_seq = 1
# 🔥 DB가 비었을 때 dummy Question 객체 생성 (dict 아님!)
dummy = [
    Question(
        id=1,
        subject="임시 질문 1",
        content="현재 데이터베이스가 비어 있어 표시하는 더미 데이터입니다.",
        create_date=datetime.now(),
        modify_date=None
    ),
    Question(
        id=2,
        subject="임시 질문 2",
        content="PlanetScale 연동 후 실제 데이터가 들어오면 사라질 예정입니다.",
        create_date=datetime.now(),
        modify_date=None
    ),
]

def get_question_list(skip: int = 0, limit: int = 10, keyword: str = "") -> Tuple[int, List[Question]]:
    data = _MEM_DB.copy()  # 원본 훼손 방지 위해 copy

    # 검색 필터
    if keyword:
        k = keyword.lower()
        data = [q for q in data if k in q.subject.lower() or k in q.content.lower()]

    # 🔥 최신순 정렬 (create_date 기준 내림차순)
    data.sort(key=lambda q: q.create_date, reverse=True)

    total = len(data)

    # 더미 데이터 반환 시에도 정렬해야 함
    if total == 0:
        dummy_sorted = sorted(dummy, key=lambda q: q.create_date, reverse=True)
        return len(dummy_sorted), dummy_sorted

    # 페이지네이션
    page = data[skip: skip + limit]

    return total, page


def get_question(question_id: int) -> Optional[Question]:
    for q in _MEM_DB:
        if q.id == question_id:
            return q
    for d in dummy:
        if d.id == question_id:
            return d
    return None


def create_question(question_create: QuestionCreate) -> Question:
    global _id_seq
    q = Question(
        id=_id_seq,
        subject=question_create.subject,
        content=question_create.content,
        create_date=datetime.utcnow(),
        modify_date=None,
    )
    _MEM_DB.append(q)
    _id_seq += 1
    return q


def update_question(question_update: QuestionUpdate) -> Optional[Question]:
    q = get_question(question_update.question_id)
    if not q:
        return None
    q.subject = question_update.subject
    q.content = question_update.content
    q.modify_date = datetime.utcnow()
    return q


def delete_question(question_id: int) -> bool:
    global _MEM_DB
    before = len(_MEM_DB)
    _MEM_DB = [q for q in _MEM_DB if q.id != question_id]
    return len(_MEM_DB) != before


