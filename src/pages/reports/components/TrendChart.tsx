import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/dates";

interface TrendChartProps {
  data: { label: string; amount: number }[];
  loading?: boolean;
}

export const TrendChart = ({ data, loading }: TrendChartProps) => (
  <Card padding="lg" className="h-full">
    <div className="mb-6 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-900">Pagos ejecutados</h3>
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        Últimos 6 meses
      </span>
    </div>
    {loading ? (
      <div className="flex h-72 items-center justify-center">
        <Skeleton className="h-72 w-full rounded-3xl" />
      </div>
    ) : data.length === 0 ? (
      <p className="text-sm text-slate-500">
        Aún no existen pagos registrados. Marca deudas como pagadas para visualizar la tendencia.
      </p>
    ) : (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="8 8" stroke="#e2e8f0" opacity={0.7} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#475569" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#475569" }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                borderRadius: "12px",
                borderColor: "#cbd5f5",
                boxShadow: "0 16px 40px rgba(15,23,42,0.18)"
              }}
            />
            <Bar dataKey="amount" radius={[12, 12, 12, 12]} fill="#3c5fff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </Card>
);
