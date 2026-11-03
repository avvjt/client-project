"use client";

/**
 * DISPO-CONCEPT — MEDICAL ARTIFACT LANGUAGE
 *
 * A single visual grammar of stroke-based, medical line-art used as
 * "artifacts" floating behind content at three focal depths:
 *
 *   far   — oversized, heavy blur, near-invisible (depth cue)
 *   mid   — soft blur, slow drift (atmosphere)
 *   near  — crisp, small, gentle float (detail)
 *
 * Every artifact is pure SVG (currentColor), aria-hidden and decorative.
 * All motion dies under the global prefers-reduced-motion rule.
 */

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/* ── Geometry helpers ──────────────────────────────────────────────── */

function rr(x: number, y: number, w: number, h: number, r: number): string {
  return (
    `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}` +
    `v${h - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}` +
    `h-${w - 2 * r}a${r} ${r} 0 0 1 -${r} -${r}` +
    `v-${h - 2 * r}a${r} ${r} 0 0 1 ${r} -${r}Z`
  );
}

/* ── Artifact registry (all 64×64 stroke line-art) ─────────────────── */

export type ArtifactName =
  | "mask"
  | "gown"
  | "glove"
  | "syringe"
  | "capsule"
  | "vial"
  | "pack"
  | "cap"
  | "shoeCover"
  | "wrap"
  | "case"
  | "kit"
  | "cross"
  | "pulse"
  | "molecule";

const ARTIFACT_PATHS: Record<ArtifactName, string[]> = {
  mask: [
    "M14 26c12-5 24-5 36 0v14c-12 5-24 5-36 0V26Z",
    "M14 31.5c12-4.5 24-4.5 36 0",
    "M14 36.5c12-4.5 24-4.5 36 0",
    "M14 28c-6 1-9 6-7 11",
    "M50 28c6 1 9 6 7 11",
  ],
  gown: [
    "M24 10l8 8 8-8 9 4.5c2.4 1.2 4 3.7 4 6.5V54H11V21c0-2.8 1.6-5.3 4-6.5L24 10Z",
    "M32 18v36",
    "M19 30v24",
    "M45 30v24",
    "M19 38h-8",
    "M45 38h8",
  ],
  glove: [
    "M22 48V16c0-1.5 1-2.5 2.5-2.5S27 14.5 27 16v12",
    "M27 28V12c0-1.5 1-2.5 2.5-2.5S32 10.5 32 12v16",
    "M32 28V13c0-1.5 1-2.5 2.5-2.5S37 11.5 37 13v15",
    "M37 28V15c0-1.5 1-2.5 2.5-2.5S42 14.5 42 16v14",
    "M22 34c-4-1-7-4-7-8 0-1.7 1.3-3 3-3 1.4 0 2.6 1 2.9 2.3L22 30",
    "M22 48h20V30",
    rr(21, 48, 22, 8, 2),
  ],
  syringe: [
    "M10 28h6v8h-6z",
    "M16 32h4",
    rr(20, 27, 22, 10, 1.5),
    "M42 30l7-2.5v9L42 34",
    "M49 32h11",
    "M26 29v6",
    "M31 29v6",
    "M36 29v6",
  ],
  capsule: [
    rr(12, 25, 40, 14, 7),
    "M32 25v14",
    "M19 32h3",
    "M20.5 30.5v3",
    "M51 12h6",
    "M54 9v6",
  ],
  vial: [
    "M24 11h16",
    "M26 11v9l-4 6v25a4 4 0 004 4h12a4 4 0 004-4V26l-4-6v-9",
    "M22 35h20",
    "M23 45c3-2 6-2 9 0s6 2 9 0",
  ],
  pack: [
    "M14 22h36v26a2 2 0 01-2 2H16a2 2 0 01-2-2V22Z",
    "M14 22l4-5h28l4 5",
    "M32 28v12",
    "M26 34h12",
    "M18 44h28",
  ],
  cap: [
    "M13 41c0-11 8.5-19 19-19s19 8 19 19",
    rr(13, 41, 38, 6, 2),
    "M22 25c-1.5 5-1.5 10 0 16",
    "M32 22.5V41",
    "M42 25c1.5 5 1.5 10 0 16",
  ],
  shoeCover: [
    "M12 48v-6c0-4 3-7 7-7h6c3 0 6-2 8-5l3-4c2-3 7-2.4 8 .8l3 9.2c2.4 1 4 3.2 4 6v6H12Z",
    "M12 48h40",
    "M20 35h9",
    "M44 40h6",
  ],
  wrap: [
    "M14 34a10 10 0 1120 0 10 10 0 01-20 0Z",
    "M18 34a6 6 0 112 4.4",
    "M34 34h17v12H24",
    "M34 38h13",
  ],
  case: [
    rr(12, 22, 40, 26, 4),
    "M24 22v-4a4 4 0 014-4h8a4 4 0 014 4v4",
    "M32 29v12",
    "M26 35h12",
  ],
  kit: [
    rr(10, 24, 44, 22, 3),
    "M32 30v10",
    "M27 35h10",
    "M16 36h6",
    "M42 30h6",
  ],
  cross: [rr(12, 12, 40, 40, 9), "M32 22v20", "M22 32h20"],
  pulse: [
    "M32 12a20 20 0 110 40 20 20 0 010-40Z",
    "M18 32h7l3-7 5 14 4-9 2 2h7",
  ],
  molecule: [
    "M32 16l13.9 8v16L32 48l-13.9-8V24L32 16Z",
    "M32 16v-5",
    "M45.9 24l4.3-2.5",
    "M45.9 40l4.3 2.5",
    "M32 48v5",
    "M18.1 40l-4.3 2.5",
    "M18.1 24l-4.3-2.5",
    "M32 12a3 3 0 100 6 3 3 0 100-6Z",
  ],
};

