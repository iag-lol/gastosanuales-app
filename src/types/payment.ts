export type PaymentStatus = "scheduled" | "paid" | "postponed" | "skipped";

export interface Payment {
  id: string;
  debt_id: string;
  amount: number | string;
  scheduled_for: string;
  paid_at?: string;
  status: PaymentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentInput
  extends Pick<Payment, "debt_id" | "amount" | "scheduled_for" | "notes" | "status"> {}
