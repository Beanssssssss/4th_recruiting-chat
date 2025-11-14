"use client";
import QnaCard from "./QnaCard";
import qnaData from "./QnaData";

export default function MostQnaPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">자주 묻는 질문</h1>
      <p className="text-gray-600 mb-8">
        리크루팅 관련해서 자주 들어오는 질문과 답변을 모았습니다.
      </p>

      <div className="space-y-4">
        {qnaData.map((item, i) => (
          <QnaCard key={i} question={item.question} answer={item.answer} />
        ))}
      </div>
    </main>
  );
}