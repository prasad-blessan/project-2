import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListChecks, Wallet, Sparkles, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/assistant", label: "AI", icon: Sparkles },
  { to: "/finance", label: "Finance", icon: Wallet },
  { to: "/maintenance", label: "Upkeep", icon: Wrench },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-[var(--color-hairline)] bg-[var(--color-surface)] lg:hidden">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium",
              isActive ? "text-[var(--color-series-1)]" : "text-[var(--color-ink-muted)]"
            )
          }
        >
          <item.icon size={18} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
