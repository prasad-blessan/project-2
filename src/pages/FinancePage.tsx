import { CheckCircle2, CreditCard, Repeat, Wallet } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { FinanceOverview } from "@/components/dashboard/FinanceOverview";
import { useStore } from "@/store/useStore";
import { cn, daysUntil, fmtDate, fmtMoney, relativeDueLabel, urgencyFromDays } from "@/lib/utils";

const USAGE_LABEL: Record<string, { label: string; status: "good" | "warning" | "serious" | "critical" }> = {
  high: { label: "Actively used", status: "good" },
  medium: { label: "Occasionally used", status: "warning" },
  low: { label: "Rarely used", status: "serious" },
  unused: { label: "Unused - consider cancelling", status: "critical" },
};

export default function FinancePage() {
  const bills = useStore((s) => s.bills);
  const subscriptions = useStore((s) => s.subscriptions);
  const payBill = useStore((s) => s.payBill);

  return (
    <div className="space-y-4">
      <FinanceOverview />

      <Card>
        <CardHeader title="Bills" subtitle={`${bills.filter((b) => !b.paid).length} unpaid`} icon={<Wallet size={18} />} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-ink-muted)]">
                <th className="pb-2 font-medium">Bill</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Due</th>
                <th className="pb-2 font-medium">Autopay</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => {
                const urgency = bill.paid ? "good" : urgencyFromDays(daysUntil(bill.dueDate));
                return (
                  <tr key={bill.id} className="border-b border-[var(--color-hairline)] last:border-0">
                    <td className="py-3 font-medium text-[var(--color-ink)]">{bill.name}</td>
                    <td className="py-3 tabular-nums text-[var(--color-ink)]">{fmtMoney(bill.amount)}</td>
                    <td className={cn("py-3", urgency === "critical" || urgency === "serious" ? "text-[var(--color-critical)]" : "text-[var(--color-ink-secondary)]")}>
                      {bill.paid ? fmtDate(bill.dueDate) : relativeDueLabel(bill.dueDate)}
                    </td>
                    <td className="py-3 text-[var(--color-ink-secondary)]">{bill.autopay ? "Yes" : "No"}</td>
                    <td className="py-3">
                      <StatusPill status={urgency} label={bill.paid ? "Paid" : undefined} />
                    </td>
                    <td className="py-3 text-right">
                      {!bill.paid && (
                        <button
                          onClick={() => payBill(bill.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-series-1)] px-2.5 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                        >
                          <CheckCircle2 size={12} /> Mark paid
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Subscriptions"
          subtitle={`${subscriptions.length} active - ${fmtMoney(
            subscriptions.reduce((s, x) => s + (x.billingCycle === "monthly" ? x.amount : x.amount / 12), 0)
          )}/mo`}
          icon={<Repeat size={18} />}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub) => {
            const usage = USAGE_LABEL[sub.usage];
            return (
              <div key={sub.id} className="rounded-xl border border-[var(--color-hairline)] p-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-plane)] text-[var(--color-ink-secondary)]">
                      <CreditCard size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-ink)]">{sub.name}</p>
                      <p className="text-[11px] text-[var(--color-ink-muted)]">{sub.category}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold tabular-nums text-[var(--color-ink)]">{fmtMoney(sub.amount)}</p>
                </div>
                <p className="mb-2 text-xs text-[var(--color-ink-muted)]">
                  Renews {fmtDate(sub.nextRenewal)} · {sub.billingCycle}
                </p>
                <StatusPill status={usage.status} label={usage.label} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
