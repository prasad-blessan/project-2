import { Bell, AlertOctagon, AlertTriangle, Info } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import type { AlertSeverity } from "@/types";
import { fmtDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ICONS: Record<AlertSeverity, typeof Info> = { critical: AlertOctagon, warning: AlertTriangle, info: Info };
const COLORS: Record<AlertSeverity, string> = {
  critical: "var(--color-critical)",
  warning: "var(--color-warning)",
  info: "var(--color-series-1)",
};

export function NotificationsPanel() {
  const notifications = useStore((s) => s.notifications);
  const markRead = useStore((s) => s.markNotificationRead);
  const recent = notifications.slice(0, 5);

  return (
    <Card>
      <CardHeader
        title="Notifications"
        subtitle={`${notifications.filter((n) => !n.read).length} unread`}
        icon={<Bell size={18} />}
      />
      <ul className="space-y-1">
        {recent.map((n) => {
          const Icon = ICONS[n.severity];
          return (
            <li
              key={n.id}
              onClick={() => markRead(n.id)}
              className={cn(
                "flex cursor-pointer items-start gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-[var(--color-plane)]",
                !n.read && "bg-[var(--color-plane)]/60"
              )}
            >
              <Icon size={15} className="mt-0.5 shrink-0" style={{ color: COLORS[n.severity] }} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-ink)]">{n.title}</p>
                <p className="truncate text-xs text-[var(--color-ink-muted)]">{n.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-series-1)]" />}
                <span className="text-[10px] text-[var(--color-ink-muted)]">{fmtDate(n.createdAt, "MMM d")}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
