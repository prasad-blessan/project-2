import { create } from "zustand";
import { formatISO } from "date-fns";
import type {
  AIAlert,
  AppDocument,
  Bill,
  CalendarEvent,
  ChatMessage,
  FamilyMember,
  MaintenanceItem,
  Notification,
  Subscription,
  Task,
} from "@/types";
import { buildCalendarEvents } from "@/lib/calendar";
import {
  seedAlerts,
  seedBills,
  seedDocuments,
  seedFamily,
  seedMaintenance,
  seedNotifications,
  seedSubscriptions,
  seedTasks,
} from "@/lib/mockData";
import { parseCommand } from "@/lib/nlp";
import { fmtDate, fmtMoney, daysUntil } from "@/lib/utils";

let uid = 1000;
const nextId = (prefix: string) => `${prefix}${uid++}`;

interface StoreState {
  theme: "light" | "dark";
  toggleTheme: () => void;

  tasks: Task[];
  bills: Bill[];
  subscriptions: Subscription[];
  documents: AppDocument[];
  maintenance: MaintenanceItem[];
  family: FamilyMember[];
  alerts: AIAlert[];
  notifications: Notification[];
  chat: ChatMessage[];

  toggleTask: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "completed">) => Task;
  payBill: (id: string) => void;
  dismissAlert: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addDocumentFromUpload: (name: string) => AppDocument;
  addMaintenance: (item: Omit<MaintenanceItem, "id" | "status">) => MaintenanceItem;
  addBill: (bill: Omit<Bill, "id" | "paid">) => Bill;

  sendMessage: (text: string) => void;
  calendarEvents: () => CalendarEvent[];
}

function statusFromDays(d: number): "good" | "warning" | "serious" | "critical" {
  if (d < 0) return "critical";
  if (d <= 3) return "serious";
  if (d <= 14) return "warning";
  return "good";
}

const DOC_TEMPLATES: { match: RegExp; type: AppDocument["type"]; expiryOffset: number; fields: Record<string, string> }[] = [
  {
    match: /insurance|policy/i,
    type: "insurance",
    expiryOffset: 340,
    fields: { "Policy Number": `POL-${Math.floor(10000 + Math.random() * 89999)}`, Provider: "Detected Insurance Co." },
  },
  {
    match: /passport|license|id/i,
    type: "id",
    expiryOffset: 900,
    fields: { "Document No.": `X${Math.floor(1000000 + Math.random() * 8999999)}` },
  },
  {
    match: /lease|rent/i,
    type: "lease",
    expiryOffset: 240,
    fields: { "Monthly Rent": "$2,150.00" },
  },
  {
    match: /warranty/i,
    type: "warranty",
    expiryOffset: 500,
    fields: { Coverage: "Parts & Labor" },
  },
  {
    match: /medical|health/i,
    type: "medical",
    expiryOffset: 365,
    fields: {},
  },
  {
    match: /registration|vehicle|car/i,
    type: "legal",
    expiryOffset: 200,
    fields: { Plate: "New-Plate" },
  },
];

