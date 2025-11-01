import type { SupabaseClient } from "@supabase/supabase-js";
import {
  UtilityMeasurement,
  UtilityMeasurementInput,
  UtilityService
} from "@/types/utilities";

const SERVICES_TABLE = "gastosanuales_servicios";
const MEASUREMENTS_TABLE = "gastosanuales_servicios_mediciones";

export const fetchUtilityServices = async (client: SupabaseClient) => {
  const { data, error } = await client
    .from(SERVICES_TABLE)
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`No se pudieron cargar los servicios: ${error.message}`);
  }

  return (data || []) as UtilityService[];
};

export interface MeasurementsFilters {
  from?: string;
  to?: string;
  serviceId?: string;
  limit?: number;
}

export const fetchUtilityMeasurements = async (
  client: SupabaseClient,
  filters?: MeasurementsFilters
) => {
  let query = client
    .from(MEASUREMENTS_TABLE)
    .select("*")
    .order("period_start", { ascending: false });

  if (filters?.serviceId) {
    query = query.eq("service_id", filters.serviceId);
  }

  if (filters?.from) {
    query = query.gte("period_start", filters.from);
  }

  if (filters?.to) {
    query = query.lte("period_end", filters.to);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`No se pudieron cargar las mediciones: ${error.message}`);
  }

  return (data || []) as UtilityMeasurement[];
};

export const createUtilityMeasurement = async (
  client: SupabaseClient,
  payload: UtilityMeasurementInput
) => {
  const { data, error } = await client
    .from(MEASUREMENTS_TABLE)
    .insert({
      ...payload,
      amount: payload.amount ?? Math.round(payload.units_used * 1)
    })
    .select()
    .single();

  if (error) {
    throw new Error(`No se pudo registrar la medición: ${error.message}`);
  }

  return data as UtilityMeasurement;
};

export const upsertUtilityService = async (
  client: SupabaseClient,
  payload: Partial<UtilityService> & { id?: string }
) => {
  const { data, error } = await client
    .from(SERVICES_TABLE)
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new Error(`No se pudo guardar el servicio: ${error.message}`);
  }

  return data as UtilityService;
};
