import { addDays, addMonths, differenceInDays, format, isBefore, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import type { Debt, DueDayType } from "@/types/debt";

export const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  }).format(amount);

export const formatShortDate = (iso: string) => format(parseISO(iso), "dd MMM", { locale: es });

export const formatFullDate = (iso: string) =>
  format(parseISO(iso), "dd 'de' MMMM yyyy", { locale: es });

export const computeNextDueDate = (debt: Debt, fromDate = new Date()): Date => {
  const base = debt.start_date ? parseISO(debt.start_date) : fromDate;
  const reference = isBefore(base, fromDate) ? fromDate : base;

  switch (debt.due_day_type as DueDayType) {
    case "end_of_month": {
      const next = addMonths(new Date(reference.getFullYear(), reference.getMonth(), 1), 1);
      return addDays(next, -1);
    }
    case "quincena": {
      const day = reference.getDate() <= 15 ? 15 : 30;
      return new Date(reference.getFullYear(), reference.getMonth(), day);
    }
    case "custom": {
      const day = debt.custom_due_day ?? reference.getDate();
      const candidate = new Date(reference.getFullYear(), reference.getMonth(), day);
      if (isBefore(candidate, reference)) {
        return new Date(reference.getFullYear(), reference.getMonth() + 1, day);
      }
      return candidate;
    }
    default:
      return reference;
  }
};

export const evaluateDebtHealth = (debt: Debt) => {
  const nextDueDate = computeNextDueDate(debt);
  const daysToDue = differenceInDays(nextDueDate, new Date());
  const risk =
    debt.status === "overdue"
      ? "critical"
      : daysToDue <= 0
      ? "warning"
      : daysToDue <= debt.alert_threshold_days
      ? "attention"
      : "ok";

  return {
    nextDueDate,
    daysToDue,
    risk
  } as const;
};
