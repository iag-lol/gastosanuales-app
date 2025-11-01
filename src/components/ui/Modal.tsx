import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<Required<ModalProps>["size"], string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl"
};

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  size = "md"
}: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur">
      <div
        className={`relative flex w-full flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.35)] ${sizeClasses[size]}`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:text-primary-600 focus-visible:outline focus-visible:outline-primary-600"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
        {(title || description) && (
          <header className="pr-12">
            {title && <h2 className="text-xl font-semibold text-slate-900">{title}</h2>}
            {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
          </header>
        )}
        <div className="max-h-[70vh] overflow-y-auto pr-2">{children}</div>
      </div>
    </div>,
    document.body
  );
};
