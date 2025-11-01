import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

interface SupabaseContextValue {
  client: SupabaseClient | null;
  ready: boolean;
  envMissing: boolean;
  errorMessage?: string;
}

const SupabaseContext = createContext<SupabaseContextValue>({
  client: null,
  ready: false,
  envMissing: false
});

const createSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      client: null,
      envMissing: true,
      error: "Configura las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para continuar."
    };
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    },
    realtime: {
      params: {
        eventsPerSecond: 2
      }
    }
  });

  return { client, envMissing: false, error: undefined };
};

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [{ client, envMissing, error }, setState] = useState<{
    client: SupabaseClient | null;
    envMissing: boolean;
    error?: string;
  }>({
    client: null,
    envMissing: false,
    error: undefined
  });

  useEffect(() => {
    const next = createSupabaseClient();
    setState({
      client: next.client,
      envMissing: next.envMissing,
      error: next.error
    });
  }, []);

  const value = useMemo(
    () => ({
      client,
      ready: Boolean(client) && !envMissing,
      envMissing,
      errorMessage: error
    }),
    [client, envMissing, error]
  );

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};

export const useSupabase = () => useContext(SupabaseContext);
