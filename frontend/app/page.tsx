"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar"; 

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/chat");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 via-purple-200 to-purple-300 text-gray-800 relative">
      <Navbar />

      {/* 중앙 콘텐츠 */}
      <div className="flex flex-col items-center justify-center mt-20 text-center px-6">
        <h1 className="text-4xl font-bold mb-4 text-purple-700 drop-shadow-sm">
          리크루팅 Q&A 챗봇
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-md leading-relaxed">
          리크루팅 과정, 일정, 지원 요건 등 궁금한 점을<br />
          AI 챗봇에게 편하게 물어보세요.
        </p>

        <button
          onClick={handleStart}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg text-lg font-medium hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          챗봇 시작하기
        </button>
      </div>

      {/* 하단 문구 */}
      <footer className="absolute bottom-5 text-sm text-gray-600">
        © 2025 HateSlop Recruiting Bot
      </footer>
    </main>
  );
}