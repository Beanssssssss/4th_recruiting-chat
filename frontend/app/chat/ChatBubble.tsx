 "use client";
interface ChatBubbleProps {
  role: "user" | "bot";
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";
  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-2`}
    >
      <div
        className={`rounded-lg px-3 py-2 max-w-[75%] ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {content}
      </div>
    </div>
  );
}