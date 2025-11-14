"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function QuestionCreatePage() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/board/questions/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });

      if (!res.ok) {
        alert("질문 등록 실패");
        return;
      }

      // 질문 목록으로 이동
      router.push("/board");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">질문 작성</h1>

      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white border rounded-lg shadow-md space-y-4"
      >
        <input
          type="text"
          className="w-full border rounded p-3"
          placeholder="제목을 입력하세요"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <textarea
          className="w-full border rounded p-3"
          rows={8}
          placeholder="질문 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>

        <div className="flex justify-end gap-3">
          <Link
            href="/board"
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