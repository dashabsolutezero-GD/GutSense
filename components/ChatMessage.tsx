"use client";

interface Props {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-white rounded-br-sm"
            : "bg-surface card-shadow text-text rounded-bl-sm"
        }`}
      >
        {!isUser && (
          <p className="text-[10px] text-primary font-semibold mb-1">
            GutSense AI
          </p>
        )}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
}
