import type { Bill, CalendarEvent, MaintenanceItem, Task } from "@/types";

export function buildCalendarEvents(tasks: Task[], bills: Bill[], maintenance: MaintenanceItem[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  tasks
    .filter((t) => !t.completed)
    .forEach((t) => events.push({ id: `ev-${t.id}`, title: t.title, date: t.dueDate, category: t.category, source: "task" }));
  bills
    .filter((b) => !b.paid)
    .forEach((b) => events.push({ id: `ev-${b.id}`, title: `${b.name} due`, date: b.dueDate, category: "finance", source: "bill" }));
  maintenance.forEach((m) =>
    events.push({
      id: `ev-${m.id}`,
      title: `${m.title} - ${m.assetName}`,
      date: m.nextDue,
      category: m.category === "vehicle" ? "vehicle" : "home",
      source: "maintenance",
    })
  );
  return events;
}
