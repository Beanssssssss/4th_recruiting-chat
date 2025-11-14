"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateQuestionPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/board/questions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          content: content.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.detail || "등록 실패");
      }

      // 등록 성공 후 /board 로 이동
      router.push("/board");
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700">질문 등록</h1>

          {/* 목록으로 버튼 → /board 로 변경 */}
          <Link
            href="/board"
            className="px-3 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            목록으로
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1 font-medium">제목</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none"
              placeholder="질문 제목을 입력하세요"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full p-2 border rounded resize-y focus:outline-none"
              placeholder="질문 내용을 입력하세요"
              required
              disabled={loading}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            {/* 취소 버튼 → /board 로 변경 */}
            <Link
              href="/board"
              className="px-4 py-2 bg-gray-200 border rounded hover:bg-gray-300"
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

      </div>
    </main>
  );
}