import {
  Car,
  Home,
  Wallet,
  FileText,
  Users,
  HeartPulse,
  User,
  type LucideIcon,
} from "lucide-react";
import type { TaskCategory } from "@/types";

export const CATEGORY_META: Record<TaskCategory, { label: string; icon: LucideIcon; color: string }> = {
  vehicle: { label: "Vehicle", icon: Car, color: "var(--color-series-1)" },
  home: { label: "Home", icon: Home, color: "var(--color-series-3)" },
  finance: { label: "Finance", icon: Wallet, color: "var(--color-series-4)" },
  document: { label: "Documents", icon: FileText, color: "var(--color-series-7)" },
  family: { label: "Family", icon: Users, color: "var(--color-series-5)" },
  health: { label: "Health", icon: HeartPulse, color: "var(--color-series-8)" },
  personal: { label: "Personal", icon: User, color: "var(--color-series-2)" },
};
