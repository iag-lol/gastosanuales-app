import { useEffect } from "react";
import { X } from "lucide-react";

import { Skeleton } from "@/components/ui/Skeleton";
import { usePayments } from "@/hooks/useDebtsData";
import type { Debt } from "@/types/debt";
import { evaluateDebtHealth, formatCurrency, formatFullDate } from "@/utils/dates";

interface DebtDetailDrawerProps {
  debt: Debt | null;
  onClose: () => void;
}

export const DebtDetailDrawer = ({ debt, onClose }: DebtDetailDrawerProps) => {
  const { data: payments, isLoading } = usePayments(debt?.id ?? null);

  useEffect(() => {
    if (debt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [debt]);

  if (!debt) {
    return null;
  }

  const health = evaluateDebtHealth(debt);

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-slate-900/20 backdrop-blur">
      <aside className="flex h-full w-full max-w-lg flex-col gap-6 border-l border-slate-200 bg-white p-6 shadow-[0_40px_60px_-15px_rgba(15,23,42,0.3)]">
        <button
          onClick={onClose}
          className="self-end rounded-full border border-slate-200 p-2 text-slate-400 transition hover:text-primary-600 focus-visible:outline focus-visible:outline-primary-600"
        >
          <X className="h-5 w-5" />
        </button>

        <header className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Detalle del compromiso
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">{debt.name}</h2>
          <p className="text-sm text-slate-500">{debt.description}</p>
        </header>

        <section className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Monto</p>
            <p className="text-xl font-semibold text-slate-900">
              {formatCurrency(debt.amount, debt.currency)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Estado</p>
            <p className="text-sm font-semibold text-primary-600">{debt.status.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Próximo pago</p>
            <p className="text-sm text-slate-700">
              {formatFullDate(
                debt.next_due_date
                  ? debt.next_due_date
                  : health.nextDueDate.toISOString()
              )}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Frecuencia</p>
            <p className="text-sm text-slate-700">
              {debt.frequency === "biweekly" ? "Quincenal" : "Mensual"}
            </p>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            Historial de pagos
          </h3>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full rounded-2xl" />
              ))}
            </div>
          ) : payments && payments.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {payments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {formatCurrency(payment.amount, debt.currency)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Programado para {formatFullDate(payment.scheduled_for)}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {payment.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              Aún no has registrado pagos para esta deuda. Usa el botón "Marcar pagada" cuando la
              completes.
            </p>
          )}
        </section>
      </aside>
    </div>
  );
};
