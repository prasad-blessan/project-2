import { Link, useLocation } from "react-router-dom";
import { Bell, Moon, Search, Sparkles, Sun } from "lucide-react";
import { useStore } from "@/store/useStore";
import { initials } from "@/lib/utils";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/assistant": "AI Assistant",
  "/tasks": "Tasks & Reminders",
  "/finance": "Bills & Subscriptions",
  "/documents": "Documents",
  "/maintenance": "Maintenance",
  "/family": "Family",
  "/calendar": "Calendar",
  "/notifications": "Notifications",
  "/settings": "Settings",
};

export function Topbar() {
  const { pathname } = useLocation();
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const unread = useStore((s) => s.notifications.filter((n) => !n.read).length);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--color-hairline)] bg-[var(--color-surface)] px-4 sm:px-6">
      <div>
        <h1 className="text-base font-semibold text-[var(--color-ink)] sm:text-lg">
          {TITLES[pathname] ?? "LifePilot AI"}
        </h1>
      </div>

      <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-plane)] px-3 py-2 text-sm text-[var(--color-ink-muted)] sm:flex">
        <Search size={16} />
        <span>Search tasks, bills, documents...</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/assistant"
          className="hidden items-center gap-1.5 rounded-xl bg-[var(--color-series-1)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:flex"
        >
          <Sparkles size={15} />
          Ask AI
        </Link>

        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-plane)]"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <Link
          to="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-plane)]"
          aria-label="Notifications"
        >
          <Bell size={16} />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-critical)] px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </Link>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-series-1)] text-xs font-semibold text-white">
          {initials("John Doe")}
        </div>
      </div>
    </header>
  );
}
