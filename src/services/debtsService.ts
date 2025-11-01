import type { SupabaseClient } from "@supabase/supabase-js";
import type { Debt, DebtInput } from "@/types/debt";
import type { Payment, PaymentInput } from "@/types/payment";
import type { DebtNotification } from "@/types/notification";

const DEBTS_TABLE = "gastosanuales_deudas";
const PAYMENTS_TABLE = "gastosanuales_pagos";
const NOTIFICATIONS_TABLE = "gastosanuales_recordatorios";

export interface DebtFilters {
  statuses?: string[];
  search?: string;
  category?: string | null;
  householdMember?: string | null;
  onlyCritical?: boolean;
}

export const fetchDebts = async (client: SupabaseClient, filters?: DebtFilters) => {
  let query = client.from(DEBTS_TABLE).select("*").order("start_date", { ascending: false });

  if (filters?.statuses?.length) {
    query = query.in("status", filters.statuses);
  }

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.householdMember) {
    query = query.eq("household_member", filters.householdMember);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`No fue posible cargar las deudas: ${error.message}`);
  }

  return (data || []) as Debt[];
};

export const createDebt = async (client: SupabaseClient, payload: DebtInput) => {
  const { data, error } = await client
    .from(DEBTS_TABLE)
    .insert({
      ...payload,
      paid_installments: 0,
      status: "pending"
    })
    .select()
    .single();

  if (error) {
    throw new Error(`No se pudo crear la deuda: ${error.message}`);
  }

  return data as Debt;
};

export const updateDebtStatus = async (
  client: SupabaseClient,
  debtId: string,
  status: Debt["status"]
) => {
  const { data, error } = await client
    .from(DEBTS_TABLE)
    .update({ status })
    .eq("id", debtId)
    .select()
    .single();

  if (error) {
    throw new Error(`No se pudo actualizar el estado: ${error.message}`);
  }

  return data as Debt;
};

export const postponeDebt = async (
  client: SupabaseClient,
  debtId: string,
  nextDueDateISO: string
) => {
  const { data, error } = await client
    .from(DEBTS_TABLE)
    .update({ next_due_date: nextDueDateISO, status: "postponed" })
    .eq("id", debtId)
    .select()
    .single();

  if (error) {
    throw new Error(`No se pudo postergar la deuda: ${error.message}`);
  }

  return data as Debt;
};

export const recordPayment = async (client: SupabaseClient, payload: PaymentInput) => {
  const { data, error } = await client.from(PAYMENTS_TABLE).insert(payload).select().single();

  if (error) {
    throw new Error(`No se pudo registrar el pago: ${error.message}`);
  }

  await client.rpc("gastosanuales_increment_instalment", {
    debt_identifier: payload.debt_id
  });

  return data as Payment;
};

export const fetchPaymentsForDebt = async (client: SupabaseClient, debtId: string) => {
  const { data, error } = await client
    .from(PAYMENTS_TABLE)
    .select("*")
    .eq("debt_id", debtId)
    .order("scheduled_for", { ascending: false });

  if (error) {
    throw new Error(`No se pudieron cargar los pagos: ${error.message}`);
  }

  return (data || []) as Payment[];
};

export const fetchNotifications = async (client: SupabaseClient) => {
  const { data, error } = await client
    .from(NOTIFICATIONS_TABLE)
    .select("*")
    .gte("fire_at", new Date().toISOString())
    .lte("fire_at", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
    .order("fire_at", { ascending: true });

  if (error) {
    throw new Error(`No se pudieron cargar los recordatorios: ${error.message}`);
  }

  return (data || []) as DebtNotification[];
};

export const fetchUpcomingPayments = async (client: SupabaseClient, limit = 10) => {
  const { data, error } = await client
    .from(PAYMENTS_TABLE)
    .select("*")
    .gte("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`No se pudieron cargar los pagos programados: ${error.message}`);
  }

  return (data || []) as Payment[];
};

export const subscribeToDebtChanges = (
  client: SupabaseClient,
  onChange: () => void
) => {
  const channel = client
    .channel("deudas-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: DEBTS_TABLE }, onChange)
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
};
