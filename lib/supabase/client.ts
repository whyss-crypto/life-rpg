import { createBrowserClient } from "@supabase/ssr";

// NOTE: typed as `any` at the boundary on purpose — the checked-in
// `Database` type is documentation-grade; runtime queries stay unblocked
// even if generated types drift. Authoritative shapes are validated by
// Zod + the SQL RPCs, not by client generics.
export function createClient(): any {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }
  return createBrowserClient(url, key, {
    // Secure in production so session cookies never travel over plain HTTP.
    cookieOptions: { secure: process.env.NODE_ENV === "production" },
  });
}
