import { AlertOctagon, AlertTriangle, Info, Sparkles, X } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import type { AlertSeverity } from "@/types";
import { cn } from "@/lib/utils";

const SEVERITY_CONFIG: Record<AlertSeverity, { color: string; Icon: typeof Info; bg: string }> = {
  critical: { color: "var(--color-critical)", Icon: AlertOctagon, bg: "color-mix(in oklab, var(--color-critical) 10%, transparent)" },
  warning: { color: "var(--color-warning)", Icon: AlertTriangle, bg: "color-mix(in oklab, var(--color-warning) 14%, transparent)" },
  info: { color: "var(--color-series-1)", Icon: Info, bg: "color-mix(in oklab, var(--color-series-1) 10%, transparent)" },
};

export function AIAlerts() {
  const allAlerts = useStore((s) => s.alerts);
  const dismissAlert = useStore((s) => s.dismissAlert);
  const alerts = allAlerts.filter((a) => !a.actioned);

  return (
    <Card>
      <CardHeader
        title="AI Alerts & Predictions"
        subtitle={`${alerts.length} active insight${alerts.length === 1 ? "" : "s"}`}
        icon={<Sparkles size={18} />}
      />
      <div className="space-y-2.5">
        {alerts.slice(0, 5).map((alert) => {
          const cfg = SEVERITY_CONFIG[alert.severity];
          return (
            <div
              key={alert.id}
              className={cn("flex gap-3 rounded-xl border border-[var(--color-hairline)] p-3")}
              style={{ backgroundColor: cfg.bg }}
            >
              <cfg.Icon size={16} className="mt-0.5 shrink-0" style={{ color: cfg.color }} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--color-ink)]">{alert.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-ink-secondary)]">{alert.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  {alert.suggestedAction && (
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="rounded-lg px-2.5 py-1 text-xs font-semibold text-white"
                      style={{ backgroundColor: cfg.color }}
                    >
                      {alert.suggestedAction}
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-xs font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="h-5 w-5 shrink-0 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
        {alerts.length === 0 && (
          <p className="py-6 text-center text-sm text-[var(--color-ink-muted)]">No active alerts. LifePilot is watching.</p>
        )}
      </div>
    </Card>
  );
}
