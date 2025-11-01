import clsx from "clsx";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-600" htmlFor={inputId}>
        {label && <span>{label}</span>}
        <input
          id={inputId}
          ref={ref}
          className={clsx(
            "h-11 rounded-xl border bg-white px-4 text-slate-900 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 placeholder:text-slate-400",
            error && "border-rose-400 focus:border-rose-400 focus:ring-rose-100",
            className
          )}
          {...props}
        />
        {(hint || error) && (
          <span className={clsx("text-xs", error ? "text-rose-600" : "text-slate-400")}>
            {error || hint}
          </span>
        )}
      </label>
    );
  }
);

Input.displayName = "Input";
