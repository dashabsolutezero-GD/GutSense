"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import { getFoodHistorySummary } from "@/lib/storage";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

const QUICK_PROMPTS = [
  "What should I eat for dinner tonight?",
  "Am I getting enough protein?",
  "Suggest a gut-friendly vegetarian meal",
  "What vitamins am I missing?",
  "How can I improve my gut bacteria?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessageType = {
      role: "user",
      content: text.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const foodHistory = getFoodHistorySummary();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), foodHistory }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to get response");
      }

      const data = await res.json();
      const aiMsg: ChatMessageType = {
        role: "assistant",
        content: data.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg: ChatMessageType = {
        role: "assistant",
        content:
          err instanceof Error
            ? `Sorry, I couldn't respond: ${err.message}`
            : "Something went wrong. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-lg mx-auto flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-surface">
        <h1 className="text-lg font-bold text-text">AI Nutritionist</h1>
        <p className="text-xs text-muted">
          Powered by Claude &middot; Knows your food history
        </p>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
      >
        {messages.length === 0 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold text-text mb-1">
              Ask me anything about your diet
            </h2>
            <p className="text-sm text-muted mb-6">
              I can see your food history and give personalized advice
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs bg-surface border border-border rounded-full px-3.5 py-2 text-text-secondary hover:bg-surface-hover hover:text-text transition-colors card-shadow"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface card-shadow rounded-2xl rounded-bl-sm px-4 py-3">
              <p className="text-[10px] text-primary font-semibold mb-1.5">
                GutSense AI
              </p>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                <div
                  className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-5 py-3 border-t border-border bg-surface">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your diet..."
            className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </div>
    </main>
  );
}
