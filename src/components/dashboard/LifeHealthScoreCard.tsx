import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { HeartPulse } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { computeHealthFactors, overallScore, scoreStatus } from "@/lib/healthScore";
import { cn } from "@/lib/utils";

const STATUS_TEXT: Record<string, string> = {
  good: "Excellent shape",
  warning: "Needs some attention",
  serious: "Several things need action",
  critical: "Urgent issues need attention",
};

export function LifeHealthScoreCard() {
  const tasks = useStore((s) => s.tasks);
  const bills = useStore((s) => s.bills);
  const documents = useStore((s) => s.documents);
  const maintenance = useStore((s) => s.maintenance);

  const factors = computeHealthFactors(tasks, bills, documents, maintenance);
  const score = overallScore(factors);
  const status = scoreStatus(score);
  const colorVar = `var(--color-${status})`;

  const data = [{ name: "score", value: score, fill: colorVar }];

  return (
    <Card>
      <CardHeader title="Life Health Score" subtitle="Overall wellbeing of your life admin" icon={<HeartPulse size={18} />} />
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex h-40 w-40 shrink-0 items-center justify-center">
          <RadialBarChart
            width={160}
            height={160}
            innerRadius="72%"
            outerRadius="100%"
            barSize={12}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "var(--color-plane)" }} />
          </RadialBarChart>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold tabular-nums text-[var(--color-ink)]">{score}</span>
            <span className="text-[11px] text-[var(--color-ink-muted)]">/ 100</span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-2.5">
          <p className={cn("text-sm font-semibold")} style={{ color: colorVar }}>
            {STATUS_TEXT[status]}
          </p>
          {factors.map((f) => (
            <div key={f.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--color-ink-secondary)]">{f.label}</span>
                <span className="tabular-nums text-[var(--color-ink-muted)]">{f.detail}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-plane)]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${f.score}%`,
                    backgroundColor: `var(--color-${scoreStatus(f.score)})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
