import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { CATEGORY_META } from "@/lib/categoryMeta";
import { buildCalendarEvents } from "@/lib/calendar";
import { cn } from "@/lib/utils";

export function CalendarWidget() {
  const [cursor, setCursor] = useState(new Date());
  const tasks = useStore((s) => s.tasks);
  const bills = useStore((s) => s.bills);
  const maintenance = useStore((s) => s.maintenance);
  const events = useMemo(() => buildCalendarEvents(tasks, bills, maintenance), [tasks, bills, maintenance]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, typeof events>();
    for (const ev of events) {
      const key = ev.date;
      map.set(key, [...(map.get(key) ?? []), ev]);
    }
    return map;
  }, [events]);

  const [selected, setSelected] = useState<Date | null>(null);
  const selectedKey = selected ? format(selected, "yyyy-MM-dd") : null;
  const selectedEvents = selectedKey ? eventsByDay.get(selectedKey) ?? [] : [];

  return (
    <Card>
      <CardHeader
        title="Calendar"
        subtitle={format(cursor, "MMMM yyyy")}
        icon={<CalendarDays size={18} />}
        action={
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCursor((c) => subMonths(c, 1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[var(--color-plane)]"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setCursor((c) => addMonths(c, 1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[var(--color-plane)]"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-[var(--color-ink-muted)]">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, cursor);
          const isSel = selected && isSameDay(day, selected);
          return (
            <button
              key={key}
              onClick={() => setSelected(day)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-xs transition-colors",
                !inMonth && "text-[var(--color-ink-muted)] opacity-40",
                inMonth && "text-[var(--color-ink)]",
                isToday(day) && "font-bold ring-1 ring-[var(--color-series-1)]",
                isSel && "bg-[var(--color-series-1)] text-white"
              )}
            >
              {format(day, "d")}
              <span className="flex gap-0.5">
                {dayEvents.slice(0, 3).map((ev, i) => (
                  <span
                    key={i}
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: isSel ? "white" : CATEGORY_META[ev.category].color }}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 border-t border-[var(--color-hairline)] pt-3">
          <p className="mb-2 text-xs font-semibold text-[var(--color-ink-secondary)]">
            {format(selected, "EEEE, MMM d")}
          </p>
          {selectedEvents.length === 0 ? (
            <p className="text-xs text-[var(--color-ink-muted)]">No events this day.</p>
          ) : (
            <ul className="space-y-1.5">
              {selectedEvents.map((ev) => (
                <li key={ev.id} className="flex items-center gap-2 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: CATEGORY_META[ev.category].color }} />
                  <span className="text-[var(--color-ink)]">{ev.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
