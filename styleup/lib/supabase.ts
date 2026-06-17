import { createClient } from "@supabase/supabase-js";

function requireEnv(key: string) {
  const val = process.env[key];
  if (!val) throw new Error(`${key} is not set. Check your .env.local file.`);
  return val;
}

// Browser client — call this function, don't import a singleton
// (lazy so it doesn't throw at build time when env vars aren't present)
export function getSupabase() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}

// Convenience singleton for client components (safe — only runs in browser)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _browserClient: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function supabaseBrowser(): any {
  if (!_browserClient) _browserClient = getSupabase();
  return _browserClient;
}

// Named export matching what auth pages import as `supabase`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any = {
  get auth() { return supabaseBrowser().auth; },
};

// Server client with service role key (API routes only — never expose to browser)
export function serverClient() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

// User-scoped client — validates JWT, inherits RLS
export function userScopedClient(accessToken: string) {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } },
  );
}
