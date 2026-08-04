"use client";
import { useSyncExternalStore } from "react";
import { AppleIcon, GPayIcon } from "../icons";

type ApplePayWindow = Window & { ApplePaySession?: { canMakePayments?: () => boolean } };

// Brand-based: any Apple hardware (iPhone/iPad/Mac — regardless of browser)
// gets the Apple Pay button, everything else Google Pay. ApplePaySession kept
// as a positive signal for odd UAs.
function detectApple(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as ApplePayWindow;
  try {
    if (w.ApplePaySession?.canMakePayments?.()) return true;
  } catch {
    if (w.ApplePaySession) return true;
  }
  const ua = navigator.userAgent;
  return /iPhone|iPod|iPad|Macintosh|Mac OS X/.test(ua) || (/Mac/.test(ua) && navigator.maxTouchPoints > 1);
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
