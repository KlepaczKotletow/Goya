"use client";
import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * The rotating Goya seal - the brand's signature mark. Ring text spins slowly
 * around a fixed terracotta "G". Color is driven by the parent (currentColor for
 * the ring; letterClassName for the G), so it adapts to light or dark surfaces.
 */
export function Seal({
  className,
  letterClassName = "text-terracotta",
  letterSizeClassName = "text-2xl",
  text = "POLARYZACJA · UV400 · POLSKA MARKA · ",
}: {
  className?: string;
  letterClassName?: string;
  letterSizeClassName?: string;
  text?: string;
}) {
  const pathId = `seal-${useId().replace(/:/g, "")}`;
  return (
    <div className={cn("relative grid place-items-center", className)} aria-hidden>
      <div className="animate-spin-slow h-full w-full">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <path id={pathId} d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
          </defs>
          <text fontSize="8.6" letterSpacing="1.4" fill="currentColor">
            <textPath href={`#${pathId}`}>{text}</textPath>
          </text>
        </svg>
      </div>
      <span className={cn("absolute font-display", letterSizeClassName, letterClassName)}>G</span>
    </div>
  );
}
