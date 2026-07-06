"use client";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/* Horizon line at the top of the page — the sun-dot travels along it as you scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const left = useTransform(p, (v) => `${v * 100}%`);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <motion.div style={{ scaleX: p }} className="absolute inset-x-0 top-[1px] h-px origin-left bg-sol/70" />
      <motion.span
        style={{ left }}
        className="absolute top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sol shadow-[0_0_10px_rgba(239,160,11,0.9)]"
      />
    </div>
  );
}
