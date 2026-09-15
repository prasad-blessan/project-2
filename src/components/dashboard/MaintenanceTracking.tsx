import { Wrench, Sparkles } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { useStore } from "@/store/useStore";
import { relativeDueLabel } from "@/lib/utils";

export function MaintenanceTracking() {
  const maintenance = useStore((s) => s.maintenance);
  const sorted = [...maintenance].sort((a, b) => a.nextDue.localeCompare(b.nextDue)).slice(0, 5);

  return (
    <Card>
      <CardHeader title="Maintenance Tracking" subtitle="Home & vehicle service schedule" icon={<Wrench size={18} />} />
      <ul className="divide-y divide-[var(--color-hairline)]">
        {sorted.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-sm font-medium text-[var(--color-ink)]">
                {item.title}
                {item.predicted && <Sparkles size={11} className="shrink-0 text-[var(--color-series-1)]" />}
              </p>
              <p className="text-xs text-[var(--color-ink-muted)]">
                {item.assetName} · {relativeDueLabel(item.nextDue)}
              </p>
            </div>
            <StatusPill status={item.status} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
