import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/dates";
import type { UtilityService } from "@/types/utilities";

interface TrendPoint {
  label: string;
  total: number;
  [key: string]: string | number;
}

interface UtilityTrendChartProps {
  data: TrendPoint[];
  services: UtilityService[];
}

export const UtilityTrendChart = ({ data, services }: UtilityTrendChartProps) => (
  <Card padding="lg" className="h-full">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Proyección energética</h3>
        <p className="text-xs text-slate-500">
          Tendencia de los últimos ciclos con detalle por servicio y consumo total.
        </p>
      </div>
    </div>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            {services.map((service) => (
              <linearGradient
                key={service.id}
                id={`gradient-${service.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="15%" stopColor={service.color || "#3b82f6"} stopOpacity={0.85} />
                <stop offset="95%" stopColor={service.color || "#3b82f6"} stopOpacity={0.05} />
              </linearGradient>
            ))}
            <linearGradient id="gradient-total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="15%" stopColor="#1f2937" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#1f2937" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="8 8" stroke="#e2e8f0" opacity={0.6} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#475569" }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#475569" }}
            tickFormatter={(value) => formatCurrency(Number(value))}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              borderColor: "#e2e8f0",
              boxShadow: "0 16px 40px rgba(15,23,42,0.18)"
            }}
            formatter={(value: number) => {
              return formatCurrency(value);
            }}
          />
          <Legend />
          {services.map((service) => (
            <Area
              key={service.id}
              dataKey={service.id}
              name={service.name}
              type="monotone"
              stackId="1"
              stroke={service.color || "#3b82f6"}
              strokeWidth={2}
              fill={`url(#gradient-${service.id})`}
            />
          ))}
          <Area
            dataKey="total"
            type="monotone"
            stroke="#1f2937"
            strokeDasharray="4 4"
            strokeWidth={2}
            fill="url(#gradient-total)"
            legendType="none"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Card>
);
