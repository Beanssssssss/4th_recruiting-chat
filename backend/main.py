from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from domain.chat import chat_router as domain_chat
from domain.question import question_router as domain_question
from domain.answer import answer_router as domain_answer
app = FastAPI(
    title="HateSlop 4th Recruiting Chatbot API",
    description="Handles chatbot Q&A requests",
    version="1.0.0"
)

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 중엔 * 허용, 운영시엔 ["https://your-domain.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

# ✅ 라우터 등록
app.include_router(domain_chat.router)
app.include_router(domain_question.router)
app.include_router(domain_answer.router)
# 기본 루트 테스트용
@app.get("/")
def root():
    return {"message": "FastAPI backend is running 🚀"}