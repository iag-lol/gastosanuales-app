import { TrendingUp, TrendingDown, Target } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/dates";
import type { UtilityInsight } from "@/types/utilities";
import { UTILITY_KIND_LABELS } from "@/utils/utilities";

interface UtilityServiceCardsProps {
  insights: UtilityInsight[];
}

const VariationBadge = ({ value }: { value: number }) => {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
        <Target className="h-4 w-4" /> 0%
      </span>
    );
  }

  const positive = value > 0;
  const Icon = positive ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
        positive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
      <Icon className="h-4 w-4" />
      {`${positive ? "+" : "-"}${Math.abs(value).toFixed(1)}%`}
    </span>
  );
};

export const UtilityServiceCards = ({ insights }: UtilityServiceCardsProps) => {
  if (insights.length === 0) {
    return (
      <Card padding="lg" className="text-sm text-slate-500">
        Aún no has creado servicios variables. Activa el monitoreo inteligente para comenzar a
        registrar agua, luz, gas e internet y visualizar la tendencia mes a mes.
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {insights.map(({ service, currentAmount, variation, averageUnits }) => (
        <Card
          key={service.id}
          padding="lg"
          className="relative overflow-hidden"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(circle at top right, ${service.color || "#3b82f6"} 0%, transparent 55%)`
            }}
          />
          <div className="relative flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {UTILITY_KIND_LABELS[service.kind]}
              </p>
              <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Este mes</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {formatCurrency(currentAmount)}
                </p>
                <p className="text-xs text-slate-500">
                  Objetivo: {formatCurrency(Number(service.goal_monthly_budget ?? 0))}
                </p>
              </div>
              <VariationBadge value={variation} />
            </div>
            <div className="rounded-2xl bg-primary-50/40 px-4 py-3 text-xs text-slate-500">
              <span className="font-semibold text-primary-600">{averageUnits}</span> {service.unit ?? "unidad"} en
              promedio. Tarifa de referencia {formatCurrency(Number(service.rate_per_unit ?? 0))} por
              {(service.unit ?? "unidad").toLowerCase()}.
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
