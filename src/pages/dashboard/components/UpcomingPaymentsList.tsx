import { CalendarDays, ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Payment } from "@/types/payment";
import { formatCurrency, formatFullDate } from "@/utils/dates";

interface UpcomingPaymentsListProps {
  payments: Payment[];
  loading?: boolean;
}

export const UpcomingPaymentsList = ({ payments, loading }: UpcomingPaymentsListProps) => (
  <Card className="h-full" padding="lg">
    <div className="mb-6 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-900">Pagos programados</h3>
      <span className="flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-600">
        <CalendarDays className="h-4 w-4" />
        Semana
      </span>
    </div>
    {loading ? (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    ) : payments.length === 0 ? (
      <div className="flex h-48 flex-col items-center justify-center gap-2 text-center text-sm text-slate-500">
        <CalendarDays className="h-10 w-10 text-primary-500" />
        No hay pagos programados para esta semana.
      </div>
    ) : (
      <ul className="flex flex-col gap-3">
        {payments.map((payment) => (
          <li
            key={payment.id}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm transition hover:border-primary-200 hover:bg-primary-50/60"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {formatCurrency(payment.amount, "MXN")}
              </p>
              <p className="text-xs text-slate-500">
                {formatFullDate(payment.scheduled_for)} · {payment.status === "postponed" ? "Postergado" : "Programado"}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300" />
          </li>
        ))}
      </ul>
    )}
  </Card>
);
