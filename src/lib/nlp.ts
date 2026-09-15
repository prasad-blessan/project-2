import { extractDate } from "./dateParser";
import type { TaskCategory } from "@/types";

export type ParsedCommand =
  | { intent: "create_task"; title: string; dueDate: Date | null; category: TaskCategory; priority: "low" | "medium" | "high" | "urgent" }
  | { intent: "create_bill"; name: string; amount: number | null; dueDate: Date | null }
  | { intent: "schedule_maintenance"; title: string; assetName: string; dueDate: Date | null; category: "home" | "vehicle" }
  | { intent: "complete_task"; query: string }
  | { intent: "query_upcoming" }
  | { intent: "query_health" }
  | { intent: "query_finance" }
  | { intent: "help" }
  | { intent: "greeting" }
  | { intent: "unknown"; text: string };

const CATEGORY_KEYWORDS: [RegExp, TaskCategory][] = [
  [/\b(car|vehicle|oil change|tire|brake|registration|dmv)\b/i, "vehicle"],
  [/\b(house|home|hvac|filter|gutter|plumb|roof|lawn)\b/i, "home"],
  [/\b(bill|rent|invoice|payment|insurance premium|loan)\b/i, "finance"],
  [/\b(passport|license|warranty|lease|policy|document|id card)\b/i, "document"],
  [/\b(kid|son|daughter|spouse|family|school|soccer|appointment)\b/i, "family"],
  [/\b(doctor|dentist|checkup|prescription|health|medical)\b/i, "health"],
];

function detectCategory(text: string): TaskCategory {
  for (const [re, cat] of CATEGORY_KEYWORDS) {
    if (re.test(text)) return cat;
  }
  return "personal";
}

function detectPriority(text: string): "low" | "medium" | "high" | "urgent" {
  if (/\burgent|asap|immediately|critical\b/i.test(text)) return "urgent";
  if (/\bimportant|high priority\b/i.test(text)) return "high";
  if (/\bwhenever|low priority|someday\b/i.test(text)) return "low";
  return "medium";
}

function cleanTitle(text: string): string {
  return text
    .replace(/^(please\s+)?/i, "")
    .replace(/\b(on|by|next|this|in)\s+.*/i, "")
    .replace(/[.,!]+$/, "")
    .trim();
}

export function parseCommand(raw: string): ParsedCommand {
  const text = raw.trim();
  const lower = text.toLowerCase();

  if (/^(hi|hello|hey)\b/.test(lower)) return { intent: "greeting" };
  if (/what can you do|help me|^help\b/.test(lower)) return { intent: "help" };

  if (/how('?s| is) my (life )?(health )?score|how am i doing/i.test(lower)) {
    return { intent: "query_health" };
  }
  if (/what.*(due|upcoming|this week|need to do)|show my tasks|what.*schedule/i.test(lower)) {
    return { intent: "query_upcoming" };
  }
  if (/how much.*(spend|spending|bills|owe)|finance overview|money/i.test(lower)) {
    return { intent: "query_finance" };
  }

  const doneMatch = lower.match(/\b(mark|complete|finished|done with)\b(.*)/);
  if (doneMatch && /done|complete|finished/i.test(lower)) {
    const query = doneMatch[2]
      .replace(/\bas (done|complete|completed)\b/i, "")
      .replace(/[.,!]+$/, "")
      .trim();
    if (query) return { intent: "complete_task", query };
  }

  const billMatch = lower.match(
    /\b(add|create|track)\s+(?:a\s+)?(bill|subscription|payment)\s+(?:for\s+|to\s+)?(.+)/i
  );
  if (billMatch) {
    const rest = billMatch[3];
    const amountMatch = rest.match(/\$\s?([\d,]+(?:\.\d{1,2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : null;
    const dateResult = extractDate(rest);
    const name = rest
      .replace(/\$\s?[\d,]+(?:\.\d{1,2})?/, "")
      .replace(dateResult ? new RegExp(dateResult.matched, "i") : /$^/, "")
      .replace(/\b(due|for|on|of)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    return {
      intent: "create_bill",
      name: name.charAt(0).toUpperCase() + name.slice(1) || "New bill",
      amount,
      dueDate: dateResult?.date ?? null,
    };
  }

  const maintMatch = lower.match(
    /\b(schedule|book)\s+(.+?)\s+(service|maintenance|check-?up|inspection|tune-?up)\b(.*)/i
  );
  if (maintMatch) {
    const assetName = maintMatch[2].trim();
    const rest = maintMatch[4] ?? "";
    const dateResult = extractDate(rest || lower);
    const category: "home" | "vehicle" = /\b(car|vehicle|truck|suv|honda|toyota|ford)\b/i.test(
      assetName
    )
      ? "vehicle"
      : "home";
    return {
      intent: "schedule_maintenance",
      title: `${maintMatch[3][0].toUpperCase()}${maintMatch[3].slice(1)} for ${assetName}`,
      assetName: assetName.charAt(0).toUpperCase() + assetName.slice(1),
      dueDate: dateResult?.date ?? null,
      category,
    };
  }

  const reminderMatch = lower.match(
    /\b(remind me to|add a (?:task|reminder) to|add task|i need to|don'?t forget to)\s+(.+)/i
  );
  if (reminderMatch) {
    const rest = reminderMatch[2];
    const dateResult = extractDate(rest);
    let title = rest;
    if (dateResult) {
      title = rest.replace(new RegExp(dateResult.matched, "i"), "");
    }
    title = cleanTitle(title) || rest.trim();
    title = title.charAt(0).toUpperCase() + title.slice(1);
    return {
      intent: "create_task",
      title,
      dueDate: dateResult?.date ?? null,
      category: detectCategory(text),
      priority: detectPriority(text),
    };
  }

  return { intent: "unknown", text };
}
