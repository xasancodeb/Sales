import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Browser client (used in client components)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(url, anon);

// Server client with service role key (used in API routes only — never expose to browser)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serverClient(): ReturnType<typeof createClient<any>> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// User-scoped client (validates JWT, inherits RLS)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function userScopedClient(accessToken: string): ReturnType<typeof createClient<any>> {
  return createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
