import { useMemo } from "react";

import { useDebtsList } from "@/hooks/useDebtsData";
import { CategoryDistribution } from "@/pages/reports/components/CategoryDistribution";
import { TrendChart } from "@/pages/reports/components/TrendChart";
import { SummaryBreakdown } from "@/pages/reports/components/SummaryBreakdown";
import { groupDebtsByCategory, buildTrendSeries } from "@/utils/analytics";

export const ReportsPage = () => {
  const { data: debts, isLoading } = useDebtsList();

  const categoryData = useMemo(() => groupDebtsByCategory(debts ?? []), [debts]);
  const trendData = useMemo(() => buildTrendSeries(debts ?? []), [debts]);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-subtle">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600">
          Inteligencia financiera
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Informes dinámicos</h2>
        <p className="mt-1 text-sm text-slate-500">
          Analiza el peso de cada deuda, identifica categorías críticas y mide el desempeño mensual
          de tus pagos.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <CategoryDistribution data={categoryData} loading={isLoading} />
        <TrendChart data={trendData} loading={isLoading} />
      </div>

      <SummaryBreakdown data={categoryData} loading={isLoading} />
    </div>
  );
};
