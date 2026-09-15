import type { AppDocument, Bill, HealthFactor, MaintenanceItem, Task } from "@/types";
import { daysUntil } from "./utils";

export function computeHealthFactors(
  tasks: Task[],
  bills: Bill[],
  documents: AppDocument[],
  maintenance: MaintenanceItem[]
): HealthFactor[] {
  const openTasks = tasks.filter((t) => !t.completed);
  const overdueTasks = openTasks.filter((t) => daysUntil(t.dueDate) < 0);
  const taskScore = openTasks.length
    ? Math.max(0, 100 - overdueTasks.length * 20 - Math.max(0, openTasks.length - 5) * 4)
    : 100;

  const unpaidBills = bills.filter((b) => !b.paid);
  const overdueBills = unpaidBills.filter((b) => daysUntil(b.dueDate) < 0);
  const financeScore = Math.max(0, 100 - overdueBills.length * 30 - unpaidBills.length * 5);

  const expiringDocs = documents.filter((d) => d.expiryDate && daysUntil(d.expiryDate) < 30);
  const expiredDocs = documents.filter((d) => d.expiryDate && daysUntil(d.expiryDate) < 0);
  const docScore = Math.max(0, 100 - expiredDocs.length * 35 - expiringDocs.length * 12);

  const overdueMaint = maintenance.filter((m) => daysUntil(m.nextDue) < 0);
  const dueSoonMaint = maintenance.filter((m) => {
    const d = daysUntil(m.nextDue);
    return d >= 0 && d <= 14;
  });
  const maintScore = Math.max(0, 100 - overdueMaint.length * 25 - dueSoonMaint.length * 8);

  return [
    {
      label: "Tasks & Reminders",
      score: taskScore,
      weight: 0.25,
      detail: overdueTasks.length
        ? `${overdueTasks.length} overdue task${overdueTasks.length > 1 ? "s" : ""}`
        : "All tasks on track",
    },
    {
      label: "Finances",
      score: financeScore,
      weight: 0.3,
      detail: overdueBills.length
        ? `${overdueBills.length} overdue bill${overdueBills.length > 1 ? "s" : ""}`
        : `${unpaidBills.length} bill${unpaidBills.length === 1 ? "" : "s"} pending`,
    },
    {
      label: "Documents",
      score: docScore,
      weight: 0.2,
      detail: expiredDocs.length
        ? `${expiredDocs.length} expired document${expiredDocs.length > 1 ? "s" : ""}`
        : expiringDocs.length
        ? `${expiringDocs.length} expiring soon`
        : "All documents valid",
    },
    {
      label: "Maintenance",
      score: maintScore,
      weight: 0.25,
      detail: overdueMaint.length
        ? `${overdueMaint.length} overdue service${overdueMaint.length > 1 ? "s" : ""}`
        : dueSoonMaint.length
        ? `${dueSoonMaint.length} due soon`
        : "Everything serviced",
    },
  ];
}

export function overallScore(factors: HealthFactor[]) {
  const weighted = factors.reduce((sum, f) => sum + f.score * f.weight, 0);
  return Math.round(weighted);
}

export function scoreStatus(score: number): "good" | "warning" | "serious" | "critical" {
  if (score >= 80) return "good";
  if (score >= 60) return "warning";
  if (score >= 40) return "serious";
  return "critical";
}
