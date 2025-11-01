import type { UtilityKind } from "@/types/utilities";

export const DEFAULT_UTILITY_SERVICES: Array<{
  name: string;
  kind: UtilityKind;
  unit: string;
  rate_per_unit: number;
  color: string;
  goal_monthly_budget: number;
}> = [
  {
    name: "Agua potable",
    kind: "agua",
    unit: "m³",
    rate_per_unit: 1200,
    color: "#3b82f6",
    goal_monthly_budget: 25000
  },
  {
    name: "Energía eléctrica",
    kind: "luz",
    unit: "kWh",
    rate_per_unit: 190,
    color: "#f97316",
    goal_monthly_budget: 42000
  },
  {
    name: "Gas domiciliario",
    kind: "gas",
    unit: "m³",
    rate_per_unit: 850,
    color: "#facc15",
    goal_monthly_budget: 38000
  },
  {
    name: "Internet & TV",
    kind: "internet",
    unit: "Mbps",
    rate_per_unit: 500,
    color: "#8b5cf6",
    goal_monthly_budget: 29000
  }
];

export const UTILITY_KIND_LABELS: Record<UtilityKind, string> = {
  agua: "Agua",
  luz: "Luz",
  gas: "Gas",
  internet: "Internet",
  otro: "Otro"
};
