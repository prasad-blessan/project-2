import { ListChecks, Sparkles } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { PriorityPill } from "@/components/ui/StatusPill";
import { useStore } from "@/store/useStore";
import { CATEGORY_META } from "@/lib/categoryMeta";
import { cn, daysUntil, relativeDueLabel, urgencyFromDays } from "@/lib/utils";

export function UpcomingActions() {
  const tasks = useStore((s) => s.tasks);
  const toggleTask = useStore((s) => s.toggleTask);

  const upcoming = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate))
    .slice(0, 6);

  return (
    <Card>
      <CardHeader
        title="Upcoming Actions"
        subtitle={`${tasks.filter((t) => !t.completed).length} open items`}
        icon={<ListChecks size={18} />}
      />
      <ul className="space-y-1">
        {upcoming.map((task) => {
          const meta = CATEGORY_META[task.category];
          const urgency = urgencyFromDays(daysUntil(task.dueDate));
          return (
            <li
              key={task.id}
              className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[var(--color-plane)]"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-hairline)] transition-colors group-hover:border-[var(--color-series-1)]"
                aria-label="Complete task"
              />
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `color-mix(in oklab, ${meta.color} 14%, transparent)`, color: meta.color }}
              >
                <meta.icon size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                  {task.title}
                  {task.aiGenerated && (
                    <Sparkles size={11} className="ml-1.5 inline text-[var(--color-series-1)]" />
                  )}
                </p>
                <p
                  className={cn(
                    "text-xs font-medium",
                    urgency === "critical" || urgency === "serious"
                      ? "text-[var(--color-critical)]"
                      : "text-[var(--color-ink-muted)]"
                  )}
                >
                  {relativeDueLabel(task.dueDate)}
                </p>
              </div>
              <PriorityPill priority={task.priority} />
            </li>
          );
        })}
        {upcoming.length === 0 && (
          <p className="py-6 text-center text-sm text-[var(--color-ink-muted)]">All caught up. Nothing pending.</p>
        )}
      </ul>
    </Card>
  );
}
