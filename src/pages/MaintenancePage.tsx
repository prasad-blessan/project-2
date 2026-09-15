import type { ReactNode } from "react";
import { Car, Home, Sparkles, Wrench } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { useStore } from "@/store/useStore";
import type { MaintenanceItem } from "@/types";
import { fmtDate, relativeDueLabel } from "@/lib/utils";

function Section({ title, icon, items }: { title: string; icon: ReactNode; items: MaintenanceItem[] }) {
  return (
    <Card>
      <CardHeader title={title} subtitle={`${items.length} tracked items`} icon={icon} />
      <ul className="divide-y divide-[var(--color-hairline)]">
        {items.map((item) => (
          <li key={item.id} className="py-3">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)]">
                  {item.title}
                  {item.predicted && <Sparkles size={11} className="text-[var(--color-series-1)]" />}
                </p>
                <p className="text-xs text-[var(--color-ink-muted)]">{item.assetName}</p>
              </div>
              <StatusPill status={item.status} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-[var(--color-ink-secondary)]">
              <span>{item.lastServiced ? `Last: ${fmtDate(item.lastServiced)}` : "No history"}</span>
              <span className="font-medium">{relativeDueLabel(item.nextDue)}</span>
            </div>
            {item.mileage && item.nextMileage && (
              <div className="mt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-plane)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-series-1)]"
                    style={{ width: `${Math.min(100, (item.mileage / item.nextMileage) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-[var(--color-ink-muted)]">
                  {item.mileage.toLocaleString()} / {item.nextMileage.toLocaleString()} mi
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function MaintenancePage() {
  const maintenance = useStore((s) => s.maintenance);
  const vehicle = maintenance.filter((m) => m.category === "vehicle");
  const home = maintenance.filter((m) => m.category === "home");

  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-series-1)]/10 text-[var(--color-series-1)]">
          <Wrench size={18} />
        </div>
        <p className="text-sm text-[var(--color-ink-secondary)]">
          LifePilot predicts upcoming maintenance from service intervals and history, so nothing sneaks up on you.
        </p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Vehicles" icon={<Car size={18} />} items={vehicle} />
        <Section title="Home" icon={<Home size={18} />} items={home} />
      </div>
    </div>
  );
}
