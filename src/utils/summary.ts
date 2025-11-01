import { differenceInMonths, parseISO } from "date-fns";

import type { Debt, DebtSummary } from "@/types/debt";
import { computeNextDueDate } from "./dates";

export const computeDebtSummary = (debts: Debt[]): DebtSummary => {
  const summary = debts.reduce(
    (acc, debt) => {
      const amount = typeof debt.amount === "string" ? parseFloat(debt.amount) : debt.amount;

      acc.total_amount += amount;

      if (debt.status === "paid") {
        acc.total_paid += amount;
      }
      if (debt.status === "pending" || debt.status === "postponed") {
        acc.total_pending += amount;
      }
      if (debt.status === "overdue") {
        acc.total_overdue += amount;
      }

      const nextDue = debt.next_due_date
        ? parseISO(debt.next_due_date)
        : computeNextDueDate(debt);

      if (!acc.next_due_date || nextDue < parseISO(acc.next_due_date)) {
        acc.next_due_date = nextDue.toISOString();
        acc.next_due_amount = amount;
      }

      const months = Math.max(
        1,
        differenceInMonths(
          debt.end_date ? parseISO(debt.end_date) : new Date(),
          parseISO(debt.start_date)
        )
      );

      acc.monthly_projection += debt.frequency === "biweekly" ? amount / 2 : amount;
      acc.biweekly_projection += debt.frequency === "biweekly" ? amount : Math.round(amount / 2);

      acc.installments += debt.total_installments ?? months;
      acc.installmentsPaid += debt.paid_installments;

      return acc;
    },
    {
      total_amount: 0,
      total_pending: 0,
      total_overdue: 0,
      total_paid: 0,
      monthly_projection: 0,
      biweekly_projection: 0,
      next_due_date: undefined as string | undefined,
      next_due_amount: undefined as number | undefined,
      installments: 0,
      installmentsPaid: 0
    }
  );

  return summary;
};
