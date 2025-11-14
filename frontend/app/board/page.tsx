"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Question {
  id: number;
  subject: string;
  content?: string;
}

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/board/questions/list")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.question_list)) {
          setQuestions(data.question_list);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const start = (page - 1) * pageSize;
  const paginated = questions.slice(start, start + pageSize);
  const totalPages = Math.ceil(questions.length / pageSize);

  return (
    <main className="max-w-3xl mx-auto p-6">

      {/* 제목 + 질문 등록 버튼 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-700">질문 목록</h1>
        <Link
          href="/board/questions/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          질문 등록
        </Link>
      </div>

      {/* 🔥 로딩 중 */}
      {loading && <p className="p-4 text-gray-500">로딩 중...</p>}

      {/* 🔥 질문 없음 */}
      {!loading && questions.length === 0 && (
        <p className="p-4 text-gray-500">질문이 없습니다.</p>
      )}

      {/* 🔥 질문 목록 */}
      {!loading && questions.length > 0 && (
        <>
          <ul className="space-y-4">
            {paginated.map((q, index) => (
              <li key={q.id}>
                <Link
                  href={`/board/questions/detail/${q.id}`}
                  className="block p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <span className="text-gray-500 font-semibold min-w-[24px]">
                      {start + index + 1}.
                    </span>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {q.subject}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {q.content?.slice(0, 50) ?? "내용 없음"}...
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* 페이지네이션 */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-2 rounded border bg-gray-100 disabled:opacity-40"
            >
              이전
            </button>

            <span className="px-4 py-2">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-2 rounded border bg-gray-100 disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </>
      )}

    </main>
  );
}