"use client";

import Link from "next/link";
import { TAGS } from "@/data/mealPlan";
import { useAuth } from "@/lib/AuthProvider";
import { useRouter } from "next/navigation";

const AUTH_BUTTON_CLASS =
  "shrink-0 whitespace-nowrap text-[11px] bg-white/20 hover:bg-white/30 transition-colors rounded-lg px-3 py-1.5 mt-1";

export default function Header() {
  const { user, loading, supabase } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    // Stay on the plan; it's public now.
    router.refresh();
  }

  return (
    <header className="bg-forest text-white px-4 py-6 md:px-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[22px] font-bold">
            {"\u{1F957}"} 12-Day Home Meal Plan
          </h1>
          <p className="text-[13px] opacity-80 mt-1">
            Mon{"\u2013"}Sat {"\u00D7"} 2 Weeks {"\u00B7"} For 3 people{" "}
            {"\u00B7"} Cook-friendly
          </p>
        </div>
        {!loading &&
          (user ? (
            <button onClick={handleSignOut} className={AUTH_BUTTON_CLASS}>
              Sign out
            </button>
          ) : (
            <Link href="/login" className={AUTH_BUTTON_CLASS}>
              Log in
            </Link>
          ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {TAGS.map((tag) => (
          <span
            key={tag}
            className="bg-white/20 rounded-full px-3 py-0.5 text-[11px]"
          >
            {tag}
          </span>
        ))}
      </div>
    </header>
  );
}
