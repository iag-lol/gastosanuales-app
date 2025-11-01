import { useState } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { useSupabase } from "@/context/SupabaseProvider";

export const SettingsPage = () => {
  const { envMissing } = useSupabase();
  const [notifyOverdue, setNotifyOverdue] = useState(true);
  const [notifyUpcoming, setNotifyUpcoming] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-subtle">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600">
          Centro de configuraciones
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Preferencias del sistema</h2>
        <p className="mt-1 text-sm text-slate-500">
          Ajusta la conexión con Supabase, define cómo quieres recibir alertas y exporta respaldos
          inteligentes.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <Card padding="lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Conexión con Supabase</h3>
            <p className="text-sm text-slate-500">
              Utiliza un proyecto de Supabase y crea las tablas con el prefijo
              <span className="font-semibold text-primary-600"> gastosanuales_</span> para que el
              sistema pueda sincronizar tus datos.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="VITE_SUPABASE_URL"
              placeholder="https://xxxx.supabase.co"
              defaultValue={envMissing ? "" : "Configurada"}
              readOnly={!envMissing}
            />
            <Input
              label="VITE_SUPABASE_ANON_KEY"
              type="password"
              placeholder="Coloca la clave pública"
              defaultValue={envMissing ? "" : "••••••••••"}
              readOnly={!envMissing}
            />
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Crea las tablas <code>gastosanuales_deudas</code>, <code>gastosanuales_pagos</code> y
            <code> gastosanuales_recordatorios</code> siguiendo el esquema recomendado en la
            documentación adjunta.
          </p>
        </Card>

        <Card padding="lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Alertas inteligentes</h3>
            <p className="text-sm text-slate-500">
              Define cuándo quieres recibir recordatorios para mantenerte al corriente.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Switch
              label="Avisarme cuando una deuda esté cercana a vencer"
              checked={notifyUpcoming}
              onChange={(event) => setNotifyUpcoming(event.currentTarget.checked)}
            />
            <Switch
              label="Alertas urgentes cuando una deuda esté en mora"
              checked={notifyOverdue}
              onChange={(event) => setNotifyOverdue(event.currentTarget.checked)}
            />
            <Switch
              label="Resumen diario con el estado general"
              checked={dailyDigest}
              onChange={(event) => setDailyDigest(event.currentTarget.checked)}
            />
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Respaldo y exportación</h3>
            <p className="text-sm text-slate-500">
              Genera un respaldo completo en formato CSV/JSON para analizar tus datos en otros
              sistemas.
            </p>
          </div>
          <Button variant="secondary" size="md" onClick={() => window.dispatchEvent(new CustomEvent("toast", { detail: "Descarga iniciada" }))}>
            <Download className="h-4 w-4" />
            Exportar datos
          </Button>
        </div>
      </Card>
    </div>
  );
};
