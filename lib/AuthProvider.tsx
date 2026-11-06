"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/**
 * Whether the signed-in account may edit the shared plan, and if not, why.
 * - "editor": listed in plan_editors
 * - "not-editor": signed in, but not in plan_editors
 * - "not-set-up": the plan_editors table is missing (supabase/shared-household-plan.sql
 *   hasn't been run, or it failed and rolled back)
 * - "error": the check itself failed (offline, Supabase paused, ...)
 */
export type EditorStatus =
  | "signed-out"
  | "checking"
  | "editor"
  | "not-editor"
  | "not-set-up"
  | "error";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  /**
   * Signed in and listed in plan_editors, so allowed to change the shared
   * plan. null while that's still being checked.
   */
  isEditor: boolean | null;
  editorStatus: EditorStatus;
  /** Run the editor check again, e.g. after being added in Supabase. */
  recheckEditor: () => void;
  supabase: SupabaseClient;
}

/** PostgREST / Postgres codes for "this table doesn't exist" or "no access to it". */
const NOT_SET_UP_CODES = new Set(["PGRST205", "42P01", "42501"]);

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editorStatus, setEditorStatus] = useState<EditorStatus>("checking");
  const [checkCount, setCheckCount] = useState(0);
  const userId = user?.id;

  // Row-level security only lets a user see their own plan_editors row, so a
  // row coming back means "this account may edit". The database enforces the
  // same rule on every save; this only decides whether to show edit buttons.
  useEffect(() => {
    if (!userId) {
      setEditorStatus("signed-out");
      return;
    }

    let cancelled = false;
    setEditorStatus("checking");
    supabase
      .from("plan_editors")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Editor check failed:", error.code, error.message);
          setEditorStatus(NOT_SET_UP_CODES.has(error.code) ? "not-set-up" : "error");
          return;
        }
        setEditorStatus(data ? "editor" : "not-editor");
      });

    return () => {
      cancelled = true;
    };
  }, [userId, supabase, checkCount]);

  const recheckEditor = useCallback(() => setCheckCount((n) => n + 1), []);
  const isEditor =
    editorStatus === "editor" ? true : editorStatus === "checking" ? null : false;

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
    <AuthContext.Provider
      value={{ user, loading, isEditor, editorStatus, recheckEditor, supabase }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
