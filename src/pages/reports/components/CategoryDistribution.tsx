import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/dates";

const COLORS = ["#1d3df5", "#4f46e5", "#22c55e", "#f97316", "#f43f5e", "#0ea5e9"];

interface CategoryDistributionProps {
  data: { category: string; amount: number; count: number }[];
  loading?: boolean;
}

export const CategoryDistribution = ({ data, loading }: CategoryDistributionProps) => (
  <Card padding="lg" className="h-full">
    <div className="mb-6 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-900">Distribución por categoría</h3>
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        En tiempo real
      </span>
    </div>
    {loading ? (
      <div className="flex h-72 flex-1 items-center justify-center">
        <Skeleton className="h-72 w-72 rounded-full" />
      </div>
    ) : data.length === 0 ? (
      <p className="text-sm text-slate-500">
        Registra deudas para generar el informe por categorías.
      </p>
    ) : (
      <div className="grid gap-6 md:grid-cols-[1.2fr,1fr]">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="amount"
                data={data}
                innerRadius={80}
                outerRadius={120}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value, "MXN")}
                contentStyle={{
                  borderRadius: "12px",
                  borderColor: "#94a3b8",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.08)"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex flex-col gap-3">
          {data.map((item, index) => (
            <li
              key={item.category}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.category}</p>
                  <p className="text-xs text-slate-500">{item.count} compromisos</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {formatCurrency(item.amount, "MXN")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </Card>
);
