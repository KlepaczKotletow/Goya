"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const initial = reduce ? false : { opacity: 0, y };
  const target = { opacity: 1, y: 0 };
  const transition = { duration: 0.75, ease: EASE, delay };
  if (immediate) {
    return (
      <motion.div className={className} initial={initial} animate={target} transition={transition}>
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div className={className} initial={initial} whileInView={target} viewport={{ once: true, margin: "-60px" }} transition={transition}>
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, y = 20 }: { children: ReactNode; className?: string; y?: number }) {
  return (
    <motion.div className={className} variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } }}>
      {children}
    </motion.div>
  );
}
