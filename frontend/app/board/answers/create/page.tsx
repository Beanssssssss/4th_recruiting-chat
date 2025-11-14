"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Question {
  id: number;
  subject: string;
  content: string;
  create_date: string;
  modify_date?: string | null;
}

export default function AnswerCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const question_id = searchParams.get("question_id");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState<Question | null>(null);
  const [qLoading, setQLoading] = useState(true);

  // 🔥 질문 내용 로딩
  useEffect(() => {
    if (!question_id) return;

    fetch(`http://127.0.0.1:8000/board/questions/detail/${question_id}`)
      .then((res) => res.json())
      .then((data) => setQuestion(data))
      .catch(() => setQuestion(null))
      .finally(() => setQLoading(false));
  }, [question_id]);

  if (!question_id) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <p className="text-red-500">question_id가 없습니다.</p>
        <Link href="/board/questions" className="text-blue-600 underline">
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  if (qLoading)
    return (
      <main className="max-w-3xl mx-auto p-6">
        <p>질문 정보를 불러오는 중...</p>
      </main>
    );

  if (!question)
    return (
      <main className="max-w-3xl mx-auto p-6">
        <p className="text-red-500">질문을 불러오지 못했습니다.</p>
        <Link href="/board/questions" className="text-blue-600 underline">
          목록으로 돌아가기
        </Link>
      </main>
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/board/answers/create/${question_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );

      if (!res.ok) {
        alert("답변 등록 실패");
        return;
      }

      router.push(`/board/questions/detail/${question_id}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">

      {/* 🔥 질문 제목 + 내용 */}
      <h1 className="text-3xl font-bold mb-4 text-blue-700">
        {question.subject}
      </h1>

      <div className="text-sm text-gray-500 mb-6">
        <p>작성일: {new Date(question.create_date).toLocaleString()}</p>
        {question.modify_date && (
          <p>수정일: {new Date(question.modify_date).toLocaleString()}</p>
        )}
      </div>

      <div className="p-4 bg-white border rounded-lg shadow-md mb-8 whitespace-pre-wrap">
        {question.content}
      </div>

      <hr className="my-6" />

      {/* 🔥 답변 작성 폼 */}
      <h2 className="text-xl font-bold mb-4 text-blue-700">답변 작성</h2>

      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white border rounded-lg shadow-md space-y-4"
      >
        <textarea
          className="w-full border rounded p-3"
          rows={8}
          placeholder="답변 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>

        <div className="flex justify-end gap-3">
          <Link
            href={`/board/questions/detail/${question_id}`}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            취소
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </form>
    </main>
  );
}