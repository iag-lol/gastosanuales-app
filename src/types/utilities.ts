export type UtilityKind = "agua" | "luz" | "gas" | "internet" | "otro";

export interface UtilityService {
  id: string;
  name: string;
  kind: UtilityKind;
  unit: string;
  rate_per_unit?: number | string;
  goal_monthly_budget?: number | string;
  alert_threshold?: number;
  auto_estimate: boolean;
  color?: string;
  created_at: string;
  updated_at: string;
}

export type UtilityMeasurementStatus = "estimated" | "confirmed";

export interface UtilityMeasurement {
  id: string;
  service_id: string;
  period_start: string;
  period_end: string;
  units_used: number;
  amount: number | string;
  status: UtilityMeasurementStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UtilityMeasurementInput
  extends Pick<
      UtilityMeasurement,
      "service_id" | "period_start" | "period_end" | "units_used" | "status" | "notes"
    > {
  amount?: number;
}

export interface UtilityInsight {
  service: UtilityService;
  currentAmount: number;
  previousAmount: number;
  variation: number;
  averageUnits: number;
}
