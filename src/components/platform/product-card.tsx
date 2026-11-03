"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Artifact, type ArtifactName } from "@/components/platform/medical-artifacts";
import { useI18n } from "@/lib/i18n/provider";
import type { ProductFamily } from "@/content/products";

type FamilyNames = ReturnType<typeof useI18n>["t"]["products"]["familyNames"];

/** Product family → medical line-art service icon. */
const FAMILY_ARTIFACT: Record<ProductFamily["key"], ArtifactName> = {
  gowns: "gown",
  kits: "kit",
  masks: "mask",
  caps: "cap",
  shoeCovers: "shoeCover",
  wraps: "wrap",
  customPacks: "case",
};

/** Tilt limits — deliberately restrained: a clinical product surface, not a toy. */
const MAX_TILT_X = 5;
const MAX_TILT_Y = 6;

/** Catalogue card used on the homepage and in the product finder.
 *  Pointer-driven 3D tilt (perspective + rotate) with spring smoothing,
 *  enabled only for fine pointers and when the user allows motion. */
export function ProductCard({
  product,
  familyLabel,
  priority = false,
}: {
  product: ProductFamily;
  familyLabel: FamilyNames[keyof FamilyNames];
  priority?: boolean;
}) {
  const { t } = useI18n();
  const item = t.products.items[product.key];
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const tiltEnabled = finePointer && !reduceMotion;
  const rawRX = useMotionValue(0);
  const rawRY = useMotionValue(0);
  const rotateX = useSpring(rawRX, { stiffness: 240, damping: 24, mass: 0.6 });
  const rotateY = useSpring(rawRY, { stiffness: 240, damping: 24, mass: 0.6 });

  const onPointerMove = (e: React.PointerEvent) => {
    if (!tiltEnabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawRY.set(px * MAX_TILT_Y);
    rawRX.set(-py * MAX_TILT_X);
  };
  const resetTilt = () => {
    rawRX.set(0);
    rawRY.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
      style={{ rotateX, rotateY, transformPerspective: 950 }}
      whileHover={tiltEnabled ? { y: -4 } : undefined}
      className="group tab-glow-red relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xs"
    >
      <a
        href={`#/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted focus-visible:outline-2 focus-visible:outline-ring"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
        {/* Animated service line-art — draws on when scrolled into view */}
        <span className="glass-chip glass-dark-strong absolute bottom-2.5 end-2.5 rounded-lg p-2">
          <Artifact name={FAMILY_ARTIFACT[product.key]} animated className="h-7 w-7 text-brand-teal-pale" />
        </span>
      </a>
      <div className="flex flex-1 flex-col p-5">
        <Badge variant="secondary" className="tech-value w-fit text-[11px] font-semibold">
          {familyLabel}
        </Badge>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug">
          <a
            href={`#/products/${product.slug}`}
            className="rounded-sm after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-ring"
          >
            {item.name}
          </a>
        </h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{item.short}</p>
        <p className="tech-value mt-3 text-xs text-muted-foreground">{t.common.specsOnRequest}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {t.common.viewDetails}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </motion.article>
  );
}
