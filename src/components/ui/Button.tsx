import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-600 text-white border-primary-600 shadow-sm hover:bg-primary-700 focus-visible:outline-primary-600",
        secondary:
          "bg-white text-slate-900 border-slate-200 shadow-sm hover:border-primary-300 hover:text-primary-700 focus-visible:outline-primary-600",
        ghost:
          "border-transparent text-slate-600 hover:text-primary-700 hover:bg-primary-50/60 focus-visible:outline-primary-600",
        subtle:
          "bg-accent-100 text-primary-700 border-accent-200 hover:bg-accent-200 focus-visible:outline-primary-600",
        danger:
          "bg-red-500 border-red-500 text-white shadow-sm hover:bg-red-600 focus-visible:outline-red-500"
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11 p-0"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({
          variant,
          size,
          className
        })}
        aria-busy={loading}
        disabled={loading || disabled}
        ref={ref}
        {...props}
      >
        {loading && (
          <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-b-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
