"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Question {
  id: number;
  subject: string;
  content: string;
  create_date: string;
  modify_date?: string | null;
}

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:8000/board/questions/detail/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load question");
        return res.json();
      })
      .then((data) => setQuestion(data))
      .catch((err) => {
        console.error(err);
        setQuestion(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <p className="p-6 text-gray-500">로딩 중...</p>;

  if (!question)
    return (
      <div className="p-6">
        <p className="text-red-500 mb-4">질문 정보를 불러오지 못했습니다.</p>
        <Link href="/board" className="text-blue-600 underline">
          목록으로 돌아가기
        </Link>
      </div>
    );

  const created = new Date(question.create_date).toLocaleString();
  const modified = question.modify_date
    ? new Date(question.modify_date).toLocaleString()
    : null;

  return (
    <main className="max-w-3xl mx-auto p-6">
      {/* 제목 */}
      <h1 className="text-3xl font-bold mb-2 text-blue-700">
        {question.subject}
      </h1>

      {/* 날짜 */}
      <div className="text-sm text-gray-500 mb-6">
        <p>작성일: {created}</p>
        {modified && <p>수정일: {modified}</p>}
      </div>

      {/* 내용 카드 */}
      <div className="p-6 bg-white border rounded-xl shadow-md space-y-4 leading-8">
        <div className="text-gray-800 whitespace-pre-wrap">
          {question.content}
        </div>
      </div>

      {/* 뒤로가기 버튼 */}
      <div className="mt-8">
        <Link
          href="/board"
          className="inline-block px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
        >
          ← 목록으로
        </Link>
      </div>
    </main>
  );
}