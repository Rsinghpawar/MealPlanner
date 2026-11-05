import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * Keeps the Supabase free-tier project from being paused for inactivity.
 *
 * Supabase pauses free projects after 7 days without activity. Vercel Cron
 * (see vercel.json) calls this route once a day, and it runs one tiny real
 * query against the database, which counts as activity.
 *
 * If the CRON_SECRET env var is set in Vercel, Vercel sends it as
 * `Authorization: Bearer <CRON_SECRET>` and any other caller is rejected.
 */
export const dynamic = "force-dynamic";
// Next.js caches fetch() responses by default, which would turn every ping
// after the first into a cache hit that never reaches Supabase.
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.json(
      { ok: false, error: "Supabase env vars are not configured" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });

  const started = Date.now();
  const { error } = await supabase.from("base_meal_plans").select("id").limit(1);

  if (error) {
    console.error("Supabase keep-alive failed:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    pingedAt: new Date().toISOString(),
    latencyMs: Date.now() - started,
  });
}
