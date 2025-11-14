"use client";
import { useState } from "react";

interface QnaCardProps {
  question: string;
  answer: string;
}

export default function QnaCard({ question, answer }: QnaCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border rounded-lg shadow-sm p-4 bg-white cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">{question}</h2>
        <span className="text-gray-500">{open ? "▲" : "▼"}</span>
      </div>
      {open && <p className="mt-3 text-gray-600">{answer}</p>}
    </div>
  );
}