export const useStore = create<StoreState>((set, get) => ({
  theme: "light",
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

  tasks: seedTasks,
  bills: seedBills,
  subscriptions: seedSubscriptions,
  documents: seedDocuments,
  maintenance: seedMaintenance,
  family: seedFamily,
  alerts: seedAlerts,
  notifications: seedNotifications,
  chat: [
    {
      id: "c0",
      role: "assistant",
      content:
        "Hi, I'm your LifePilot AI assistant. Try: \"remind me to renew my passport next month\", \"add a bill Netflix $15.99 due on the 5th\", or \"what's due this week?\"",
      createdAt: formatISO(new Date()),
    },
  ],

  toggleTask: (id) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)) })),

  addTask: (task) => {
    const newTask: Task = { ...task, id: nextId("t"), completed: false };
    set((s) => ({ tasks: [newTask, ...s.tasks] }));
    return newTask;
  },

  payBill: (id) => set((s) => ({ bills: s.bills.map((b) => (b.id === id ? { ...b, paid: true } : b)) })),

  dismissAlert: (id) => set((s) => ({ alerts: s.alerts.map((a) => (a.id === id ? { ...a, actioned: true } : a)) })),

  markNotificationRead: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),

  markAllNotificationsRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

  addBill: (bill) => {
    const newBill: Bill = { ...bill, id: nextId("b"), paid: false };
    set((s) => ({ bills: [newBill, ...s.bills] }));
    return newBill;
  },

  addMaintenance: (item) => {
    const status = statusFromDays(daysUntil(item.nextDue));
    const newItem: MaintenanceItem = { ...item, id: nextId("m"), status };
    set((s) => ({ maintenance: [newItem, ...s.maintenance] }));
    return newItem;
  },

  addDocumentFromUpload: (name) => {
    const template = DOC_TEMPLATES.find((t) => t.match.test(name));
    const expiryOffset = template?.expiryOffset ?? 365;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + expiryOffset);
    const expiryDate = formatISO(expiry, { representation: "date" });
    const doc: AppDocument = {
      id: nextId("d"),
      name,
      type: template?.type ?? "other",
      expiryDate,
      issueDate: formatISO(new Date(), { representation: "date" }),
      fileSizeKb: Math.floor(200 + Math.random() * 1200),
      status: statusFromDays(daysUntil(expiryDate)),
      extracted: template?.fields,
    };
    set((s) => ({ documents: [doc, ...s.documents] }));

    const alert: AIAlert = {
      id: nextId("a"),
      title: `New document processed: ${name}`,
      description: `AI extracted an expiry date of ${fmtDate(expiryDate)}${
        template ? ` and classified it as ${template.type}` : ""
      }. A reminder has been created automatically.`,
      severity: "info",
      category: "document",
      createdAt: formatISO(new Date()),
      actioned: false,
      suggestedAction: "View document",
    };
    set((s) => ({ alerts: [alert, ...s.alerts] }));

    get().addTask({
      title: `Review renewal for ${name}`,
      category: "document",
      priority: "medium",
      dueDate: expiryDate,
      aiGenerated: true,
      notes: "Auto-created from document upload",
    });

    return doc;
  },

  calendarEvents: () => {
    const s = get();
    return buildCalendarEvents(s.tasks, s.bills, s.maintenance);
  },

  sendMessage: (text) => {
    const userMsg: ChatMessage = { id: nextId("c"), role: "user", content: text, createdAt: formatISO(new Date()) };
    set((s) => ({ chat: [...s.chat, userMsg] }));

    const cmd = parseCommand(text);
    let reply = "";

    switch (cmd.intent) {
      case "greeting":
        reply = "Hello! I can create reminders, track bills, schedule maintenance, and summarize what's on your plate. What would you like to do?";
        break;
      case "help":
        reply =
          "Here's what I can do:\n- \"Remind me to [task] [date]\"\n- \"Add a bill [name] $[amount] due [date]\"\n- \"Schedule [car/thing] service [date]\"\n- \"Mark [task] as done\"\n- \"What's due this week?\"\n- \"How's my health score?\"\n- Upload a document and I'll extract key dates automatically.";
        break;
      case "query_health": {
        reply = "Your Life Health Score reflects tasks, finances, documents, and maintenance. Check the dashboard's Life Health Score card for the live breakdown and what's dragging it down.";
        break;
      }
      case "query_upcoming": {
        const upcoming = get()
          .tasks.filter((t) => !t.completed && daysUntil(t.dueDate) <= 7)
          .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate));
        if (!upcoming.length) {
          reply = "You're all clear — nothing due in the next 7 days.";
        } else {
          reply = `You have ${upcoming.length} item(s) due within 7 days:\n${upcoming
            .slice(0, 6)
            .map((t) => `- ${t.title} (${fmtDate(t.dueDate)})`)
            .join("\n")}`;
        }
        break;
      }
      case "query_finance": {
        const unpaid = get().bills.filter((b) => !b.paid);
        const total = unpaid.reduce((sum, b) => sum + b.amount, 0);
        reply = `You have ${unpaid.length} unpaid bill(s) totaling ${fmtMoney(total)}. Check Finance for the full breakdown and subscription usage.`;
        break;
      }
      case "create_task": {
        const dueDate = cmd.dueDate
          ? formatISO(cmd.dueDate, { representation: "date" })
          : formatISO(new Date(Date.now() + 7 * 86400000), { representation: "date" });
        const task = get().addTask({
          title: cmd.title || "New reminder",
          category: cmd.category,
          priority: cmd.priority,
          dueDate,
          aiGenerated: true,
        });
        reply = `Done — I've added "${task.title}" due ${fmtDate(task.dueDate)} to your ${task.category} tasks.`;
        break;
      }
      case "create_bill": {
        const dueDate = cmd.dueDate
          ? formatISO(cmd.dueDate, { representation: "date" })
          : formatISO(new Date(Date.now() + 14 * 86400000), { representation: "date" });
        const bill = get().addBill({
          name: cmd.name,
          category: "subscription",
          amount: cmd.amount ?? 0,
          dueDate,
          frequency: "monthly",
          autopay: false,
        });
        reply = `Added "${bill.name}"${cmd.amount ? ` for ${fmtMoney(cmd.amount)}` : ""} due ${fmtDate(bill.dueDate)} to Finance.`;
        break;
      }
      case "schedule_maintenance": {
        const dueDate = cmd.dueDate ?? new Date(Date.now() + 14 * 86400000);
        const item = get().addMaintenance({
          title: cmd.title,
          category: cmd.category,
          assetName: cmd.assetName,
          nextDue: formatISO(dueDate, { representation: "date" }),
          intervalDays: 180,
        });
        reply = `Scheduled: ${item.title} on ${fmtDate(item.nextDue)}. I'll remind you as it approaches.`;
        break;
      }
      case "complete_task": {
        const match = get().tasks.find(
          (t) => !t.completed && t.title.toLowerCase().includes(cmd.query.toLowerCase())
        );
        if (match) {
          get().toggleTask(match.id);
          reply = `Marked "${match.title}" as complete. Nice work.`;
        } else {
          reply = `I couldn't find an open task matching "${cmd.query}". Could you rephrase it?`;
        }
        break;
      }
      default:
        reply =
          "I didn't quite catch a command there. Try something like \"remind me to pay rent on the 1st\" or ask \"what's due this week?\"";
    }

    const assistantMsg: ChatMessage = {
      id: nextId("c"),
      role: "assistant",
      content: reply,
      createdAt: formatISO(new Date()),
      intent: cmd.intent,
    };
    set((s) => ({ chat: [...s.chat, assistantMsg] }));
  },
}));
