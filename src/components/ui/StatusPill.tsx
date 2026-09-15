import { AlertTriangle, CheckCircle2, AlertOctagon, Info } from "lucide-react";
import type { Status } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; Icon: typeof Info }> = {
  good: { label: "On track", color: "var(--color-good)", bg: "color-mix(in oklab, var(--color-good) 14%, transparent)", Icon: CheckCircle2 },
  warning: { label: "Due soon", color: "var(--color-warning)", bg: "color-mix(in oklab, var(--color-warning) 18%, transparent)", Icon: AlertTriangle },
  serious: { label: "Attention", color: "var(--color-serious)", bg: "color-mix(in oklab, var(--color-serious) 16%, transparent)", Icon: AlertTriangle },
  critical: { label: "Critical", color: "var(--color-critical)", bg: "color-mix(in oklab, var(--color-critical) 14%, transparent)", Icon: AlertOctagon },
};

export function StatusPill({ status, label, className }: { status: Status; label?: string; className?: string }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.Icon;
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", className)}
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <Icon size={12} strokeWidth={2.5} />
      {label ?? cfg.label}
    </span>
  );
}

export function PriorityPill({ priority }: { priority: "low" | "medium" | "high" | "urgent" }) {
  const map: Record<string, Status> = { low: "good", medium: "warning", high: "serious", urgent: "critical" };
  return <StatusPill status={map[priority]} label={priority[0].toUpperCase() + priority.slice(1)} />;
}
