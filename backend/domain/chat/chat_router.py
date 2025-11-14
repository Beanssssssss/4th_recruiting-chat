from fastapi import APIRouter
from .chat_schema import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    user_message = req.message
    if "바보" in user_message:
        return ChatResponse(reply="응답을 불러오지 못했어요.")
    reply_text = f"'{user_message}'에 대한 답변입니다."
    return ChatResponse(reply=reply_text)


