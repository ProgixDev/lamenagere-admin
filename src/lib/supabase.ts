import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Browser Supabase client used only for admin email/password sign-in. The
 * resulting access token is handed to the NestJS backend (see lib/api.ts),
 * which is the authorization source of truth for every /admin/* route.
 *
 * Created on first use, not at import: `createClient` throws on an empty URL,
 * and `/login` is prerendered at build time. A module-level client turned a
 * missing NEXT_PUBLIC_SUPABASE_URL into a failed `next build` on Vercel; now it
 * only fails the sign-in itself, with a message that names the variable.
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Configuration manquante : NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  client = createClient(url, anon, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return client;
}
