import { FileText, FolderOpen } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { DocumentUploadAnalyzer } from "@/components/ai/DocumentUploadAnalyzer";
import { useStore } from "@/store/useStore";
import { daysUntil, fmtDate } from "@/lib/utils";

export default function DocumentsPage() {
  const documents = useStore((s) => s.documents);
  const sorted = [...documents].sort((a, b) => {
    if (!a.expiryDate) return 1;
    if (!b.expiryDate) return -1;
    return daysUntil(a.expiryDate) - daysUntil(b.expiryDate);
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
      <Card>
        <CardHeader title="Upload & Extract" subtitle="AI reads dates and fields for you" icon={<FileText size={18} />} />
        <DocumentUploadAnalyzer />
      </Card>

      <Card>
        <CardHeader title="Document Vault" subtitle={`${documents.length} documents stored`} icon={<FolderOpen size={18} />} />
        <ul className="divide-y divide-[var(--color-hairline)]">
          {sorted.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-plane)] text-[var(--color-ink-secondary)]">
                <FileText size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--color-ink)]">{doc.name}</p>
                <p className="text-xs capitalize text-[var(--color-ink-muted)]">
                  {doc.type} · {(doc.fileSizeKb / 1024).toFixed(1)} MB
                  {doc.expiryDate && ` · Expires ${fmtDate(doc.expiryDate)}`}
                </p>
              </div>
              <StatusPill status={doc.status} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
