import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult
} from "@tanstack/react-query";

import { useSupabase } from "@/context/SupabaseProvider";
import { useDebtsContext } from "@/context/DebtsProvider";
import type { Debt, DebtInput } from "@/types/debt";
import type { PaymentInput } from "@/types/payment";
import {
  createDebt,
  fetchDebts,
  fetchNotifications,
  fetchPaymentsForDebt,
  recordPayment,
  subscribeToDebtChanges,
  updateDebtStatus
} from "@/services/debtsService";

export const useDebtsList = (): UseQueryResult<Debt[]> => {
  const { client, ready } = useSupabase();
  const { filters } = useDebtsContext();

  return useQuery({
    queryKey: ["debts", filters],
    enabled: ready && Boolean(client),
    queryFn: () => fetchDebts(client!, filters),
    staleTime: 1000 * 30
  });
};

export const useDebtsRealtime = () => {
  const { client, ready } = useSupabase();
  const queryClient = useQueryClient();

  return useMemo(() => {
    if (!client || !ready) {
      return () => {};
    }

    const unsubscribe = subscribeToDebtChanges(client, () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    });

    return unsubscribe;
  }, [client, ready, queryClient]);
};

export const useCreateDebt = () => {
  const { client } = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DebtInput) => {
      if (!client) {
        throw new Error("Configura Supabase antes de crear deudas.");
      }
      return createDebt(client, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    }
  });
};

export const useUpdateDebtStatus = () => {
  const { client } = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ debtId, status }: { debtId: string; status: Debt["status"] }) => {
      if (!client) {
        throw new Error("Configura Supabase antes de actualizar deudas.");
      }
      return updateDebtStatus(client, debtId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    }
  });
};

export const useRecordPayment = () => {
  const { client } = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PaymentInput) => {
      if (!client) {
        throw new Error("Configura Supabase antes de registrar pagos.");
      }
      return recordPayment(client, payload);
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["payments", payload.debt_id] });
    }
  });
};

export const usePayments = (debtId: string | null) => {
  const { client, ready } = useSupabase();

  return useQuery({
    queryKey: ["payments", debtId],
    enabled: ready && !!client && !!debtId,
    queryFn: () => fetchPaymentsForDebt(client!, debtId!),
    staleTime: 1000 * 60
  });
};

export const useUpcomingNotifications = () => {
  const { client, ready } = useSupabase();

  return useQuery({
    queryKey: ["notifications", "upcoming"],
    enabled: ready && !!client,
    queryFn: () => fetchNotifications(client!),
    refetchInterval: 1000 * 60 * 10
  });
};
