"use client";
import { useEffect, useState } from "react";
import ChatLayout from "./ChatLayout";
import ChatBox from "./ChatBox";
import MessageList from "./MessageList";
import { Message } from "./types";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 초기 로드: localStorage에서 복원
  useEffect(() => {
    try {
      const raw = localStorage.getItem("chat_messages");
      if (raw) {
        const parsed = JSON.parse(raw) as Message[];
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // 변경 시: localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [messages]);

  const handleSend = async (userInput: string) => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput }),
    });
    const data = await res.json();
      const reply =
        typeof data?.reply === "string" && data.reply.trim().length > 0
          ? data.reply
          : "응답을 불러오지 못했어요.";

      setMessages((prev) => [...prev, { role: "bot", content: reply }]);
      if (!res.ok || reply === "응답을 불러오지 못했어요.") {
        setPendingQuestion(userInput);
      } else {
        setPendingQuestion(null);
      }
    } catch {
    setMessages((prev) => [
      ...prev,
        { role: "bot", content: "응답을 불러오지 못했어요." },
    ]);
      setPendingQuestion(userInput);
    }
  };

  const handleRegisterQuestion = async () => {
    if (!pendingQuestion || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/board/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subject: pendingQuestion.substring(0, 100) || "질문",
          content: pendingQuestion 
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || errorData?.detail || "submit failed");
      }
      setPendingQuestion(null);
      alert("질문이 등록되었습니다.");
    } catch (e: any) {
      alert(e?.message || "등록 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ChatLayout>
      <div className="pb-24">
      <MessageList messages={messages} />
      </div>
      {pendingQuestion && (
        <div className="mx-4 mt-2 mb-3 p-3 border rounded bg-yellow-50 text-yellow-900">
          이 질문에 대한 답변을 제공할 수 없었어요. 질문게시판에 등록하시겠어요?
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleRegisterQuestion}
              disabled={submitting}
              className="px-3 py-1 bg-yellow-600 text-white rounded disabled:opacity-50"
            >
              {submitting ? "등록 중..." : "질문 등록"}
            </button>
          </div>
        </div>
      )}
      <ChatBox onSend={handleSend} />
    </ChatLayout>
  );
}