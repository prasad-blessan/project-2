export type Priority = "low" | "medium" | "high" | "urgent";
export type Status = "good" | "warning" | "serious" | "critical";

export type TaskCategory =
  | "home"
  | "vehicle"
  | "finance"
  | "document"
  | "family"
  | "health"
  | "personal";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  category: TaskCategory;
  priority: Priority;
  dueDate: string; // ISO date
  completed: boolean;
  aiGenerated?: boolean;
  linkedEntityId?: string;
}

export type BillFrequency = "once" | "weekly" | "monthly" | "quarterly" | "yearly";

export interface Bill {
  id: string;
  name: string;
  category: "utility" | "rent" | "insurance" | "loan" | "subscription" | "other";
  amount: number;
  dueDate: string; // ISO date, next due
  frequency: BillFrequency;
  autopay: boolean;
  paid: boolean;
  vendor?: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: "monthly" | "yearly";
  nextRenewal: string;
  category: string;
  usage: "high" | "medium" | "low" | "unused";
}

export type DocumentType =
  | "insurance"
  | "id"
  | "warranty"
  | "lease"
  | "medical"
  | "legal"
  | "financial"
  | "other";

export interface AppDocument {
  id: string;
  name: string;
  type: DocumentType;
  expiryDate?: string;
  issueDate?: string;
  fileSizeKb: number;
  extracted?: Record<string, string>;
  status: Status;
}

export type MaintenanceCategory = "home" | "vehicle";

export interface MaintenanceItem {
  id: string;
  title: string;
  category: MaintenanceCategory;
  assetName: string; // e.g. "2021 Honda CR-V" or "HVAC System"
  lastServiced?: string;
  nextDue: string;
  intervalDays: number;
  predicted?: boolean;
  status: Status;
  mileage?: number;
  nextMileage?: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatarColor: string;
  upcoming: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date
  time?: string;
  category: TaskCategory;
  source: "task" | "bill" | "maintenance" | "document" | "family" | "manual";
}

export type AlertSeverity = "info" | "warning" | "critical";

export interface AIAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: TaskCategory | "insight";
  createdAt: string;
  actioned: boolean;
  suggestedAction?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  severity: AlertSeverity;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  intent?: string;
}

export interface HealthFactor {
  label: string;
  score: number; // 0-100
  weight: number;
  detail: string;
}
