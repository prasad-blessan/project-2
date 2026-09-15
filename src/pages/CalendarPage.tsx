import { useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { CATEGORY_META } from "@/lib/categoryMeta";
import { buildCalendarEvents } from "@/lib/calendar";
import { useStore } from "@/store/useStore";
import { fmtDate } from "@/lib/utils";

export default function CalendarPage() {
  const tasks = useStore((s) => s.tasks);
  const bills = useStore((s) => s.bills);
  const maintenance = useStore((s) => s.maintenance);
  const events = useMemo(() => buildCalendarEvents(tasks, bills, maintenance), [tasks, bills, maintenance]);
  const sorted = useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)), [events]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <CalendarWidget />
      <Card>
        <CardHeader title="All Events" subtitle={`${sorted.length} scheduled`} icon={<CalendarDays size={18} />} />
        <ul className="max-h-[520px] space-y-1 overflow-y-auto">
          {sorted.map((ev) => {
            const meta = CATEGORY_META[ev.category];
            return (
              <li key={ev.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-[var(--color-plane)]">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `color-mix(in oklab, ${meta.color} 14%, transparent)`, color: meta.color }}
                >
                  <meta.icon size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-ink)]">{ev.title}</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">{fmtDate(ev.date)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
