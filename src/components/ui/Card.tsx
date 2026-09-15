import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] shadow-sm shadow-black/[0.03]",
        padded && "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-plane)] text-[var(--color-ink)]">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">{title}</h3>
          {subtitle && <p className="text-xs text-[var(--color-ink-secondary)]">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
