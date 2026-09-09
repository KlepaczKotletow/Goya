import { LOGO_WORDMARK } from "@/content/logo";
import { cn } from "@/lib/utils";

// Both marks are filled with currentColor, so one path serves terracotta on cream and
// cream on ink. The data is inlined into the markup rather than fetched as
// <img src="/logo-goya.svg">: the header mark is painted on every route, and a
// separate request for ~4 kB would leave a hole in the sticky bar on a cold load.

// Both marks fill the width of their container and derive their height from the
// viewBox, so callers size them on a wrapper. cn() here is plain clsx with no
// tailwind-merge, so a w-* passed in className would collide with w-full rather
// than replace it.
type Props = { className?: string };

/**
 * GOYA(R) on its own. Use it anywhere the mark renders below ~150px wide — in the
 * header it sits about 30px tall, and at that size the lockup's HAND MADE rule is
 * under 5px and turns to mush.
 */
export function Wordmark({ className }: Props) {
  return (
    <svg
      viewBox={LOGO_WORDMARK.viewBox}
      role="img"
      aria-label="Goya"
      fill="currentColor"
      fillRule="evenodd"
      className={cn("block h-auto w-full", className)}
    >
      <path d={LOGO_WORDMARK.d} />
    </svg>
  );
}
