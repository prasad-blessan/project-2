import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Wallet } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { financeMonthly, spendByCategory } from "@/lib/mockData";
import { fmtMoney } from "@/lib/utils";

const PIE_COLORS = [
  "var(--color-series-1)",
  "var(--color-series-2)",
  "var(--color-series-3)",
  "var(--color-series-4)",
  "var(--color-series-5)",
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface)] px-3 py-2 text-xs shadow-md">
      {label && <p className="mb-1 font-semibold text-[var(--color-ink)]">{label}</p>}
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-[var(--color-ink-secondary)]">
          {p.name}: <span className="font-medium text-[var(--color-ink)]">{fmtMoney(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

export function FinanceOverview() {
  const bills = useStore((s) => s.bills);
  const subscriptions = useStore((s) => s.subscriptions);

  const unpaidTotal = bills.filter((b) => !b.paid).reduce((sum, b) => sum + b.amount, 0);
  const subsMonthly = subscriptions.reduce(
    (sum, s) => sum + (s.billingCycle === "monthly" ? s.amount : s.amount / 12),
    0
  );

  return (
    <Card>
      <CardHeader title="Finance Overview" subtitle="Spending trend and where it goes" icon={<Wallet size={18} />} />

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-[var(--color-plane)] p-3">
          <p className="text-[11px] text-[var(--color-ink-muted)]">Unpaid bills</p>
          <p className="text-lg font-bold tabular-nums text-[var(--color-ink)]">{fmtMoney(unpaidTotal)}</p>
        </div>
        <div className="rounded-xl bg-[var(--color-plane)] p-3">
          <p className="text-[11px] text-[var(--color-ink-muted)]">Subscriptions / mo</p>
          <p className="text-lg font-bold tabular-nums text-[var(--color-ink)]">{fmtMoney(subsMonthly)}</p>
        </div>
        <div className="rounded-xl bg-[var(--color-plane)] p-3">
          <p className="text-[11px] text-[var(--color-ink-muted)]">This month</p>
          <p className="text-lg font-bold tabular-nums text-[var(--color-ink)]">
            {fmtMoney(financeMonthly[financeMonthly.length - 1].spend)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="mb-1 text-xs font-medium text-[var(--color-ink-secondary)]">Spend vs. budget</p>
          <ResponsiveContainer width="100%" height={160}>
            <ComposedChart data={financeMonthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-hairline)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-ink-muted)" }} axisLine={{ stroke: "var(--color-baseline)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-ink-muted)" }} axisLine={false} tickLine={false} width={44} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-plane)" }} />
              <Bar dataKey="spend" name="Spend" fill="var(--color-series-1)" radius={[4, 4, 0, 0]} maxBarSize={22} />
              <Line dataKey="budget" name="Budget" stroke="var(--color-ink-muted)" strokeDasharray="4 4" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium text-[var(--color-ink-secondary)]">By category</p>
          <div className="flex items-center gap-2">
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie
                  data={spendByCategory}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={32}
                  outerRadius={50}
                  paddingAngle={2}
                  stroke="var(--color-surface)"
                  strokeWidth={2}
                >
                  {spendByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-1 text-[11px]">
              {spendByCategory.map((c, i) => (
                <li key={c.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-[var(--color-ink-secondary)]">{c.name}</span>
                  <span className="ml-auto font-medium tabular-nums text-[var(--color-ink)]">{fmtMoney(c.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
