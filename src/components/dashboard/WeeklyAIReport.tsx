import { BrainCircuit, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { weeklyReport } from "@/lib/mockData";
import { fmtDate } from "@/lib/utils";

export function WeeklyAIReport() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader
        title="Weekly AI Report"
        subtitle={`Week of ${fmtDate(weeklyReport.weekOf.toISOString())}`}
        icon={<BrainCircuit size={18} />}
      />
      <p className="mb-4 text-sm leading-relaxed text-[var(--color-ink-secondary)]">{weeklyReport.summary}</p>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-good)]">
            <CheckCircle2 size={13} /> Wins
          </p>
          <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
            {weeklyReport.wins.map((w, i) => (
              <li key={i} className="leading-snug">
                {w}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-critical)]">
            <AlertTriangle size={13} /> Risks
          </p>
          <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
            {weeklyReport.risks.map((r, i) => (
              <li key={i} className="leading-snug">
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-series-1)]">
            <Lightbulb size={13} /> Recommendations
          </p>
          <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
            {weeklyReport.recommendations.map((r, i) => (
              <li key={i} className="leading-snug">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
