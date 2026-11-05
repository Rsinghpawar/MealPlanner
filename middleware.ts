import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);

  // Refresh the auth session (extends cookie lifetime)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === "/login";

  // Not authenticated and not on login → redirect to login
  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

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
    // Match all routes except static files, Next.js internals, and the files
    // that must load without a login: the PWA manifest and service worker
    // (browsers fetch them without cookies) and the Supabase keep-alive cron.
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|api/keep-alive|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
