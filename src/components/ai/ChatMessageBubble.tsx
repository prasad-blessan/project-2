import { Sparkles, User } from "lucide-react";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-2.5", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-[var(--color-plane)] text-[var(--color-ink-secondary)]" : "bg-[var(--color-series-1)] text-white"
        )}
      >
        {isUser ? <User size={13} /> : <Sparkles size={13} />}
      </div>
      <div
        className={cn(
          "max-w-[80%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-[var(--color-series-1)] text-white"
            : "bg-[var(--color-plane)] text-[var(--color-ink)]"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
