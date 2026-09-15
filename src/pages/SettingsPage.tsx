import { useState } from "react";
import { Bell, Moon, Shield, User } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { cn, initials } from "@/lib/utils";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-[var(--color-series-1)]" : "bg-[var(--color-hairline)]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const [prefs, setPrefs] = useState({ billAlerts: true, maintenanceAlerts: true, weeklyReport: true, smartSuggestions: true });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Profile" icon={<User size={18} />} />
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-series-1)] text-lg font-semibold text-white">
            {initials("John Doe")}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-ink)]">John Doe</p>
            <p className="text-xs text-[var(--color-ink-muted)]">prasad_l@levelshift.com</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Appearance" icon={<Moon size={18} />} />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--color-ink)]">Dark mode</p>
            <p className="text-xs text-[var(--color-ink-muted)]">Switch between light and dark themes</p>
          </div>
          <Toggle checked={theme === "dark"} onChange={toggleTheme} />
        </div>
      </Card>

      <Card>
        <CardHeader title="AI & Notifications" icon={<Bell size={18} />} />
        <div className="space-y-4">
          {[
            { key: "billAlerts" as const, label: "Bill due alerts", desc: "Get notified before bills are due" },
            { key: "maintenanceAlerts" as const, label: "Maintenance predictions", desc: "AI-predicted service reminders" },
            { key: "weeklyReport" as const, label: "Weekly AI report", desc: "A summary of wins, risks, and recommendations" },
            { key: "smartSuggestions" as const, label: "Smart suggestions", desc: "Proactive cost-saving and scheduling tips" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-ink)]">{item.label}</p>
                <p className="text-xs text-[var(--color-ink-muted)]">{item.desc}</p>
              </div>
              <Toggle checked={prefs[item.key]} onChange={() => setPrefs((p) => ({ ...p, [item.key]: !p[item.key] }))} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Privacy & Security" icon={<Shield size={18} />} />
        <p className="text-sm text-[var(--color-ink-secondary)]">
          Your documents and data are processed locally in this workspace. Review extracted information before relying
          on it for important decisions.
        </p>
      </Card>
    </div>
  );
}
