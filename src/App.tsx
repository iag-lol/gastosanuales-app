import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { GlobalToaster } from "@/components/ui/Toaster";
import { DebtsProvider } from "@/context/DebtsProvider";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { DebtsPage } from "@/pages/debts/DebtsPage";
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { SupabaseProvider } from "@/context/SupabaseProvider";

const App = () => (
  <SupabaseProvider>
    <DebtsProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/deudas" element={<DebtsPage />} />
          <Route path="/informes" element={<ReportsPage />} />
          <Route path="/ajustes" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
      <GlobalToaster />
    </DebtsProvider>
  </SupabaseProvider>
);

export default App;
