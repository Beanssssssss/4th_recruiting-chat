from fastapi import APIRouter, HTTPException, status
from . import question_crud
from .question_schema import QuestionList, Question, QuestionCreate, QuestionUpdate, QuestionDelete

router = APIRouter(prefix="/board/questions", tags=["Question"])


@router.get("/list", response_model=QuestionList)
def question_list(page: int = 0, size: int = 10, keyword: str = ""):
    total, question_list = question_crud.get_question_list(skip=page * size, limit=size, keyword=keyword)
    return {"total": total, "question_list": question_list}

@router.get("/detail/{question_id}", response_model=Question)
def question_detail(question_id: int):
    q = question_crud.get_question(question_id)
    if not q:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="데이터를 찾을 수 없습니다.")
    return q


@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=Question)
def question_create(payload: QuestionCreate):
    q = question_crud.create_question(payload)
    return q


@router.put("/update", response_model=Question)
def question_update(payload: QuestionUpdate):
    q = question_crud.update_question(payload)
    if not q:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="데이터를 찾을 수 없습니다.")
    return q


@router.delete("/delete", status_code=status.HTTP_204_NO_CONTENT)
def question_delete(payload: QuestionDelete):
    ok = question_crud.delete_question(payload.question_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="데이터를 찾을 수 없습니다.")
    return







