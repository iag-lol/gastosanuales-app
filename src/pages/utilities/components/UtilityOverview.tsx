import { ReactNode } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/dates";

interface UtilityOverviewProps {
  totalCurrent: number;
  variation: number;
  onBootstrap?: () => Promise<void>;
  isBootstrapping?: boolean;
  hasServices: boolean;
  children?: ReactNode;
}

export const UtilityOverview = ({
  totalCurrent,
  variation,
  onBootstrap,
  isBootstrapping = false,
  hasServices,
  children
}: UtilityOverviewProps) => {
  const variationLabel =
    variation > 0
      ? `↑ ${variation.toFixed(1)}%`
      : variation < 0
      ? `↓ ${Math.abs(variation).toFixed(1)}%`
      : "Sin variación";

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-500 text-white shadow-[0_40px_80px_-40px_rgba(37,99,235,0.6)]">
      <div className="grid gap-6 p-8 lg:grid-cols-[1.3fr,1fr] lg:items-center">
        <div className="flex flex-col gap-5">
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em]">
            <Sparkles className="h-4 w-4" /> Energía inteligente
          </span>
          <h2 className="text-3xl font-semibold leading-tight lg:text-4xl">
            Tus servicios variables bajo control total
          </h2>
          <p className="text-sm text-white/80 lg:text-base">
            Visualiza el gasto consolidado de agua, luz, gas e internet y compara el comportamiento
            mensual. Automatiza tus metas y anticipa desvíos con alertas predictivas.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Gasto del mes</p>
              <p className="text-4xl font-bold">{formatCurrency(totalCurrent)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Variación</p>
              <p className="text-lg font-semibold">{variationLabel}</p>
            </div>
          </div>
          {!hasServices && onBootstrap && (
            <Button
              variant="secondary"
              size="md"
              onClick={onBootstrap}
              loading={isBootstrapping}
              className="bg-white text-primary-600 hover:bg-white/90"
            >
              <RefreshCw className="h-4 w-4" />
              Activar monitoreo inteligente
            </Button>
          )}
        </div>
        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
          {children}
        </div>
      </div>
    </section>
  );
};
