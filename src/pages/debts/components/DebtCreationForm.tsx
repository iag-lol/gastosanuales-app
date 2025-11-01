import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { useCreateDebt } from "@/hooks/useDebtsData";

const debtSchema = z
  .object({
    name: z.string().min(3, "Pon un nombre descriptivo"),
    description: z.string().optional(),
    amount: z.coerce
      .number({
        invalid_type_error: "Ingresa un monto válido"
      })
      .int("Solo números enteros")
      .min(1, "Ingresa un monto válido"),
    category: z.string().optional(),
    frequency: z.enum(["monthly", "biweekly", "custom"]),
    due_day_type: z.enum(["end_of_month", "quincena", "custom"]),
    custom_due_day: z.coerce.number().optional(),
    start_date: z.string().min(1, "Selecciona una fecha de inicio"),
    end_date: z.string().optional(),
    total_installments: z.coerce.number().optional(),
    alert_threshold_days: z.coerce.number().min(1).max(30),
    autopay: z.coerce.boolean().optional(),
    tags: z.string().optional(),
    household_member: z.string().optional()
  })
  .superRefine((values, ctx) => {
    if (values.due_day_type === "custom" && !values.custom_due_day) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona un día de vencimiento",
        path: ["custom_due_day"]
      });
    }

    if (values.frequency === "custom" && !values.total_installments) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Indica el número de cuotas",
        path: ["total_installments"]
      });
    }
  });

type DebtFormValues = z.infer<typeof debtSchema>;

interface DebtCreationFormProps {
  onCompleted: () => void;
}

export const DebtCreationForm = ({ onCompleted }: DebtCreationFormProps) => {
  const mutation = useCreateDebt();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<DebtFormValues>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      frequency: "monthly",
      due_day_type: "end_of_month",
      start_date: new Date().toISOString().slice(0, 10),
      alert_threshold_days: 5,
      autopay: false
    }
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      reset();
    }
  }, [mutation.isSuccess, reset]);

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(
      {
        name: values.name,
        description: values.description,
        amount: Math.round(values.amount),
        currency: "CLP",
        category: values.category,
        frequency: values.frequency,
        due_day_type: values.due_day_type,
        custom_due_day: values.due_day_type === "custom" ? values.custom_due_day : undefined,
        start_date: values.start_date,
        end_date: values.end_date || undefined,
        total_installments: values.total_installments,
        alert_threshold_days: values.alert_threshold_days,
        autopay: Boolean(values.autopay),
        tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
        household_member: values.household_member
      },
      {
        onSuccess: () => {
          window.dispatchEvent(
            new CustomEvent("toast", { detail: "Deuda creada correctamente" })
          );
          onCompleted();
        }
      }
    );
  });

  const dueDayType = watch("due_day_type");
  const frequency = watch("frequency");

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nombre de la deuda" {...register("name")} error={errors.name?.message} />
        <Input label="Categoría" {...register("category")} placeholder="Renta, servicios, etc." />
        <Input
          label="Monto"
          type="number"
          inputMode="numeric"
          step="1"
          {...register("amount", { valueAsNumber: true })}
          error={errors.amount?.message}
          hint="Ingresa el monto en pesos chilenos, sin decimales"
        />
        <Input
          label="Fecha de inicio"
          type="date"
          {...register("start_date")}
          error={errors.start_date?.message}
        />
        <Input label="Fecha de término (opcional)" type="date" {...register("end_date")} />
      </div>

      <Input
        label="Descripción"
        {...register("description")}
        hint="Describe el objetivo, institución o alguna nota importante."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Frecuencia de pago"
          options={[
            { value: "monthly", label: "Mensual" },
            { value: "biweekly", label: "Quincenal" },
            { value: "custom", label: "Personalizada" }
          ]}
          {...register("frequency")}
        />
        <Select
          label="Fecha de vencimiento"
          options={[
            { value: "end_of_month", label: "Fin de mes" },
            { value: "quincena", label: "Quincena" },
            { value: "custom", label: "Día específico" }
          ]}
          {...register("due_day_type")}
        />
      </div>

      {dueDayType === "custom" && (
        <Input
          label="Día de vencimiento"
          type="number"
          min={1}
          max={31}
          {...register("custom_due_day", { valueAsNumber: true })}
          error={errors.custom_due_day?.message}
        />
      )}

      {frequency === "custom" && (
        <Input
          label="Cantidad de cuotas"
          type="number"
          {...register("total_installments", { valueAsNumber: true })}
          error={errors.total_installments?.message}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Anticipación de alerta (días)"
          type="number"
          {...register("alert_threshold_days", { valueAsNumber: true })}
          error={errors.alert_threshold_days?.message}
        />
        <Input
          label="Miembro del hogar (opcional)"
          placeholder="¿Quién es responsable?"
          {...register("household_member")}
        />
      </div>

      <Input
        label="Etiquetas"
        placeholder="Ej. hogar, educación, tarjeta"
        hint="Separa con coma para agregar múltiples etiquetas."
        {...register("tags")}
      />

      <Switch label="Cargo automático" {...register("autopay")} />

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <Button type="submit" loading={mutation.isPending}>
          Guardar deuda
        </Button>
      </div>
    </form>
  );
};
