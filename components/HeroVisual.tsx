"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function HeroVisual({ src, alt }: { src: string; alt: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px]">
      {/* Stage + product share ONE transformed/animated context so mix-blend-multiply
          dissolves the packshot's white background against the color field. */}
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { opacity: 0, scale: 0.93 }}
        animate={reduce ? {} : { opacity: 1, scale: 1, y: [0, -12, 0] }}
        transition={{
          opacity: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.9 },
        }}
      >
        <div className="absolute inset-[7%] rounded-full bg-gradient-to-b from-linen to-clay/80 ring-1 ring-ink/10" />
        <Image src={src} alt={alt} fill priority sizes="(max-width:768px) 88vw, 45vw" className="object-contain p-12 mix-blend-multiply" />
      </motion.div>

      <div className="absolute -right-1 bottom-4 z-10 grid h-28 w-28 place-items-center rounded-full bg-bg shadow-[0_14px_34px_-14px_rgba(38,34,31,0.55)] md:-right-3 md:bottom-8 md:h-32 md:w-32">
        <div className="animate-spin-slow text-ink">
          <svg viewBox="0 0 100 100" className="h-24 w-24 md:h-28 md:w-28">
            <defs>
              <path id="goya-hero-badge" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
            </defs>
            <text fontSize="8.6" letterSpacing="1.4" fill="currentColor">
              <textPath href="#goya-hero-badge">POLARYZACJA · UV400 · POLSKA MARKA · </textPath>
            </text>
          </svg>
        </div>
        <span className="absolute font-display text-2xl text-terracotta md:text-3xl">G</span>
      </div>
    </div>
  );
}