/* ── Single artifact icon ──────────────────────────────────────────── */

interface ArtifactProps {
  name: ArtifactName;
  className?: string;
  strokeWidth?: number;
  /** Animate paths drawing on when scrolled into view. */
  animated?: boolean;
  delay?: number;
}

export function Artifact({ name, className, strokeWidth = 1.7, animated = false, delay = 0 }: ArtifactProps) {
  const paths = ARTIFACT_PATHS[name];
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((d, i) =>
        animated ? (
          <motion.path
            key={i}
            d={d}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{
              pathLength: { duration: 1.1, delay: delay + i * 0.12, ease: "easeInOut" },
              opacity: { duration: 0.2, delay: delay + i * 0.12 },
            }}
          />
        ) : (
          <path key={i} d={d} />
        )
      )}
    </svg>
  );
}

/* ── Hero depth-of-field artifact field ────────────────────────────── */

/**
 * Three parallax layers of medical artifacts behind the hero.
 * Scroll-linked drift + idle float animation create the depth-of-field
 * illusion (far blurred → near crisp).
 */
export function HeroArtifactField() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const yFar = useTransform(scrollY, [0, 700], [0, 110]);
  const yMid = useTransform(scrollY, [0, 700], [0, 56]);
  const yNear = useTransform(scrollY, [0, 700], [0, -34]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* ── FAR plane: oversized, heavily blurred ── */}
      <motion.div style={reduceMotion ? undefined : { y: yFar }} className="absolute inset-0">
        <Artifact
          name="gown"
          className="animate-float-a absolute -start-24 top-10 h-80 w-80 text-brand-teal-pale opacity-[0.05] blur-2xl"
        />
        <Artifact
          name="pack"
          className="animate-float-c absolute -end-20 top-24 h-72 w-72 text-brand-teal-pale opacity-[0.06] blur-2xl"
        />
        <Artifact
          name="molecule"
          className="animate-float-b absolute start-1/3 -bottom-24 h-96 w-96 text-brand-champagne opacity-[0.05] blur-2xl"
        />
      </motion.div>

      {/* ── MID plane: soft focus, slow drift ── */}
      <motion.div style={reduceMotion ? undefined : { y: yMid }} className="absolute inset-0">
        <Artifact
          name="mask"
          className="animate-float-b absolute start-[6%] top-[12%] hidden h-28 w-28 text-brand-teal-pale opacity-[0.14] blur-md md:block"
        />
        <Artifact
          name="syringe"
          className="animate-float-a absolute end-[8%] top-[16%] h-24 w-24 text-brand-teal-pale opacity-[0.16] blur-[3px]"
        />
        <Artifact
          name="capsule"
          className="animate-float-c absolute start-[16%] bottom-[10%] hidden h-24 w-24 text-brand-champagne opacity-[0.13] blur-[3px] lg:block"
        />
        <Artifact
          name="glove"
          className="animate-float-b absolute end-[20%] bottom-[6%] hidden h-28 w-28 text-brand-teal-pale opacity-[0.12] blur-md lg:block"
        />
        <Artifact
          name="wrap"
          className="animate-float-a absolute start-[44%] top-[6%] hidden h-20 w-20 text-brand-teal-pale opacity-[0.14] blur-[3px] xl:block"
        />
      </motion.div>

      {/* ── NEAR plane: crisp details ── */}
      <motion.div style={reduceMotion ? undefined : { y: yNear }} className="absolute inset-0">
        <Artifact
          name="cross"
          className="animate-float-c absolute start-[3%] bottom-[24%] h-12 w-12 text-brand-teal-pale opacity-25 md:start-[8%]"
        />
        <Artifact
          name="pulse"
          className="animate-float-a absolute end-[4%] top-[8%] h-14 w-14 text-brand-teal-pale opacity-25 md:end-[10%]"
        />
        <Artifact
          name="vial"
          className="animate-float-b absolute end-[30%] bottom-[10%] hidden h-11 w-11 text-brand-champagne opacity-25 lg:block"
        />
        {/* Plus sparks — clinical constellation */}
        <span className="animate-float-b absolute start-[30%] top-[10%] h-2 w-2 rounded-[2px] bg-brand-teal-pale/40" />
        <span className="animate-float-c absolute end-[16%] bottom-[30%] h-1.5 w-1.5 rounded-full bg-brand-champagne/50" />
        <span className="animate-float-a absolute start-[55%] bottom-[16%] hidden h-2 w-2 rounded-[2px] bg-brand-teal-pale/30 lg:block" />
        <span className="animate-float-b absolute end-[38%] top-[38%] hidden h-1 w-1 rounded-full bg-brand-teal-pale/40 xl:block" />
      </motion.div>
    </div>
  );
}

