import { addMonths, format } from "date-fns";
import { es } from "date-fns/locale";

import type { Debt } from "@/types/debt";

export const groupDebtsByCategory = (debts: Debt[]) => {
  const map = new Map<string, { amount: number; count: number }>();

  debts.forEach((debt) => {
    const key = debt.category || "Sin categoría";
    const record = map.get(key) ?? { amount: 0, count: 0 };
    record.amount += debt.amount;
    record.count += 1;
    map.set(key, record);
  });

  return Array.from(map.entries()).map(([category, info]) => ({
    category,
    amount: Math.round(info.amount * 100) / 100,
    count: info.count
  }));
};

export const buildTrendSeries = (debts: Debt[]) => {
  const months = Array.from({ length: 6 }).map((_, index) => {
    const date = addMonths(new Date(), -index);
    const key = format(date, "yyyy-MM");
    return { key, date, amount: 0 };
  });

  debts.forEach((debt) => {
    months.forEach((month) => {
      if (debt.status === "paid") {
        month.amount += debt.amount;
      } else if (debt.status === "pending" && month.key === format(new Date(), "yyyy-MM")) {
        month.amount += debt.amount / 2;
      }
    });
  });

  return months
    .map((month) => ({
      label: format(month.date, "MMM yy", { locale: es }),
      amount: Math.round(month.amount)
    }))
    .reverse();
};
