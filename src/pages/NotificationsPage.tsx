import { AlertOctagon, AlertTriangle, Bell, Info } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import type { AlertSeverity } from "@/types";
import { cn, fmtDate } from "@/lib/utils";

const ICONS: Record<AlertSeverity, typeof Info> = { critical: AlertOctagon, warning: AlertTriangle, info: Info };
const COLORS: Record<AlertSeverity, string> = {
  critical: "var(--color-critical)",
  warning: "var(--color-warning)",
  info: "var(--color-series-1)",
};

export default function NotificationsPage() {
  const notifications = useStore((s) => s.notifications);
  const markRead = useStore((s) => s.markNotificationRead);
  const markAllRead = useStore((s) => s.markAllNotificationsRead);

  return (
    <Card>
      <CardHeader
        title="All Notifications"
        subtitle={`${notifications.filter((n) => !n.read).length} unread`}
        icon={<Bell size={18} />}
        action={
          <button onClick={markAllRead} className="text-xs font-medium text-[var(--color-series-1)] hover:underline">
            Mark all as read
          </button>
        }
      />
      <ul className="divide-y divide-[var(--color-hairline)]">
        {notifications.map((n) => {
          const Icon = ICONS[n.severity];
          return (
            <li
              key={n.id}
              onClick={() => markRead(n.id)}
              className={cn("flex cursor-pointer items-start gap-3 py-3.5", !n.read && "bg-[var(--color-plane)]/50")}
            >
              <Icon size={16} className="mt-0.5 shrink-0" style={{ color: COLORS[n.severity] }} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-ink)]">{n.title}</p>
                <p className="text-xs text-[var(--color-ink-secondary)]">{n.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-series-1)]" />}
                <span className="text-[11px] text-[var(--color-ink-muted)]">{fmtDate(n.createdAt, "MMM d")}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
