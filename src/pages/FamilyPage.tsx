import { Users } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { PriorityPill } from "@/components/ui/StatusPill";
import { CATEGORY_META } from "@/lib/categoryMeta";
import { useStore } from "@/store/useStore";
import { daysUntil, initials, relativeDueLabel, urgencyFromDays } from "@/lib/utils";

export default function FamilyPage() {
  const family = useStore((s) => s.family);
  const allTasks = useStore((s) => s.tasks);
  const tasks = allTasks.filter((t) => !t.completed && t.category === "family");

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
      <Card>
        <CardHeader title="Family Members" subtitle={`${family.length} in household`} icon={<Users size={18} />} />
        <ul className="space-y-3">
          {family.map((m) => (
            <li key={m.id} className="flex items-center gap-3 rounded-xl border border-[var(--color-hairline)] p-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: m.avatarColor }}
              >
                {initials(m.name)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--color-ink)]">{m.name}</p>
                <p className="text-xs text-[var(--color-ink-muted)]">{m.relation}</p>
              </div>
              <span className="rounded-full bg-[var(--color-plane)] px-2.5 py-1 text-xs font-medium text-[var(--color-ink-secondary)]">
                {m.upcoming} upcoming
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader
          title="Family Activities"
          subtitle="Appointments and events for your household"
          icon={<CATEGORY_META.family.icon size={18} />}
        />
        <ul className="divide-y divide-[var(--color-hairline)]">
          {tasks.map((task) => {
            const urgency = urgencyFromDays(daysUntil(task.dueDate));
            return (
              <li key={task.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-ink)]">{task.title}</p>
                  <p className="text-xs" style={{ color: urgency === "critical" || urgency === "serious" ? "var(--color-critical)" : "var(--color-ink-muted)" }}>
                    {relativeDueLabel(task.dueDate)}
                  </p>
                </div>
                <PriorityPill priority={task.priority} />
              </li>
            );
          })}
          {tasks.length === 0 && <p className="py-6 text-center text-sm text-[var(--color-ink-muted)]">No family activities scheduled.</p>}
        </ul>
      </Card>
    </div>
  );
}
