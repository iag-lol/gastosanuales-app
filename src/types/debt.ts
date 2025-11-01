export type DebtStatus = "pending" | "paid" | "overdue" | "postponed" | "archived";

export type PaymentFrequency = "monthly" | "biweekly" | "custom";

export type DueDayType = "end_of_month" | "quincena" | "custom";

export interface Debt {
  id: string;
  name: string;
  description?: string;
  amount: number | string;
  currency: "CLP";
  category?: string;
  due_day_type: DueDayType;
  custom_due_day?: number;
  start_date: string;
  end_date?: string;
  total_installments?: number;
  paid_installments: number;
  status: DebtStatus;
  next_due_date?: string | null;
  alert_threshold_days: number;
  frequency: PaymentFrequency;
  autopay: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
  household_member?: string;
}

export interface DebtInput
  extends Pick<
    Debt,
    | "name"
    | "description"
    | "amount"
    | "currency"
    | "category"
    | "due_day_type"
    | "custom_due_day"
    | "start_date"
    | "end_date"
    | "total_installments"
    | "alert_threshold_days"
    | "frequency"
    | "autopay"
    | "tags"
    | "household_member"
  > {
  recurrence_count?: number;
}

export interface DebtSummary {
  total_amount: number;
  total_pending: number;
  total_overdue: number;
  total_paid: number;
  monthly_projection: number;
  biweekly_projection: number;
  next_due_date?: string;
  next_due_amount?: number;
  installments?: number;
  installmentsPaid?: number;
}
