import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult
} from "@tanstack/react-query";
import { endOfMonth, parseISO, startOfMonth, subMonths } from "date-fns";

import { useSupabase } from "@/context/SupabaseProvider";
import type {
  UtilityInsight,
  UtilityMeasurement,
  UtilityMeasurementInput,
  UtilityService
} from "@/types/utilities";
import {
  createUtilityMeasurement,
  fetchUtilityMeasurements,
  fetchUtilityServices,
  MeasurementsFilters,
  upsertUtilityService
} from "@/services/utilitiesService";
import { formatCurrency } from "@/utils/dates";

export const useUtilityServices = (): UseQueryResult<UtilityService[]> => {
  const { client, ready } = useSupabase();

  return useQuery({
    queryKey: ["utility-services"],
    enabled: ready && !!client,
    queryFn: () => fetchUtilityServices(client!)
  });
};

export const useUtilityMeasurements = (
  filters?: MeasurementsFilters
): UseQueryResult<UtilityMeasurement[]> => {
  const { client, ready } = useSupabase();

  return useQuery({
    queryKey: ["utility-measurements", filters],
    enabled: ready && !!client,
    queryFn: () => fetchUtilityMeasurements(client!, filters)
  });
};

const safeNumber = (value: number | string | undefined) => {
  if (value === undefined || value === null) {
    return 0;
  }
  if (typeof value === "string") {
    return Number.parseFloat(value) || 0;
  }
  return value;
};

export const useUtilityInsights = () => {
  const now = new Date();
  const currentMonthFilters: MeasurementsFilters = {
    from: startOfMonth(now).toISOString(),
    to: endOfMonth(now).toISOString()
  };
  const previousMonthFilters: MeasurementsFilters = {
    from: startOfMonth(subMonths(now, 1)).toISOString(),
    to: endOfMonth(subMonths(now, 1)).toISOString()
  };

  const servicesQuery = useUtilityServices();
  const currentMeasurementsQuery = useUtilityMeasurements(currentMonthFilters);
  const previousMeasurementsQuery = useUtilityMeasurements(previousMonthFilters);

  const insights = useMemo<UtilityInsight[]>(() => {
    if (!servicesQuery.data) {
      return [];
    }

    return servicesQuery.data.map((service) => {
      const currentRecords =
        currentMeasurementsQuery.data?.filter((measurement) => measurement.service_id === service.id) ??
        [];
      const previousRecords =
        previousMeasurementsQuery.data?.filter((measurement) => measurement.service_id === service.id) ??
        [];

      const currentAmount = currentRecords.reduce(
        (acc, measurement) => acc + safeNumber(measurement.amount),
        0
      );
      const previousAmount = previousRecords.reduce(
        (acc, measurement) => acc + safeNumber(measurement.amount),
        0
      );

      const avgUnits =
        currentRecords.reduce((acc, measurement) => acc + measurement.units_used, 0) /
        (currentRecords.length || 1);

      const variation =
        previousAmount === 0 ? (currentAmount > 0 ? 100 : 0) : ((currentAmount - previousAmount) / previousAmount) * 100;

      return {
        service,
        currentAmount,
        previousAmount,
        variation,
        averageUnits: Math.round(avgUnits * 100) / 100
      };
    });
  }, [servicesQuery.data, currentMeasurementsQuery.data, previousMeasurementsQuery.data]);

  const totalCurrent = insights.reduce((sum, record) => sum + record.currentAmount, 0);
  const totalPrevious = insights.reduce((sum, record) => sum + record.previousAmount, 0);

  return {
    services: servicesQuery,
    currentMeasurements: currentMeasurementsQuery,
    previousMeasurements: previousMeasurementsQuery,
    insights,
    summary: {
      totalCurrent,
      totalPrevious,
      variation:
        totalPrevious === 0 ? (totalCurrent > 0 ? 100 : 0) : ((totalCurrent - totalPrevious) / totalPrevious) * 100,
      formattedTotal: formatCurrency(totalCurrent)
    }
  };
};

export const useCreateUtilityMeasurement = () => {
  const { client } = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UtilityMeasurementInput) => {
      if (!client) {
        throw new Error("Configura Supabase antes de registrar servicios.");
      }
      return createUtilityMeasurement(client, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utility-measurements"] });
      queryClient.invalidateQueries({ queryKey: ["utility-services"] });
    }
  });
};

export const useUpsertUtilityService = () => {
  const { client } = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<UtilityService> & { id?: string }) => {
      if (!client) {
        throw new Error("Configura Supabase antes de gestionar servicios.");
      }
      return upsertUtilityService(client, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utility-services"] });
    }
  });
};
