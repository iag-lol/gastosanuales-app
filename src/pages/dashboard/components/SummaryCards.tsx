import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { DebtSummary } from "@/types/debt";
import { formatCurrency, formatFullDate } from "@/utils/dates";

interface SummaryCardsProps {
  summary?: DebtSummary;
  loading?: boolean;
}

const SummaryItemSkeleton = () => (
  <Card padding="lg">
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-24 rounded-lg" />
      <Skeleton className="h-7 w-32 rounded-lg" />
      <Skeleton className="h-3 w-full rounded-lg" />
    </div>
  </Card>
);

export const SummaryCards = ({ summary, loading }: SummaryCardsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SummaryItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const projectionDate = summary.next_due_date ? formatFullDate(summary.next_due_date) : null;
  const progress =
    summary.installments && summary.installmentsPaid
      ? Math.min(100, Math.round((summary.installmentsPaid / summary.installments) * 100))
      : null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card padding="lg">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-500">
            Total de deudas
          </span>
          <p className="text-3xl font-bold text-slate-900">
            {formatCurrency(summary.total_amount, "MXN")}
          </p>
          <p className="text-sm text-slate-500">
            {formatCurrency(summary.total_pending + summary.total_overdue, "MXN")} por pagar
          </p>
        </div>
      </Card>

      <Card padding="lg">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-500">
            Deudas pendientes
          </span>
          <p className="text-3xl font-bold text-amber-600">
            {formatCurrency(summary.total_pending, "MXN")}
          </p>
          <p className="text-sm text-slate-500">
            {formatCurrency(summary.total_overdue, "MXN")} en mora
          </p>
        </div>
      </Card>

      <Card padding="lg">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-500">
            Proyección mensual
          </span>
          <p className="text-3xl font-bold text-primary-600">
            {formatCurrency(summary.monthly_projection, "MXN")}
          </p>
          <p className="text-sm text-slate-500">
            {formatCurrency(summary.biweekly_projection, "MXN")} cada quincena
          </p>
        </div>
      </Card>

      <Card padding="lg">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-500">
            Próximo vencimiento
          </span>
          <p className="text-3xl font-bold text-slate-900">
            {summary.next_due_amount
              ? formatCurrency(summary.next_due_amount, "MXN")
              : "Sin datos"}
          </p>
          <p className="text-sm text-slate-500">
            {projectionDate ? `Fecha: ${projectionDate}` : "Crea una deuda para comenzar"}
          </p>
          {progress !== null && (
            <div>
              <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Avance general</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-primary-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
