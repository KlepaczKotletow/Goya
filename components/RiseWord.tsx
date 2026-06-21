"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/motion";

export function RiseWord({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{children}</span>;
  return (
    <span className="inline-block overflow-hidden pb-[0.14em] align-bottom">
      <motion.span
        className={`inline-block ${className ?? ""}`}
        initial={{ y: "118%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.85, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
