import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://tcmtxvuucjttngcazgff.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjbXR4dnV1Y2p0dG5nY2F6Z2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MjUwMDEsImV4cCI6MjA1NjMwMTAwMX0.2WcIjMUEhSM6j9kYpbsYArQocZdHx86k7wXk-NyjIs0";

interface SupabaseContextValue {
  client: SupabaseClient | null;
  ready: boolean;
  envMissing: boolean;
  errorMessage?: string;
  url: string | null;
  anonKey: string | null;
  usingDefaults: boolean;
}

const SupabaseContext = createContext<SupabaseContextValue>({
  client: null,
  ready: false,
  envMissing: false,
  url: null,
  anonKey: null,
  usingDefaults: false
});

const createSupabaseClient = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const supabaseUrl = envUrl || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = envAnonKey || DEFAULT_SUPABASE_ANON_KEY;
  const usingDefaults = !(envUrl && envAnonKey);

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      client: null,
      envMissing: true,
      error: "No se encontraron credenciales de Supabase válidas.",
      url: null,
      anonKey: null,
      usingDefaults
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

  return {
    client,
    envMissing: false,
    error: undefined,
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    usingDefaults
  };
};

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [{ client, envMissing, error, url, anonKey, usingDefaults }, setState] = useState<{
    client: SupabaseClient | null;
    envMissing: boolean;
    error?: string;
    url: string | null;
    anonKey: string | null;
    usingDefaults: boolean;
  }>({
    client: null,
    envMissing: false,
    error: undefined,
    url: null,
    anonKey: null,
    usingDefaults: false
  });

  useEffect(() => {
    const next = createSupabaseClient();
    setState({
      client: next.client,
      envMissing: next.envMissing,
      error: next.error,
      url: next.url,
      anonKey: next.anonKey,
      usingDefaults: next.usingDefaults
    });
  }, []);

  const value = useMemo(
    () => ({
      client,
      ready: Boolean(client) && !envMissing,
      envMissing,
      errorMessage: error,
      url,
      anonKey,
      usingDefaults
    }),
    [client, envMissing, error, url, anonKey, usingDefaults]
  );

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};

export const useSupabase = () => useContext(SupabaseContext);
