import { Fragment, useRef, useState } from "react";
import { CheckCircle2, FileText, Loader2, UploadCloud } from "lucide-react";
import { useStore } from "@/store/useStore";
import { fmtDate } from "@/lib/utils";
import type { AppDocument } from "@/types";

export function DocumentUploadAnalyzer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const addDocumentFromUpload = useStore((s) => s.addDocumentFromUpload);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AppDocument | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file: File) {
    setResult(null);
    setAnalyzing(true);
    window.setTimeout(() => {
      const doc = addDocumentFromUpload(file.name);
      setResult(doc);
      setAnalyzing(false);
    }, 1400);
  }

  return (
    <div className="rounded-2xl border border-dashed border-[var(--color-hairline)] p-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl py-6 text-center transition-colors ${
          dragOver ? "bg-[var(--color-plane)]" : ""
        }`}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-series-1)]/10 text-[var(--color-series-1)]">
          <UploadCloud size={20} />
        </div>
        <p className="text-sm font-medium text-[var(--color-ink)]">Drop a document, or click to upload</p>
        <p className="text-xs text-[var(--color-ink-muted)]">
          Insurance policies, IDs, leases, warranties — LifePilot extracts key dates automatically
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {analyzing && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--color-plane)] px-3 py-2.5 text-sm text-[var(--color-ink-secondary)]">
          <Loader2 size={15} className="animate-spin" />
          Analyzing document with AI — extracting dates and key fields...
        </div>
      )}

      {result && !analyzing && (
        <div className="mt-4 space-y-2 rounded-xl border border-[var(--color-hairline)] p-3.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-good)]">
            <CheckCircle2 size={15} /> Extraction complete
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
            <FileText size={14} className="text-[var(--color-ink-muted)]" />
            {result.name}
          </div>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <dt className="text-[var(--color-ink-muted)]">Type</dt>
            <dd className="text-[var(--color-ink)] capitalize">{result.type}</dd>
            {result.expiryDate && (
              <>
                <dt className="text-[var(--color-ink-muted)]">Expiry date</dt>
                <dd className="text-[var(--color-ink)]">{fmtDate(result.expiryDate)}</dd>
              </>
            )}
            {result.extracted &&
              Object.entries(result.extracted).map(([k, v]) => (
                <Fragment key={k}>
                  <dt className="text-[var(--color-ink-muted)]">{k}</dt>
                  <dd className="text-[var(--color-ink)]">{v}</dd>
                </Fragment>
              ))}
          </dl>
          <p className="pt-1 text-xs text-[var(--color-series-1)]">
            A reminder was automatically created ahead of the expiry date.
          </p>
        </div>
      )}
    </div>
  );
}
