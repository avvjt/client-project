"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CORRIDOR_FLAGS, Flag, type FlagCode } from "@/components/platform/flags";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * CorridorFacts — five market-orientation notes per corridor, staged as an
 * immersive "route dossier": the active corridor's flag floats as a
 * watermark behind the dossier and the flag rail above selects the
 * corridor (management request: country + flag sit ABOVE the facts only —
 * the mirrored ribbon below and the disclaimer seal were removed).
 *
 * Interaction model (WCAG 2.2):
 * - The corridor selector is a proper tab list (roving tabindex, arrow-key
 *   navigation, Home/End, RTL-aware arrow direction) over the flag chips.
 * - Switching corridors crossfades the panel with a motion-blur dissolve —
 *   the outgoing list blurs and drifts up while the incoming list resolves
 *   into focus, then each fact settles in with a short stagger.
 * - All motion is motion-safe: `prefers-reduced-motion` gets a plain fade
 *   with no blur, no stagger, no watermark drift.
 * - Copy discipline: every fact is qualitative public-market knowledge.
 *   No statistics, no financial figures, no claim of established operations.
 */

const FACTS_PER_CORRIDOR = 5;

type CorridorKey = (typeof CORRIDOR_FLAGS)[number]["key"];

function factsFor(t: ReturnType<typeof useI18n>["t"], key: CorridorKey): string[] {
  const home = t.home as unknown as Record<string, string>;
  return Array.from(
    { length: FACTS_PER_CORRIDOR },
    (_, i) => home[`corridorFacts${key}${i + 1}`]
  );
}

export function CorridorFacts({ className }: { className?: string }) {
  const { t, locale } = useI18n();
  const isRtl = locale === "ar";
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const total = CORRIDOR_FLAGS.length;
  const activeCorridor = CORRIDOR_FLAGS[active];

  /** RTL-aware arrow-key tab navigation (roving tabindex). */
  function onTabKeyDown(e: React.KeyboardEvent, index: number) {
    const next = isRtl
      ? { prev: "ArrowRight", nextKey: "ArrowLeft" }
      : { prev: "ArrowLeft", nextKey: "ArrowRight" };
    let target: number | null = null;
    if (e.key === next.nextKey) target = (index + 1) % total;
    else if (e.key === next.prev) target = (index - 1 + total) % total;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = total - 1;
    if (target === null) return;
    e.preventDefault();
    setActive(target);
    document.getElementById(`corridor-tab-${CORRIDOR_FLAGS[target].key}`)?.focus();
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-gradient-to-b from-secondary/70 to-card p-4 shadow-sm sm:p-6",
        className
      )}
    >
      {/* Watermark — the active corridor's flag, drifting out of focus */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCorridor.key}-${locale}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, filter: "blur(10px)" }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04, filter: "blur(10px)" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute -end-10 -top-14"
          >
            <Flag code={activeCorridor.flag as FlagCode} className="h-44 w-66 opacity-[0.055] dark:opacity-[0.08]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg font-extrabold leading-snug">{t.home.corridorFactsTitle}</h3>
        <span className="tech-value text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {active + 1} / {total}
        </span>
      </div>

      {/* Corridor tab rail — flags are the selectors (flags ABOVE the facts) */}
      <div
        role="tablist"
        aria-label={t.home.corridorFactsTitle}
        className="relative mt-4 flex flex-wrap gap-1.5 border-b border-border pb-3"
      >
        {CORRIDOR_FLAGS.map((c, i) => {
          const name = (t.home as unknown as Record<string, string>)[`corridor${c.key}`];
          const selected = i === active;
          return (
            <button
              key={c.key}
              id={`corridor-tab-${c.key}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="corridor-facts-panel"
              tabIndex={selected ? 0 : -1}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              onClick={() => setActive(i)}
              title={t.home.corridorFactsTabLabel.replace("{name}", name)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-md border px-2.5 py-1.5 transition-all focus-visible:outline-2 focus-visible:outline-ring",
                selected
                  ? "border-brand-teal/60 bg-accent shadow-sm"
                  : "border-border bg-card hover:border-brand-teal/40 hover:bg-accent/50"
              )}
            >
              <Flag code={c.flag as FlagCode} />
              <span
                className={cn(
                  "tech-value text-[10px] font-semibold uppercase tracking-[0.14em]",
                  selected ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Facts panel — motion-blur crossfade between corridors */}
      <div
        id="corridor-facts-panel"
        role="tabpanel"
        aria-labelledby={`corridor-tab-${activeCorridor.key}`}
        tabIndex={0}
        className="scroll-slim relative mt-3 max-h-72 overflow-y-auto pr-1"
      >
        <ol key={`${activeCorridor.key}-${locale}`} className="space-y-2.5">
          {factsFor(t, activeCorridor.key).map((fact, i) =>
            reduced ? (
              <li key={i} className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 px-3.5 py-2.5">
                <span
                  className="tech-value mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="text-[13px] leading-relaxed">{fact}</span>
              </li>
            ) : (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.09, ease: "easeOut" }}
                className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 px-3.5 py-2.5"
              >
                <span
                  className="tech-value mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="text-[13px] leading-relaxed">{fact}</span>
              </motion.li>
            )
          )}
        </ol>
      </div>

      <p className="tech-value relative mt-3 text-[11px] leading-relaxed text-muted-foreground">
        {t.home.corridorFactsNote}
      </p>
    </div>
  );
}
