import { Check, ExternalLink, Pause } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useUpdateDebtStatus } from "@/hooks/useDebtsData";
import type { Debt } from "@/types/debt";
import { evaluateDebtHealth, formatCurrency, formatFullDate } from "@/utils/dates";
import { cn } from "@/utils/cn";

interface DebtCollectionProps {
  debts: Debt[];
  loading?: boolean;
  onSelect: (id: string) => void;
}

export const DebtCollection = ({ debts, loading, onSelect }: DebtCollectionProps) => {
  const updateStatus = useUpdateDebtStatus();

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  if (!loading && debts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white/60 p-12 text-center text-sm text-slate-500">
        <ExternalLink className="h-8 w-8 text-primary-500" />
        <p>No hay deudas registradas. Crea la primera para comenzar a medir.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {debts.map((debt) => {
        const health = evaluateDebtHealth(debt);

        return (
          <article
            key={debt.id}
            className={cn(
              "flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-subtle transition hover:border-primary-200 hover:bg-primary-50/50",
              health.risk === "critical" && "border-rose-200",
              health.risk === "attention" && "border-amber-200"
            )}
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {debt.category ?? "Sin categoría"}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{debt.name}</h3>
              </div>
              <button
                className="inline-flex h-9 items-center justify-center rounded-2xl bg-slate-100 px-3 text-xs font-semibold text-slate-500 transition hover:bg-primary-100 hover:text-primary-600"
                onClick={() => onSelect(debt.id)}
              >
                Detalles
              </button>
            </header>
            <div>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(debt.amount)}</p>
              <p className="text-xs text-slate-500">
                Próximo pago:{" "}
                {formatFullDate(
                  (debt.next_due_date ?? health.nextDueDate.toISOString()) || debt.start_date
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest">
              <span
                className={cn(
                  "rounded-full px-3 py-1",
                  debt.status === "paid"
                    ? "bg-emerald-50 text-emerald-600"
                    : debt.status === "overdue"
                    ? "bg-rose-50 text-rose-600"
                    : debt.status === "postponed"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-primary-50 text-primary-600"
                )}
              >
                {debt.status.toUpperCase()}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-500">
                {debt.frequency === "biweekly" ? "Quincenal" : "Mensual"}
              </span>
              {debt.autopay && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
                  Cargo automático
                </span>
              )}
            </div>
            <footer className="mt-auto flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  updateStatus.mutate(
                    { debtId: debt.id, status: "postponed" },
                    {
                      onSuccess: () => {
                        window.dispatchEvent(new CustomEvent("toast", { detail: "Deuda postergada" }));
                      }
                    }
                  )
                }
                loading={updateStatus.isPending}
              >
                <Pause className="h-4 w-4" />
                Postergar
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() =>
                  updateStatus.mutate(
                    { debtId: debt.id, status: "paid" },
                    {
                      onSuccess: () =>
                        window.dispatchEvent(new CustomEvent("toast", { detail: "Pago registrado" }))
                    }
                  )
                }
                loading={updateStatus.isPending}
              >
                <Check className="h-4 w-4" />
                Marcar pagada
              </Button>
            </footer>
          </article>
        );
      })}
    </div>
  );
};
