import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, endOfMonth, formatISO } from "date-fns";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { formatCurrency } from "@/utils/dates";
import type { UtilityService } from "@/types/utilities";

const measurementSchema = z.object({
  service_id: z.string().min(1, "Selecciona un servicio"),
  period_start: z.string().min(1, "Fecha inicial obligatoria"),
  period_end: z.string().min(1, "Fecha final obligatoria"),
  units_used: z.coerce.number().nonnegative("Ingresa un valor igual o mayor a 0"),
  status: z.enum(["estimated", "confirmed"]),
  notes: z.string().optional(),
  autopredict: z.boolean().optional(),
  manual_amount: z.coerce.number().optional()
});

type MeasurementFormValues = z.infer<typeof measurementSchema>;

interface UtilityMeasurementFormProps {
  services: UtilityService[];
  onSubmit: (payload: MeasurementFormValues & { amount: number }) => void;
  loading?: boolean;
}

const statusOptions = [
  { value: "estimated", label: "Estimado" },
  { value: "confirmed", label: "Confirmado" }
];

export const UtilityMeasurementForm = ({ services, onSubmit, loading }: UtilityMeasurementFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm<MeasurementFormValues>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      service_id: services[0]?.id ?? "",
      period_start: formatISO(addDays(new Date(), -7), { representation: "date" }),
      period_end: formatISO(endOfMonth(new Date()), { representation: "date" }),
      units_used: 0,
      status: "estimated",
      autopredict: true,
      manual_amount: 0
    }
  });

  useEffect(() => {
    register("autopredict");
  }, [register]);

  useEffect(() => {
    if (services.length > 0) {
      reset((current) => ({
        ...current,
        service_id: current.service_id || services[0].id
      }));
    }
  }, [services, reset]);

  const selectedService = services.find((service) => service.id === watch("service_id"));
  const units = watch("units_used");
  const autoPredict = watch("autopredict");

  const projectedAmount = Math.round(units * Number(selectedService?.rate_per_unit ?? 0));

  const submit = handleSubmit((values) => {
    const service = services.find((item) => item.id === values.service_id);
    const rate = Number(service?.rate_per_unit ?? 0);
    const amount = values.autopredict
      ? Math.round(values.units_used * rate)
      : Math.round(Number(values.manual_amount ?? 0));
    onSubmit({ ...values, amount });
  });

  if (services.length === 0) {
    return null;
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Servicio"
          options={services.map((service) => ({ value: service.id, label: service.name }))}
          {...register("service_id")}
          error={errors.service_id?.message}
        />
        <Select
          label="Estado"
          options={statusOptions}
          {...register("status")}
          error={errors.status?.message}
        />
        <Input
          label="Fecha inicio"
          type="date"
          {...register("period_start")}
          error={errors.period_start?.message}
        />
        <Input
          label="Fecha término"
          type="date"
          {...register("period_end")}
          error={errors.period_end?.message}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label={`Consumo (${selectedService?.unit ?? "unidad"})`}
          type="number"
          step="0.01"
          inputMode="decimal"
          {...register("units_used", { valueAsNumber: true })}
          error={errors.units_used?.message}
        />
        <div className="rounded-2xl border border-primary-100 bg-primary-50/60 px-4 py-3 text-sm text-primary-700">
          {autoPredict ? (
            <p>
              Proyección automática: <strong>{formatCurrency(projectedAmount)}</strong> según tarifa
              de {formatCurrency(Number(selectedService?.rate_per_unit ?? 0))}/{
                selectedService?.unit?.toLowerCase() ?? "unidad"
              }.
            </p>
          ) : (
            <Input
              label="Total facturado"
              type="number"
              step="100"
              inputMode="numeric"
              {...register("manual_amount", { valueAsNumber: true })}
              error={errors.manual_amount?.message}
              hint="Ingresa el monto final en pesos chilenos"
            />
          )}
        </div>
      </div>

      <Input
        label="Notas (opcional)"
        placeholder="Ej. Ajuste por mantención, tarifa invernal, promoción"
        {...register("notes")}
      />

      <Switch
        label="Calcular monto automáticamente con la tarifa de referencia"
        checked={autoPredict}
        onChange={(event) => {
          const checked = event.currentTarget.checked;
          setValue("autopredict", checked, { shouldDirty: true });
        }}
      />

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <Button type="submit" loading={loading}>
          Registrar medición (
          {autoPredict
            ? formatCurrency(projectedAmount)
            : formatCurrency(Number(watch("manual_amount") ?? 0))}
          )
        </Button>
      </div>
    </form>
  );
};
