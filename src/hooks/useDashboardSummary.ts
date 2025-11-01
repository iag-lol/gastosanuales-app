import { useQuery } from "@tanstack/react-query";

import { useSupabase } from "@/context/SupabaseProvider";
import type { DebtSummary } from "@/types/debt";
import type { Payment } from "@/types/payment";
import {
  fetchDebts,
  fetchUpcomingPayments,
  type DebtFilters
} from "@/services/debtsService";
import { computeDebtSummary } from "@/utils/summary";

export interface DashboardData {
  summary: DebtSummary;
  upcomingPayments: Payment[];
}

export const useDashboardSummary = (filters?: DebtFilters) => {
  const { client, ready } = useSupabase();

  return useQuery({
    queryKey: ["dashboard-summary", filters],
    enabled: ready && !!client,
    queryFn: async () => {
      const debts = await fetchDebts(client!, filters);
      const upcomingPayments = await fetchUpcomingPayments(client!);
      return {
        summary: computeDebtSummary(debts),
        upcomingPayments
      } as DashboardData;
    },
    refetchInterval: 1000 * 60 * 5
  });
};
