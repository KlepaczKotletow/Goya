// Server-only Supabase REST helper for order + newsletter capture.
// Uses the anon (publishable) key, which is safe to ship: row-level security on
// these tables allows INSERT only — nothing can be read back with this key.
// Tables live in the shared "KingsCup" project until Goya gets its own
// (goya_orders / goya_newsletter, namespaced to avoid collisions).
const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://mjsaygxzaojmkltufpll.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qc2F5Z3h6YW9qbWtsdHVmcGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzI3OTgsImV4cCI6MjA3MTAwODc5OH0.Hq9NpBgY9I1jNDjiIxT3hgytX-rRMQO3aLKawjN7oWc";

export async function supabaseInsert(table: string, row: Record<string, unknown>): Promise<boolean> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) console.error(`supabase insert ${table} failed: ${res.status} ${await res.text()}`);
  return res.ok;
}
