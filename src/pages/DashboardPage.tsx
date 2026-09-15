import { LifeHealthScoreCard } from "@/components/dashboard/LifeHealthScoreCard";
import { UpcomingActions } from "@/components/dashboard/UpcomingActions";
import { AIAlerts } from "@/components/dashboard/AIAlerts";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { FinanceOverview } from "@/components/dashboard/FinanceOverview";
import { DocumentExpiry } from "@/components/dashboard/DocumentExpiry";
import { MaintenanceTracking } from "@/components/dashboard/MaintenanceTracking";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { WeeklyAIReport } from "@/components/dashboard/WeeklyAIReport";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <LifeHealthScoreCard />
      <UpcomingActions />
      <AIAlerts />

      <FinanceOverview />
      <CalendarWidget />

      <DocumentExpiry />
      <MaintenanceTracking />
      <NotificationsPanel />

      <WeeklyAIReport />
    </div>
  );
}
