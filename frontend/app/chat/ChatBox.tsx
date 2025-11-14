"use client";
import { useState } from "react";

interface ChatBoxProps {
  onSend: (message: string) => void;
}

export default function ChatBox({ onSend }: ChatBoxProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="sticky bottom-0 z-10 flex p-4 border-t bg-white">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="flex-1 border rounded p-2"
        placeholder="질문을 입력하세요..."
      />
      <button
        onClick={handleSubmit}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        전송
      </button>
    </div>
  );
}