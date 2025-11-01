export type NotificationKind = "upcoming" | "overdue" | "postponed" | "summary";

export interface DebtNotification {
  id: string;
  debt_id: string;
  fire_at: string;
  kind: NotificationKind;
  message: string;
  created_at: string;
  delivered_at?: string;
}
