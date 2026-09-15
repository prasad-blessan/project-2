import { FileText } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { useStore } from "@/store/useStore";
import { daysUntil, fmtDate } from "@/lib/utils";

export function DocumentExpiry() {
  const documents = useStore((s) => s.documents);
  const sorted = [...documents]
    .filter((d) => d.expiryDate)
    .sort((a, b) => daysUntil(a.expiryDate!) - daysUntil(b.expiryDate!))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader title="Document Expiry Tracker" subtitle="Policies, IDs, and agreements" icon={<FileText size={18} />} />
      <ul className="divide-y divide-[var(--color-hairline)]">
        {sorted.map((doc) => (
          <li key={doc.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--color-ink)]">{doc.name}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">Expires {fmtDate(doc.expiryDate!)}</p>
            </div>
            <StatusPill status={doc.status} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
