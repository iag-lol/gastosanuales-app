import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface ToastItem {
  id: number;
  message: string;
}

export const GlobalToaster = () => {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    let counter = 0;
    const handler = (event: Event) => {
      const custom = event as CustomEvent<string>;
      counter += 1;
      setItems((current) => [
        ...current,
        {
          id: counter,
          message: custom.detail
        }
      ]);
    };

    window.addEventListener("toast", handler as EventListener);

    return () => {
      window.removeEventListener("toast", handler as EventListener);
    };
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const timers = items.map((item) =>
      setTimeout(
        () => setItems((current) => current.filter((toast) => toast.id !== item.id)),
        4000
      )
    );

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-700 shadow-subtle"
        >
          <CheckCircle2 className="h-5 w-5" />
          {item.message}
        </div>
      ))}
    </div>
  );
};
