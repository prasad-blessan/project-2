import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, ListChecks, Plus, Sparkles } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { PriorityPill } from "@/components/ui/StatusPill";
import { useStore } from "@/store/useStore";
import { CATEGORY_META } from "@/lib/categoryMeta";
import { cn, daysUntil, relativeDueLabel, urgencyFromDays } from "@/lib/utils";
import type { TaskCategory } from "@/types";

const CATEGORIES: (TaskCategory | "all")[] = ["all", "vehicle", "home", "finance", "document", "family", "health", "personal"];

export default function TasksPage() {
  const tasks = useStore((s) => s.tasks);
  const toggleTask = useStore((s) => s.toggleTask);
  const addTask = useStore((s) => s.addTask);
  const [filter, setFilter] = useState<TaskCategory | "all">("all");
  const [title, setTitle] = useState("");

  const filtered = useMemo(
    () => tasks.filter((t) => filter === "all" || t.category === filter),
    [tasks, filter]
  );

  const overdue = filtered.filter((t) => !t.completed && daysUntil(t.dueDate) < 0);
  const upcoming = filtered
    .filter((t) => !t.completed && daysUntil(t.dueDate) >= 0)
    .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate));
  const completed = filtered.filter((t) => t.completed);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      category: filter === "all" ? "personal" : filter,
      priority: "medium",
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    });
    setTitle("");
  }

  const groups: { label: string; items: typeof tasks; tone?: string }[] = [
    { label: "Overdue", items: overdue, tone: "text-[var(--color-critical)]" },
    { label: "Upcoming", items: upcoming },
    { label: "Completed", items: completed },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quick add a task..."
            className="flex-1 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-plane)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-series-1)]"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-[var(--color-series-1)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus size={15} /> Add
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium capitalize",
                filter === c
                  ? "border-[var(--color-series-1)] bg-[var(--color-series-1)]/10 text-[var(--color-series-1)]"
                  : "border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-plane)]"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </Card>

      {groups.map((group) => (
        <Card key={group.label}>
          <CardHeader
            title={group.label}
            subtitle={`${group.items.length} task${group.items.length === 1 ? "" : "s"}`}
            icon={group.label === "Completed" ? <CheckCircle2 size={18} /> : <ListChecks size={18} />}
          />
          {group.items.length === 0 ? (
            <p className="py-4 text-center text-sm text-[var(--color-ink-muted)]">Nothing here.</p>
          ) : (
            <ul className="divide-y divide-[var(--color-hairline)]">
              {group.items.map((task) => {
                const meta = CATEGORY_META[task.category];
                const urgency = urgencyFromDays(daysUntil(task.dueDate));
                return (
                  <li key={task.id} className="flex items-center gap-3 py-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        task.completed
                          ? "border-[var(--color-good)] bg-[var(--color-good)] text-white"
                          : "border-[var(--color-hairline)] hover:border-[var(--color-series-1)]"
                      )}
                    >
                      {task.completed && <CheckCircle2 size={14} />}
                    </button>
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `color-mix(in oklab, ${meta.color} 14%, transparent)`, color: meta.color }}
                    >
                      <meta.icon size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "truncate text-sm font-medium text-[var(--color-ink)]",
                          task.completed && "text-[var(--color-ink-muted)] line-through"
                        )}
                      >
                        {task.title}
                        {task.aiGenerated && <Sparkles size={11} className="ml-1.5 inline text-[var(--color-series-1)]" />}
                      </p>
                      {!task.completed && (
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
                      )}
                    </div>
                    {!task.completed && <PriorityPill priority={task.priority} />}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      ))}
    </div>
  );
}
