"use client";
import { ReactNode, useEffect, useRef } from "react";

interface ChatLayoutProps {
  children: ReactNode;
}

/**
 * ChatLayout: 전체 채팅 UI 레이아웃 관리
 * - 화면 높이 조정
 * - 스크롤 자동 아래로 이동
 * - 배경 / flex 레이아웃 스타일 지정
 */
export default function ChatLayout({ children }: ChatLayoutProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 새 메시지가 추가될 때 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [children]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 채팅 내용 영역 */}
      <main className="flex-1 overflow-y-auto p-4">{children}</main>

      {/* 자동 스크롤 위치 */}
      <div ref={bottomRef}></div>
    </div>
  );
}