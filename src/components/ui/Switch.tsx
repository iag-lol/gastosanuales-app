import clsx from "clsx";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Switch = ({ label, className, ...props }: SwitchProps) => (
  <label className={clsx("flex items-center gap-3 text-sm font-medium text-slate-600", className)}>
    <input
      type="checkbox"
      className="peer sr-only"
      {...props}
    />
    <span className="relative inline-flex h-6 w-11 items-center rounded-full border border-slate-200 bg-slate-200 transition peer-checked:border-primary-500 peer-checked:bg-primary-600">
      <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
    </span>
    {label}
  </label>
);