/* ── Section artifact dressing (inner pages + light sections) ──────── */

/**
 * A restrained two-artifact dressing for section backgrounds.
 * `tone="dark"` for navy hero bands, `tone="light"` for content sections.
 */
export function SectionArtifactField({
  tone = "light",
  far = "molecule",
  near = "cross",
  className,
}: {
  tone?: "light" | "dark";
  far?: ArtifactName;
  near?: ArtifactName;
  className?: string;
}) {
  const farColor = tone === "dark" ? "text-brand-teal-pale opacity-[0.07] blur-2xl" : "text-brand-teal opacity-[0.07] blur-2xl";
  const nearColor = tone === "dark" ? "text-brand-teal-pale opacity-20" : "text-brand-teal opacity-[0.16]";
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <Artifact name={far} className={cn("animate-float-a absolute -end-16 -top-16 h-56 w-56", farColor)} />
      <Artifact name={near} className={cn("animate-float-b absolute -bottom-8 -start-6 h-28 w-28", nearColor)} />
    </div>
  );
}

/* ── Swiss precision seal ──────────────────────────────────────────── */

/**
 * Swiss-grade precision seal — redesigned in Wave 2.
 *
 * The previous version was a Swiss-flag red disc with a white cross, which
 * reads as a protected state emblem (Swiss coat-of-arms/Wappenschutz
 * exposure) when used bare beside credentials. The seal is now an
 * instrument-style reticle in the brand's teal: concentric engineering
 * rings, crosshair ticks and a centre point — the "Swiss precision"
 * metaphor, with no national-flag geometry. Red remains reserved for the
 * brand wordmark/logo, never as a bare cross on a red field.
 */
export function SwissSeal({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex items-center justify-center", className)} aria-hidden="true">
      <svg viewBox="0 0 48 48" className="h-full w-full">
        {/* Disc — deep teal, no national-flag geometry */}
        <circle cx="24" cy="24" r="22" className="fill-[var(--brand-teal)]" />
        <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-[color-mix(in_srgb,var(--brand-teal)_55%,white)]" />
        {/* Fine instrument ring */}
        <circle cx="24" cy="24" r="18" fill="none" stroke="white" strokeWidth="0.7" opacity="0.5" strokeDasharray="2.6 3.4" />
        {/* Crosshair ticks — N/E/S/W, outside the inner ring */}
        <g stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.95">
          <line x1="24" y1="3.5" x2="24" y2="9.5" />
          <line x1="24" y1="38.5" x2="24" y2="44.5" />
          <line x1="3.5" y1="24" x2="9.5" y2="24" />
          <line x1="38.5" y1="24" x2="44.5" y2="24" />
        </g>
        {/* Inner reticle cross — fine, instrument-style (not a flag cross) */}
        <g stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.8">
          <line x1="24" y1="17" x2="24" y2="31" />
          <line x1="17" y1="24" x2="31" y2="24" />
        </g>
        {/* Centre point + champagne accent for the house palette */}
        <circle cx="24" cy="24" r="2.4" fill="none" stroke="var(--brand-champagne)" strokeWidth="1.2" />
        <circle cx="24" cy="24" r="0.9" fill="white" />
      </svg>
    </span>
  );
}
