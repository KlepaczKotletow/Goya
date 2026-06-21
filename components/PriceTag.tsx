import { formatPLN, premiumPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function PriceTag({ woo, className }: { woo: number | null; className?: string }) {
  return <span className={cn("tabular-nums", className)}>{formatPLN(premiumPrice(woo))}</span>;
}
