import { useEffect } from "react";

import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { useDebtsList, useDebtsRealtime } from "@/hooks/useDebtsData";
import { SummaryCards } from "@/pages/dashboard/components/SummaryCards";
import { ProjectionChart } from "@/pages/dashboard/components/ProjectionChart";
import { UpcomingPaymentsList } from "@/pages/dashboard/components/UpcomingPaymentsList";
import { CriticalDebts } from "@/pages/dashboard/components/CriticalDebts";

export const DashboardPage = () => {
  const { data: dashboardData, isLoading: loadingSummary } = useDashboardSummary();
  const { data: debts, isLoading: loadingDebts } = useDebtsList();
  const unsubscribe = useDebtsRealtime();

  useEffect(() => {
    return () => unsubscribe?.();
  }, [unsubscribe]);

  return (
    <div className="flex flex-col gap-8">
      <SummaryCards summary={dashboardData?.summary} loading={loadingSummary} />
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <ProjectionChart debts={debts ?? []} loading={loadingDebts} />
        <UpcomingPaymentsList
          payments={dashboardData?.upcomingPayments ?? []}
          loading={loadingSummary}
        />
      </div>
      <CriticalDebts debts={debts ?? []} loading={loadingDebts} />
    </div>
  );
};
