import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/server";

export async function proxy(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);

  // Refresh the auth session (extends cookie lifetime)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === "/login";

  // The meal plan is public; only editing needs an account.
  // Authenticated and on login → redirect to home
  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files, Next.js internals, and requests
    // that never carry a session, so they skip the Supabase auth check: the
    // PWA manifest and service worker, and the daily keep-alive cron.
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|api/keep-alive|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
