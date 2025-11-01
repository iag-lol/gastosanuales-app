import clsx from "clsx";
import { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 border-slate-200",
  success: "bg-emerald-100 text-emerald-700 border-emerald-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  danger: "bg-rose-100 text-rose-700 border-rose-200",
  info: "bg-sky-100 text-sky-700 border-sky-200"
};

export const Badge = ({ variant = "default", children, className }: BadgeProps) => (
  <span
    className={clsx(
      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
      VARIANT_STYLES[variant],
      className
    )}
  >
    {children}
  </span>
);
