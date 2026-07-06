import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[2px] font-semibold uppercase tracking-[0.08em] transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-50";
const variants: Record<Variant, string> = {
  primary: "bg-ink text-bg hover:bg-mar",
  accent: "bg-mar text-white hover:bg-mar-deep",
  outline: "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-bg",
  ghost: "text-ink hover:text-mar",
};
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[0.68rem]",
  md: "h-12 px-7 text-[0.72rem]",
  lg: "h-[52px] px-9 text-[0.75rem]",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({ variant = "primary", size = "md", className, ...props }: Common & ComponentProps<"button">) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Common & ComponentProps<typeof Link>) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
