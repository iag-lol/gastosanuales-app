import clsx from "clsx";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export const Card = ({ children, className, padding = "md" }: CardProps) => {
  const paddingClass =
    padding === "lg" ? "p-8" : padding === "sm" ? "p-4" : "p-6";

  return (
    <section
      className={clsx(
        "rounded-3xl border border-slate-200 bg-white/90 shadow-subtle backdrop-blur",
        paddingClass,
        className
      )}
    >
      {children}
    </section>
  );
};
