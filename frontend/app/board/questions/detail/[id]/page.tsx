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

interface Answer {
  id: number;
  content: string;
  create_date: string;
  modify_date?: string | null;
}

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const q = await fetch(`http://127.0.0.1:8000/board/questions/detail/${id}`)
          .then(res => res.json());
        setQuestion(q);

        const a = await fetch(`http://127.0.0.1:8000/board/answers/list/${id}`)
          .then(res => res.json());
        setAnswers(a);
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="p-6 text-gray-500 animate-pulse">로딩 중...</div>
    );

  if (!question)
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4 font-semibold">
          질문 정보를 불러오지 못했습니다.
        </p>
        <Link
          href="/board"
          className="text-blue-600 underline hover:text-blue-800"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-10">

      {/* 질문 제목 */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg rounded-2xl p-8 space-y-3">
        <h1 className="text-3xl font-extrabold text-gray-800">{question.subject}</h1>

        <div className="text-sm text-gray-500 flex gap-4">
          <span>작성일: {new Date(question.create_date).toLocaleString()}</span>
          {question.modify_date && (
            <span>수정일: {new Date(question.modify_date).toLocaleString()}</span>
          )}
        </div>

        <p className="leading-8 text-gray-700 whitespace-pre-wrap pt-3">
          {question.content}
        </p>
      </div>

      {/* 답변 섹션 */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            답변 ({answers.length})
          </h2>

          <Link
            href={`/board/answers/create?question_id=${id}`}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow"
          >
            ✏️ 답변 달기
          </Link>
        </div>

        {/* 답변 리스트 */}
        <div className="space-y-4">
          {answers.length === 0 && (
            <p className="text-gray-500">아직 답변이 없습니다.</p>
          )}

          {answers.map((ans) => (
            <div
              key={ans.id}
              className="p-5 bg-white/70 border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-all"
            >
              <p className="text-gray-800 leading-7">{ans.content}</p>

              <div className="text-xs text-gray-400 mt-3 flex gap-4">
                <span>작성일: {new Date(ans.create_date).toLocaleString()}</span>
                {ans.modify_date && (
                  <span>수정일: {new Date(ans.modify_date).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 뒤로가기 */}
      <div>
        <Link
          href="/board"
          className="inline-block px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
        >
          ← 목록으로
        </Link>
      </div>

    </main>
  );
}