import { useMemo } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useDebtsContext } from "@/context/DebtsProvider";
import { useDebtsList } from "@/hooks/useDebtsData";
import { DebtFiltersBar } from "@/pages/debts/components/DebtFiltersBar";
import { DebtCollection } from "@/pages/debts/components/DebtCollection";
import { DebtCreationForm } from "@/pages/debts/components/DebtCreationForm";
import { DebtDetailDrawer } from "@/pages/debts/components/DebtDetailDrawer";

export const DebtsPage = () => {
  const { data: debts, isLoading } = useDebtsList();
  const { openCreation, closeCreation, isCreationOpen, selectedDebtId, setSelectedDebtId } =
    useDebtsContext();

  const selectedDebt = useMemo(
    () => debts?.find((debt) => debt.id === selectedDebtId),
    [debts, selectedDebtId]
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-subtle md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600">
            Gestión mensual
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Deudas y compromisos</h2>
          <p className="mt-1 text-sm text-slate-500">
            Centraliza tus deudas, programa alertas y visualiza el avance de pago en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md">
            Exportar informe
          </Button>
          <Button onClick={openCreation}>Registrar deuda</Button>
        </div>
      </section>

      <DebtFiltersBar />

      <DebtCollection
        debts={debts ?? []}
        loading={isLoading}
        onSelect={(id) => setSelectedDebtId(id)}
      />

      <DebtDetailDrawer
        debt={selectedDebt ?? null}
        onClose={() => setSelectedDebtId(null)}
      />

      <Modal
        open={isCreationOpen}
        onClose={closeCreation}
        title="Registrar nueva deuda"
        description="Controla cada compromiso desde el inicio. Define montos, fechas y alertas personalizadas."
        size="lg"
      >
        <DebtCreationForm onCompleted={closeCreation} />
      </Modal>
    </div>
  );
};
