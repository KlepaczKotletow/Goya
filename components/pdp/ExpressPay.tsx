"use client";
import { useSyncExternalStore } from "react";
import { AppleIcon, GPayIcon } from "../icons";

type ApplePayWindow = Window & { ApplePaySession?: { canMakePayments?: () => boolean } };

// Google Pay by default; Apple Pay only where it can actually be used:
// Safari exposing a working ApplePaySession, iPhone/iPod, or iPadOS 13+
// (which reports a desktop "Macintosh" UA but is touch-capable).
function detectApple(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as ApplePayWindow;
  try {
    if (w.ApplePaySession?.canMakePayments?.()) return true;
  } catch {
    if (w.ApplePaySession) return true;
  }
  const ua = navigator.userAgent;
  return /iPhone|iPod|iPad/.test(ua) || (/Mac/.test(ua) && navigator.maxTouchPoints > 1);
}

// No external source to subscribe to — the device doesn't change mid-session.
const subscribe = () => () => {};

// useSyncExternalStore returns the server snapshot (false → Google) on the server
// and the first client render, then swaps to the real value after hydration.
// This avoids a hydration mismatch without a lint-flagged setState-in-effect.
export function useIsAppleDevice(): boolean {
  return useSyncExternalStore(subscribe, detectApple, () => false);
}

export function PayLogo({ isApple, className }: { isApple: boolean; className?: string }) {
  return isApple ? (
    <span className={`flex items-center gap-1 text-[0.95rem] font-medium ${className ?? ""}`}>
      <AppleIcon className="-mt-0.5" /> Pay
    </span>
  ) : (
    <GPayIcon className={className} />
  );
}
