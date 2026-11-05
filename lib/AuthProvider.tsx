"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  /**
   * Signed in and listed in plan_editors, so allowed to change the shared
   * plan. null while that's still being checked.
   */
  isEditor: boolean | null;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditor, setIsEditor] = useState<boolean | null>(null);
  const userId = user?.id;

  // Row-level security only lets a user see their own plan_editors row, so a
  // row coming back means "this account may edit". The database enforces the
  // same rule on every save; this only decides whether to show edit buttons.
  useEffect(() => {
    if (!userId) {
      setIsEditor(false);
      return;
    }

    let cancelled = false;
    setIsEditor(null);
    supabase
      .from("plan_editors")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setIsEditor(Boolean(data));
      });

    return () => {
      cancelled = true;
    };
  }, [userId, supabase]);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, loading, isEditor, supabase }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
