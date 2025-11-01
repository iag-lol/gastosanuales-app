import { Leaf, Droplets, Gauge, Zap } from "lucide-react";

import { Card } from "@/components/ui/Card";

const tips = [
  {
    icon: Droplets,
    title: "Optimiza el consumo de agua",
    description:
      "Agenda inspecciones trimestrales y detecta fugas con el promedio inteligente. Alerta si supera el +15% sobre tu meta."
  },
  {
    icon: Zap,
    title: "Aprovecha horario valle",
    description:
      "Sincroniza lavadora y cargas de autos eléctricos en tramos de menor tarifa. Programa recordatorios automáticos."
  },
  {
    icon: Gauge,
    title: "Control del gas",
    description:
      "Registra cilindros y consumo en m³ para proyectar recargas. El sistema sugiere compra cuando queden 5 días."
  },
  {
    icon: Leaf,
    title: "Internet inteligente",
    description:
      "Compara tu velocidad contratada con el gasto promedio y renegocia el plan si superas el 30% del presupuesto."
  }
];

export const UtilityEfficiencyTips = () => (
  <Card padding="lg">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-900">Acciones recomendadas</h3>
      <p className="text-sm text-slate-500">
        Generamos ideas automáticas según tu patrón de consumo para reducir costos y anticipar
        picos. Personaliza cada recomendación desde supabase o exporta para tu equipo.
      </p>
    </div>
    <div className="grid gap-3 md:grid-cols-2">
      {tips.map((tip) => (
        <div
          key={tip.title}
          className="flex gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-4 shadow-sm"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <tip.icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">{tip.title}</p>
            <p className="text-xs text-slate-500">{tip.description}</p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);
