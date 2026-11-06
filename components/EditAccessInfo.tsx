"use client";

import { useCallback, useRef, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { useDismiss } from "@/lib/useDismiss";

/** SQL that adds an account to the editor list (run in Supabase -> SQL Editor). */
function addEditorSql(email: string): string {
  const quoted = email.replace(/'/g, "''");
  return `insert into public.plan_editors (user_id)
select id from auth.users where email = '${quoted}'
on conflict (user_id) do nothing;`;
}

const BADGE_LABEL = {
  "not-editor": "View only",
  "not-set-up": "Editing not set up",
  error: "Can't check access",
} as const;

/**
 * Shown under "Sign out" when the signed-in account can't edit. Tapping it
 * explains why and how to fix it.
 */
export default function EditAccessInfo() {
  const { user, editorStatus, recheckEditor } = useAuth();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useDismiss(rootRef, open, useCallback(() => setOpen(false), []));

  if (
    !user ||
    (editorStatus !== "not-editor" &&
      editorStatus !== "not-set-up" &&
      editorStatus !== "error")
  ) {
    return null;
  }

  const email = user.email ?? "";
  const sql = addEditorSql(email);

  async function copySql() {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the SQL is selectable, so it can be copied by hand.
    }
  }

  return (
    <div ref={rootRef} className="relative mt-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold bg-white/15 hover:bg-white/25 transition-colors"
      >
        {BADGE_LABEL[editorStatus]}
        <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true" fill="none"
          stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Edit access"
          className="absolute right-0 top-full mt-2 z-40 w-72 max-w-[calc(100vw-2rem)] rounded-xl bg-surface text-ink shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-3 text-left"
        >
          {editorStatus === "not-editor" && (
            <>
              <p className="text-[13px] font-bold">This account can&apos;t edit yet</p>
              <p className="text-[12px] text-ink-muted mt-1 leading-snug">
                You&apos;re signed in as{" "}
                <span className="font-semibold text-ink break-all">{email}</span>, but
                it isn&apos;t on the plan&apos;s editor list, so the edit buttons are
                hidden. Ask the plan&apos;s owner to add this email.
              </p>
              <p className="text-[12px] font-semibold mt-3">If you&apos;re the owner</p>
              <p className="text-[12px] text-ink-muted leading-snug">
                In Supabase, open <span className="font-semibold">SQL Editor</span>,
                run this, then tap Check again:
              </p>
              <pre className="mt-1.5 rounded-lg bg-field border border-line p-2 text-[10.5px] leading-snug whitespace-pre-wrap break-words select-all font-mono">
                {sql}
              </pre>
              <button
                type="button"
                onClick={copySql}
                className="mt-1.5 text-[12px] font-semibold text-accent hover:underline"
              >
                {copied ? "✓ Copied" : "Copy SQL"}
              </button>
            </>
          )}

          {editorStatus === "not-set-up" && (
            <>
              <p className="text-[13px] font-bold">Editing isn&apos;t set up yet</p>
              <p className="text-[12px] text-ink-muted mt-1 leading-snug">
                The database doesn&apos;t have the editor list. In Supabase, open{" "}
                <span className="font-semibold">SQL Editor</span> and run{" "}
                <span className="font-mono text-[11px]">supabase/shared-household-plan.sql</span>{" "}
                from the repo. In its step 3, replace you@example.com with{" "}
                <span className="font-semibold text-ink break-all">{email}</span>.
                Then tap Check again.
              </p>
            </>
          )}

          {editorStatus === "error" && (
            <>
              <p className="text-[13px] font-bold">Couldn&apos;t check edit access</p>
              <p className="text-[12px] text-ink-muted mt-1 leading-snug">
                The database didn&apos;t answer. Check your connection, or whether the
                Supabase project is paused, then try again.
              </p>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              recheckEditor();
            }}
            className="mt-3 w-full rounded-lg bg-forest text-white text-[13px] font-semibold py-2 hover:bg-forest/90 transition-colors"
          >
            Check again
          </button>
        </div>
      )}
    </div>
  );
}
