import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { addMonths, format } from "date-fns";
import { es } from "date-fns/locale";

import type { Debt } from "@/types/debt";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

interface ProjectionChartProps {
  debts: Debt[];
  loading?: boolean;
}

const buildProjectionData = (debts: Debt[]) => {
  const months = Array.from({ length: 6 }).map((_, index) => {
    const date = addMonths(new Date(), index);
    const key = format(date, "yyyy-MM");
    return { key, date, amount: 0 };
  });

  debts.forEach((debt) => {
    months.forEach((month) => {
      // Simple projection: add full amount each period
      month.amount += debt.frequency === "biweekly" ? debt.amount / 2 : debt.amount;
    });
  });

  return months.map((month) => ({
    label: format(month.date, "MMM yy", { locale: es }),
    amount: Math.round(month.amount)
  }));
};

export const ProjectionChart = ({ debts, loading }: ProjectionChartProps) => (
  <Card className="h-full" padding="lg">
    <div className="mb-6 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-900">Proyección de flujo</h3>
      <span className="text-sm text-slate-500">Próximos 6 meses</span>
    </div>
    {loading ? (
      <div className="flex h-64 flex-1 items-center justify-center">
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    ) : (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={buildProjectionData(debts)}>
            <defs>
              <linearGradient id="projectionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="15%" stopColor="#3c5fff" stopOpacity={0.85} />
                <stop offset="95%" stopColor="#3c5fff" stopOpacity={0.05} />
              </linearGradient>
            </defs>
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
              tickFormatter={(value) =>
                new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  maximumFractionDigits: 0
                }).format(value)
              }
            />
            <Tooltip
              cursor={{ strokeWidth: 1, strokeDasharray: "4 4", stroke: "#94a3b8" }}
              contentStyle={{
                borderRadius: "12px",
                borderColor: "#bfdbfe",
                boxShadow: "0 10px 30px rgba(15,23,42,0.08)"
              }}
              formatter={(value: number) =>
                new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN"
                }).format(value)
              }
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#1d3df5"
              strokeWidth={3}
              fill="url(#projectionGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )}
  </Card>
);
