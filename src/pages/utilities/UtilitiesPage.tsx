import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/dates";
import { DEFAULT_UTILITY_SERVICES } from "@/utils/utilities";
import {
  useCreateUtilityMeasurement,
  useUpsertUtilityService,
  useUtilityInsights,
  useUtilityMeasurements
} from "@/hooks/useUtilitiesData";
import { UtilityOverview } from "@/pages/utilities/components/UtilityOverview";
import { UtilityServiceCards } from "@/pages/utilities/components/UtilityServiceCards";
import { UtilityTrendChart } from "@/pages/utilities/components/UtilityTrendChart";
import { UtilityMeasurementForm } from "@/pages/utilities/components/UtilityMeasurementForm";
import { UtilityEfficiencyTips } from "@/pages/utilities/components/UtilityEfficiencyTips";

export const UtilitiesPage = () => {
  const [bootstrapping, setBootstrapping] = useState(false);
  const { insights, summary, services } = useUtilityInsights();
  const { data: measurementHistory } = useUtilityMeasurements({ limit: 120 });
  const createMeasurement = useCreateUtilityMeasurement();
  const upsertService = useUpsertUtilityService();

  const hasServices = (services.data?.length ?? 0) > 0;

  const chartData = useMemo(() => {
    if (!measurementHistory || !services.data?.length) {
      return [] as Array<{ label: string; total: number; [key: string]: string | number }>;
    }

    const monthMap = new Map<string, { label: string; total: number; [key: string]: number }>();

    measurementHistory.forEach((measurement) => {
      const date = parseISO(measurement.period_start);
      const key = format(date, "yyyy-MM");
      const label = format(date, "MMM yy", { locale: es });
      const amount = typeof measurement.amount === "string" ? Number.parseFloat(measurement.amount) : measurement.amount;

      if (!monthMap.has(key)) {
        monthMap.set(key, { label, total: 0 });
      }

      const entry = monthMap.get(key)!;
      entry.total += amount;
      entry[measurement.service_id] = (entry[measurement.service_id] || 0) + amount;
    });

    return Array.from(monthMap.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([, value]) => value);
  }, [measurementHistory, services.data]);

  const bootstrapDefaults = async () => {
    if (bootstrapping) return;
    setBootstrapping(true);
    try {
      await Promise.all(
        DEFAULT_UTILITY_SERVICES.map((service) =>
          upsertService.mutateAsync({
            name: service.name,
            kind: service.kind,
            unit: service.unit,
            rate_per_unit: service.rate_per_unit,
            goal_monthly_budget: service.goal_monthly_budget,
            color: service.color,
            auto_estimate: true,
            alert_threshold: 15
          })
        )
      );
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Servicios base creados correctamente" })
      );
    } finally {
      setBootstrapping(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <UtilityOverview
        totalCurrent={summary.totalCurrent}
        variation={summary.variation}
        onBootstrap={hasServices ? undefined : bootstrapDefaults}
        isBootstrapping={bootstrapping || upsertService.isPending}
        hasServices={hasServices}
      >
        <div className="grid gap-4 text-sm text-white/80">
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Mes anterior</p>
            <p className="text-lg font-semibold">{formatCurrency(summary.totalPrevious)}</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Servicios activos</p>
            <p className="text-lg font-semibold">{services.data?.length ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Alertas inteligentes</p>
            <p className="text-lg font-semibold">En desarrollo</p>
          </div>
        </div>
      </UtilityOverview>

      <UtilityServiceCards insights={insights} />

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <UtilityTrendChart data={chartData} services={services.data ?? []} />
        <Card padding="lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Registrar nueva lectura</h3>
            <p className="text-sm text-slate-500">
              Actualiza tu consumo mensual y compara automáticamente contra tus metas. Si tus
              servicios superan el umbral se disparará una alerta preventiva.
            </p>
          </div>
          {hasServices ? (
            <UtilityMeasurementForm
              services={services.data ?? []}
              loading={createMeasurement.isPending}
              onSubmit={(values) => {
                const {
                  service_id,
                  period_start,
                  period_end,
                  units_used,
                  status,
                  notes,
                  amount
                } = values;
                createMeasurement.mutate(
                  {
                    service_id,
                    period_start,
                    period_end,
                    units_used,
                    status,
                    notes,
                    amount
                  },
                  {
                    onSuccess: () => {
                      window.dispatchEvent(
                        new CustomEvent("toast", { detail: "Medición registrada" })
                      );
                    }
                  }
                );
              }}
            />
          ) : (
            <Button onClick={bootstrapDefaults} loading={bootstrapping} variant="secondary">
              Crear servicios base
            </Button>
          )}
        </Card>
      </div>

      <UtilityEfficiencyTips />
    </div>
  );
};
