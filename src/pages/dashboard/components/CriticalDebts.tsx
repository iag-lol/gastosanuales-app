import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Debt } from "@/types/debt";
import { evaluateDebtHealth, formatCurrency, formatFullDate } from "@/utils/dates";

interface CriticalDebtsProps {
  debts: Debt[];
  loading?: boolean;
}

const RiskIcon = ({ risk }: { risk: ReturnType<typeof evaluateDebtHealth>["risk"] }) => {
  if (risk === "critical") {
    return <AlertTriangle className="h-6 w-6 text-rose-500" />;
  }
  if (risk === "attention") {
    return <Clock className="h-6 w-6 text-amber-500" />;
  }
  return <CheckCircle2 className="h-6 w-6 text-emerald-500" />;
};

export const CriticalDebts = ({ debts, loading }: CriticalDebtsProps) => {
  const ranked = debts
    .map((debt) => ({
      debt,
      health: evaluateDebtHealth(debt)
    }))
    .filter((item) => item.health.risk !== "ok")
    .sort((a, b) => a.health.daysToDue - b.health.daysToDue)
    .slice(0, 4);

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Alertas inteligentes</h3>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Prioridad
        </span>
      </div>

      {loading ? (
        <div className="mt-6 flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : ranked.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">
          No hay riesgos detectados. Tus compromisos financieros están bajo control.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {ranked.map(({ debt, health }) => (
            <li
              key={debt.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-5 py-4 shadow-sm transition hover:border-primary-200 hover:bg-primary-50/60"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary-50">
                  <RiskIcon risk={health.risk} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{debt.name}</p>
                  <p className="text-xs text-slate-500">
                    {formatCurrency(debt.amount, debt.currency)} · Vence{" "}
                    {formatFullDate(health.nextDueDate.toISOString())}
                  </p>
                </div>
              </div>
              <span className="rounded-xl bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500">
                {health.daysToDue <= 0 ? "Atrasada" : `Faltan ${health.daysToDue} días`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
