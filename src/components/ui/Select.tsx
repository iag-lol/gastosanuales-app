import clsx from "clsx";
import { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, className, id, options, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-600" htmlFor={selectId}>
        {label && <span>{label}</span>}
        <select
          id={selectId}
          ref={ref}
          className={clsx(
            "h-11 rounded-xl border bg-white px-4 text-slate-900 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100",
            error && "border-rose-400 focus:border-rose-400 focus:ring-rose-100",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {(hint || error) && (
          <span className={clsx("text-xs", error ? "text-rose-600" : "text-slate-400")}>
            {error || hint}
          </span>
        )}
      </label>
    );
  }
);

Select.displayName = "Select";
