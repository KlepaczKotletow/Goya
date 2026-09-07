"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import type { Validator } from "@/lib/validate";

// Checkout form primitives.
//
// The floating label is pure CSS (.ck-field in globals.css) rather than React
// state, so it is already in the right position in the server HTML — a
// JS-driven lift makes every prefilled field animate on hydration.
// It lives in globals.css rather than as Tailwind variants because `peer-focus:*`
// generated no rules in this project, which left a focused-but-empty field with
// its label sitting on the caret. The input needs placeholder=" " for
// :placeholder-shown to mean "empty".
//
// Every control is 16px (text-base) at every breakpoint: iOS Safari zooms the
// viewport when a focused input computes below 16px, and an iPad is a touch
// device well above the md breakpoint.

const FIELD_BOX =
  "w-full rounded-[12px] border bg-paper px-4 pb-2 pt-6 text-base text-ink outline-none transition-colors placeholder:text-transparent";

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  name?: string;
  type?: string;
  hint?: string;
  /** Static prefix rendered inside the field, e.g. "+48". */
  adorn?: string;
  mask?: (v: string) => string;
  validate?: Validator;
  error?: string | null;
  setError?: (e: string | null) => void;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "decimal";
  enterKeyHint?: "next" | "done" | "go" | "search";
  maxLength?: number;
  autoCapitalize?: "none" | "words" | "characters";
  spellCheck?: boolean;
  required?: boolean;
};

export function Field({
  label, value, onChange, name, type = "text", hint, adorn, mask,
  validate, error, setError, autoComplete, inputMode, enterKeyHint = "next",
  maxLength, autoCapitalize, spellCheck, required,
}: FieldProps) {
  const id = useId();
  const errId = `${id}-err`;
  // :focus-within alone proved unreliable here, so the lifted/focused state is
  // also stamped explicitly. Value-driven lift stays in CSS (:placeholder-shown),
  // which means a prefilled field is already lifted in the server HTML.
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div>
      {/* Order matters: the input comes first so the CSS sibling selectors in
          globals.css (`input:not(:placeholder-shown) ~ label`) can reach the
          label, adornment and hint. */}
      <div className={cn("ck-field", error && "is-invalid", lifted && "is-lifted", focused && "is-focused")}>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          // A single space, not "": :placeholder-shown is what lifts the label.
          placeholder=" "
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          spellCheck={spellCheck}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          onChange={(e) => {
            onChange(mask ? mask(e.target.value) : e.target.value);
            // Clear the error the moment they start fixing it; re-check on blur.
            if (error && setError) setError(null);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            if (validate) setError?.(validate(value));
          }}
          className={cn(
            FIELD_BOX,
            error ? "border-terracotta" : "border-line focus:border-ink",
            adorn && "pl-[3.4rem]",
          )}
        />
        {adorn && <span aria-hidden="true" className="ck-adorn">{adorn}</span>}
        {hint && <span aria-hidden="true" className="ck-hint">{hint}</span>}
        <label htmlFor={id}>{label}</label>
      </div>
      {error && (
        <p id={errId} role="alert" className="mt-1.5 text-xs text-terracotta">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextArea({
  label, value, onChange, name, maxLength = 300,
}: {
  label: string; value: string; onChange: (v: string) => void; name?: string; maxLength?: number;
}) {
  const id = useId();
  return (
    <div>
      <div className="ck-field">
        <textarea
          id={id}
          name={name}
          rows={3}
          value={value}
          placeholder=" "
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          className={cn(FIELD_BOX, "resize-none border-line focus:border-ink")}
        />
        {/* A textarea's label sits at the top rather than centred, so it is
            pinned there instead of inheriting the vertical-centre rest state. */}
        <label htmlFor={id} className="!top-[0.65rem] !translate-y-0 !text-[0.7rem]">{label}</label>
      </div>
      <p className="mt-1 text-right text-xs text-stone">{value.length}/{maxLength}</p>
    </div>
  );
}

export function Segmented<T extends string>({
  label, value, onChange, options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const i = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div>
      <p className="mb-1.5 text-xs text-stone">{label}</p>
      <div
        role="tablist"
        aria-label={label}
        className="relative grid gap-1 rounded-full border border-line bg-paper p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {/* The sliding thumb is one element that translates, so the movement
            reads as a single control rather than two buttons swapping colour. */}
        <span
          aria-hidden="true"
          className="absolute bottom-1 top-1 rounded-full bg-ink transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{
            width: `calc((100% - 0.5rem - ${(options.length - 1) * 0.25}rem) / ${options.length})`,
            transform: `translateX(calc(${i * 100}% + ${i * 0.25}rem))`,
            left: "0.25rem",
          }}
        />
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={o.value === value}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative z-10 rounded-full py-2 text-sm transition-colors",
              o.value === value ? "text-paper" : "text-ink-soft hover:text-ink",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CheckRow({
  checked, onChange, children, error, name,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  error?: string | null;
  name?: string;
}) {
  const id = useId();
  return (
    <div>
      {/* min-h-11 keeps the row at the 44px minimum touch target. */}
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border transition-colors",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta",
            checked ? "border-ink bg-ink text-paper" : error ? "border-terracotta" : "border-line bg-paper",
          )}
        >
          {checked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </span>
        <span className="text-[0.82rem] leading-relaxed text-ink-soft">{children}</span>
      </label>
      {error && (
        <p role="alert" className="ml-8 text-xs text-terracotta">
          {error}
        </p>
      )}
    </div>
  );
}

/** A delivery or payment option rendered as a radio-styled card. */
export function OptionCard({
  selected, onSelect, title, note, badge, price, icon,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  note: string;
  badge?: string;
  price?: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-[12px] border px-4 py-3.5 text-left transition-colors",
        selected ? "border-ink bg-paper" : "border-line hover:border-ink/40",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors",
          selected ? "border-[6px] border-terracotta" : "border-line",
        )}
      />
      {icon && <span className="shrink-0 text-stone">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[0.95rem] font-medium text-ink">{title}</span>
          {badge && (
            <span className="rounded-full bg-terracotta/10 px-2 py-0.5 text-[0.65rem] font-medium text-terracotta">
              {badge}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-xs text-stone">{note}</span>
      </span>
      {price && <span className="shrink-0 text-sm text-sage">{price}</span>}
    </button>
  );
}

/** Used by the mobile review block: a labelled row with a "Zmień" jump. */
export function ReviewRow({
  label, onEdit, children,
}: {
  label: string; onEdit: () => void; children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 border-b border-line py-3 last:border-0">
      <span className="w-24 shrink-0 text-xs text-stone">{label}</span>
      <span className="min-w-0 flex-1 text-sm text-ink">{children}</span>
      <button type="button" onClick={onEdit} className="shrink-0 self-start text-xs text-stone underline underline-offset-2 hover:text-ink">
        Zmień
      </button>
    </div>
  );
}
