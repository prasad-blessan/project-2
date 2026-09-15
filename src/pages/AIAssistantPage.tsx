import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { ChatMessageBubble } from "@/components/ai/ChatMessageBubble";
import { DocumentUploadAnalyzer } from "@/components/ai/DocumentUploadAnalyzer";
import { useStore } from "@/store/useStore";

const SUGGESTIONS = [
  "Remind me to renew my passport next month",
  "Add a bill Netflix $15.99 due on the 5th",
  "Schedule car oil change service next Friday",
  "What's due this week?",
  "How's my health score?",
];

export default function AIAssistantPage() {
  const chat = useStore((s) => s.chat);
  const sendMessage = useStore((s) => s.sendMessage);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.length]);

  function submit(text: string) {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setInput("");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <Card className="flex h-[calc(100vh-8.5rem)] flex-col" padded={false}>
        <div className="border-b border-[var(--color-hairline)] p-5">
          <CardHeader
            title="LifePilot AI Assistant"
            subtitle="Natural language commands for tasks, bills, and maintenance"
            icon={<Sparkles size={18} />}
          />
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                className="rounded-full border border-[var(--color-hairline)] px-3 py-1.5 text-xs text-[var(--color-ink-secondary)] hover:bg-[var(--color-plane)]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {chat.map((m) => (
            <ChatMessageBubble key={m.id} message={m} />
          ))}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="flex items-center gap-2 border-t border-[var(--color-hairline)] p-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask LifePilot anything, or type a command..."
            className="flex-1 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-plane)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-series-1)]"
          />
          <button
            type="submit"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-series-1)] text-white hover:opacity-90"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </form>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader title="Document Intelligence" subtitle="Upload to auto-extract dates & fields" icon={<Sparkles size={18} />} />
          <DocumentUploadAnalyzer />
        </Card>
      </div>
    </div>
  );
}
