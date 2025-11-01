import { useCallback } from "react";
import { Filter, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { useDebtsContext } from "@/context/DebtsProvider";
import { DEBT_STATUSES } from "@/utils/constants";
import { cn } from "@/utils/cn";

export const DebtFiltersBar = () => {
  const { filters, setFilters } = useDebtsContext();

  const toggleStatus = useCallback(
    (status: string) => {
      const exists = filters.statuses.includes(status);
      setFilters({
        ...filters,
        statuses: exists
          ? filters.statuses.filter((item) => item !== status)
          : [...filters.statuses, status]
      });
    },
    [filters, setFilters]
  );

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-subtle">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          label="Buscar"
          placeholder="Buscar por nombre, descripción o etiqueta"
          value={filters.search}
          onChange={(event) =>
            setFilters({
              ...filters,
              search: event.currentTarget.value
            })
          }
        />
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Filter className="h-4 w-4" />
          Filtros avanzados
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          <SlidersHorizontal className="h-4 w-4" />
          Estado
        </span>
        {DEBT_STATUSES.map((status) => {
          const isActive = filters.statuses.includes(status.value);
          return (
            <button
              key={status.value}
              onClick={() => toggleStatus(status.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition",
                isActive
                  ? "border-primary-400 bg-primary-50 text-primary-600 shadow-sm"
                  : "border-slate-200 bg-white text-slate-500 hover:border-primary-200 hover:text-primary-600"
              )}
            >
              {status.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
