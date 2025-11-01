import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/dates";

interface SummaryBreakdownProps {
  data: { category: string; amount: number; count: number }[];
  loading?: boolean;
}

export const SummaryBreakdown = ({ data, loading }: SummaryBreakdownProps) => (
  <Card padding="lg">
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-slate-900">Detalle consolidado</h3>
      <p className="text-sm text-slate-500">
        Exporta estos datos a CSV para compartirlos en tus controles financieros.
      </p>
    </div>
    {loading ? (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    ) : data.length === 0 ? (
      <p className="text-sm text-slate-500">
        No hay datos para mostrar. Registra tus deudas y vuelve a consultar.
      </p>
    ) : (
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Compromisos</th>
              <th className="px-4 py-3">Monto total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((item) => (
              <tr key={item.category} className="text-slate-600">
                <td className="px-4 py-3 font-semibold text-slate-900">{item.category}</td>
                <td className="px-4 py-3">{item.count}</td>
                <td className="px-4 py-3 text-primary-600">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Card>
);
