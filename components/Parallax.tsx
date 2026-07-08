"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Full-bleed cover image with a gentle scroll-driven parallax.
 * The inner layer is oversized (−inset 12%) so the translate never reveals an edge.
 * Honors prefers-reduced-motion by rendering a static cover image.
 */
export function ParallaxImage({
  src,
  alt,
  priority = false,
  sizes = "124vw",
  focal = "center",
  range = 7,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  focal?: string;
  /** vertical travel in % of the (oversized) layer height */
  range?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${range}%`, `${range}%`]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className ?? ""}`}>
      <motion.div className="absolute -inset-[12%]" style={reduce ? undefined : { y }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: focal }}
        />
      </motion.div>
    </div>
  );
}
