import { Home, Wallet, BarChart3, Settings } from "lucide-react";

export const MOBILE_NAV_HEIGHT = 72;

export const NAV_ITEMS = [
  { label: "Inicio", icon: Home, path: "/" },
  { label: "Deudas", icon: Wallet, path: "/deudas" },
  { label: "Informes", icon: BarChart3, path: "/informes" },
  { label: "Ajustes", icon: Settings, path: "/ajustes" }
];

export const CURRENCIES = [
  { code: "MXN", label: "Peso mexicano" },
  { code: "USD", label: "Dólar estadounidense" },
  { code: "EUR", label: "Euro" },
  { code: "COP", label: "Peso colombiano" },
  { code: "CLP", label: "Peso chileno" }
];

export const DEBT_STATUSES = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagada" },
  { value: "overdue", label: "Atrasada" },
  { value: "postponed", label: "Postergada" },
  { value: "archived", label: "Archivada" }
];
