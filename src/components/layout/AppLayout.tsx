import { PropsWithChildren } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";

import { NAV_ITEMS } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { useUpcomingNotifications } from "@/hooks/useDebtsData";
import { useSupabase } from "@/context/SupabaseProvider";

export const AppLayout = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();
  const { data: notifications } = useUpcomingNotifications();
  const { envMissing, errorMessage } = useSupabase();

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <aside className="sticky top-0 hidden h-screen w-72 flex-col justify-between border-r border-slate-200 bg-white/80 px-6 py-10 backdrop-blur xl:w-80 lg:flex">
        <div className="flex flex-col gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
              Gastos Anuales
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Centro de control inteligente
            </h1>
          </div>
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-primary-50/80",
                    isActive ? "bg-primary-50 text-primary-700" : "text-slate-500"
                  )
                }
              >
                <item.icon className="h-5 w-5 text-primary-500 transition group-hover:scale-110" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-accent-100/60 p-5 text-sm text-slate-600">
          <p className="font-semibold text-primary-700">Recordatorios próximos</p>
          <p className="mt-1 text-xs leading-relaxed">
            {notifications && notifications.length > 0
              ? "Mantente al día revisando los compromisos de esta semana."
              : "Sin alertas programadas. Crea una deuda para ver notificaciones."}
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-2 text-slate-400 shadow-sm transition hover:text-primary-600 focus-visible:outline focus-visible:outline-primary-600 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "2-digit",
                  month: "short"
                })}
              </p>
              <h2 className="text-xl font-semibold text-slate-900">
                {NAV_ITEMS.find((item) => item.path === pathname)?.label ?? "Panel"}
              </h2>
            </div>
          </div>
          <button className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-primary-600 focus-visible:outline focus-visible:outline-primary-600">
            <Bell className="h-5 w-5" />
            {notifications && notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                {notifications.length}
              </span>
            )}
          </button>
        </header>
        {envMissing && (
          <div className="mx-4 mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 md:mx-8">
            {errorMessage ||
              "Falta configurar las variables de Supabase. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en un archivo .env.local"}
          </div>
        )}
        <main className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-8">{children}</main>
        <nav className="sticky bottom-0 z-40 border-t border-slate-200 bg-white/90 px-2 py-2 backdrop-blur lg:hidden">
          <ul className="grid grid-cols-5 gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-xs font-semibold transition",
                      isActive
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                        : "text-slate-500 hover:bg-primary-50/70 hover:text-primary-600"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};
