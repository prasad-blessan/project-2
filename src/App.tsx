import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useStore } from "@/store/useStore";
import DashboardPage from "@/pages/DashboardPage";
import AIAssistantPage from "@/pages/AIAssistantPage";
import TasksPage from "@/pages/TasksPage";
import FinancePage from "@/pages/FinancePage";
import DocumentsPage from "@/pages/DocumentsPage";
import MaintenancePage from "@/pages/MaintenancePage";
import FamilyPage from "@/pages/FamilyPage";
import CalendarPage from "@/pages/CalendarPage";
import NotificationsPage from "@/pages/NotificationsPage";
import SettingsPage from "@/pages/SettingsPage";

export default function App() {
  const theme = useStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/assistant" element={<AIAssistantPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppShell>
  );
}
