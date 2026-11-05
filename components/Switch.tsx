interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

/** A labelled on/off switch (the whole row is clickable). */
export default function Switch({ checked, onChange, label, description }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-3 text-left py-1"
    >
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-ink">{label}</span>
        {description && (
          <span className="block text-[11px] text-ink-muted leading-snug">{description}</span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={`relative shrink-0 w-9 h-5 rounded-full transition-colors ${
          checked ? "bg-forest" : "bg-line"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
    </button>
  );
}
