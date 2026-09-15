import { clsx, type ClassValue } from "clsx";
import { differenceInCalendarDays, format, isPast, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function fmtDate(iso: string, pattern = "MMM d, yyyy") {
  return format(parseISO(iso), pattern);
}

export function fmtMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function daysUntil(iso: string) {
  return differenceInCalendarDays(parseISO(iso), new Date());
}

export function isOverdue(iso: string) {
  return isPast(parseISO(iso)) && daysUntil(iso) < 0;
}

export function relativeDueLabel(iso: string) {
  const d = daysUntil(iso);
  if (d < -1) return `${Math.abs(d)} days overdue`;
  if (d === -1) return "1 day overdue";
  if (d === 0) return "Due today";
  if (d === 1) return "Due tomorrow";
  if (d <= 7) return `Due in ${d} days`;
  return `Due ${fmtDate(iso)}`;
}

export function urgencyFromDays(d: number): "good" | "warning" | "serious" | "critical" {
  if (d < 0) return "critical";
  if (d <= 3) return "serious";
  if (d <= 14) return "warning";
  return "good";
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
