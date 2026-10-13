import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  Wallet,
  FileText,
  Wrench,
  Users,
  CalendarDays,
  Sparkles,
  Settings,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/tasks", label: "Tasks & Reminders", icon: ListChecks },
  { to: "/finance", label: "Bills & Subscriptions", icon: Wallet },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/family", label: "Family", icon: Users },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-hairline)] bg-[var(--color-surface)] px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-series-1)] text-white">
          <Compass size={18} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-[var(--color-ink)]">LifePilot AI</p>
          <p className="text-[11px] leading-tight text-[var(--color-ink-secondary)]">Life command center test</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--color-series-1)]/10 text-[var(--color-series-1)]"
                  : "text-[var(--color-ink-secondary)] hover:bg-[var(--color-plane)] hover:text-[var(--color-ink)]"
              )
            }
          >
            <item.icon size={17} strokeWidth={2.2} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isActive
              ? "bg-[var(--color-series-1)]/10 text-[var(--color-series-1)]"
              : "text-[var(--color-ink-secondary)] hover:bg-[var(--color-plane)] hover:text-[var(--color-ink)]"
          )
        }
      >
        <Settings size={17} strokeWidth={2.2} />
        Settings
      </NavLink>
    </aside>
  );
}
