import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Browser Supabase client used only for admin email/password sign-in. The
 * resulting access token is handed to the NestJS backend (see lib/api.ts),
 * which is the authorization source of truth for every /admin/* route.
 */
export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
});
