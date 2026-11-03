"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroArtifactField, Artifact, SwissSeal } from "@/components/platform/medical-artifacts";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export type HeroFilm = { src: string; alt: string };

const SCENE_MS = 6500;

/**
 * ECG pulse path — one continuous heartbeat trace, ~1240 units wide,
 * clipped by the hero frame. Used both for the drawn line and the
 * travelling glow dot (CSS Motion Path).
 */
const ECG_PATH =
  "M0 60 h20 l14 -30 20 58 16 -42 10 14 h78 l14 -30 20 58 16 -42 10 14 h78 l14 -30 20 58 16 -42 10 14 h78 l14 -30 20 58 16 -42 10 14 h78 l14 -30 20 58 16 -42 10 14 h78 l14 -30 20 58 16 -42 10 14 h78 l14 -30 20 58 16 -42 10 14 h78 l14 -30 20 58 16 -42 10 14 h78";

/**
 * IMMERSIVE HERO — "the whole frame is the film".
 *
 * Wave 2 redesign brief: replace the boxed square hero media with a
 * hypercreative, cinematic experience while keeping Swiss discipline:
 *
 * - The five-frame film loop is rendered FULL-BLEED behind the entire hero.
 *   Cuts are motion-blur dissolves (opacity + blur + scale), active frames
 *   hold a slow Ken Burns drift — the same physics as the product carousel.
 * - The headline rides on a glass panel over a directional navy scrim, so
 *   text contrast (WCAG) never depends on the photo beneath it.
 * - A scene rail replaces the old slide selector: five labelled scene keys
 *   (SC 01–05) with a progress underline for the dwell timer.
 * - A precision HUD (rotating reticle ring around the Swiss-grade seal) and
 *   an ECG pulse line drawn across the bottom edge keep the medical-instrument
 *   language alive.
 * - Accessibility: full pause/play control (2.2.2), hover/focus pause,
 *   background-tab suspension, `prefers-reduced-motion` gets a plain fade
 *   with no auto-advance/blur/zoom/ECG motion. Scene keys are 44px targets.
 */
export function ImmersiveHero({ slides }: { slides: HeroFilm[] }) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const effectivePause = paused || userPaused || reducedMotion;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (effectivePause) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      setActive((a) => (a + 1) % slides.length);
    }, SCENE_MS);
    return () => window.clearInterval(id);
  }, [effectivePause, slides.length, active]);

  const resume = () => {
    setPaused(false);
    setCycle((c) => c + 1);
  };
  const toggleUserPause = () => {
    const next = !userPaused;
    setUserPaused(next);
    if (!next) setCycle((c) => c + 1);
  };

  const trustItems = [t.home.trust1, t.home.trust2, t.home.trust3, t.home.trust4];

  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-brand-navy text-white">
      {/* ── L0 · blueprint grid ── */}
      <div className="absolute inset-0 bg-blueprint-dark" aria-hidden="true" />

      {/* ── L1 · full-bleed background film ── */}
      <div aria-hidden="false">
        {slides.map((slide, i) => {
          const isActive = i === active;
          return (
            <div
              key={slide.src}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 ease-in-out will-change-[opacity,filter,transform]",
                reducedMotion
                  ? "transition-[opacity] duration-300"
                  : "transition-[opacity,filter,transform] duration-[1700ms]",
                isActive
                  ? "z-10 scale-100 opacity-100 blur-0"
                  : reducedMotion
                    ? "z-0 opacity-0"
                    : "z-0 scale-[1.06] opacity-0 blur-[14px]",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0",
                  isActive && !reducedMotion && "animate-[kenburns_9s_ease-out_forwards]",
                )}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── L2 · scrims — left-heavy for guaranteed text contrast ── */}
      <div
        className="absolute inset-0 z-20 bg-gradient-to-r from-brand-navy/95 via-brand-navy/75 to-brand-navy/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 z-20 h-72 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-brand-navy/80 to-transparent"
        aria-hidden="true"
      />

      {/* ── L3 · depth-of-field artifacts ── */}
      <div className="pointer-events-none absolute inset-0 z-20 opacity-70" aria-hidden="true">
        <HeroArtifactField />
      </div>

      {/* ── L4 · ECG pulse line across the bottom edge ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden md:block" aria-hidden="true">
        <svg
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          className="h-24 w-full"
        >
          <path
            d={ECG_PATH}
            fill="none"
            stroke="var(--brand-teal-pale)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
            strokeDasharray="1200"
            className="motion-safe:animate-[ecg-run_7s_linear_infinite]"
          />
          {/* travelling glow dot (CSS Motion Path; degrades silently) */}
          <circle
            r="3"
            fill="var(--brand-champagne)"
            className="motion-safe:animate-[ecg-dot_7s_linear_infinite]"
            style={{ offsetPath: `path("${ECG_PATH}")`, offsetRotate: "0deg" } as React.CSSProperties}
          />
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="relative z-30 mx-auto flex min-h-[92svh] w-full max-w-7xl flex-col justify-center px-4 pb-32 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12">
          {/* ── GLASS PANEL — headline, CTAs, precision line ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="glass-panel glass-dark relative rounded-3xl p-6 sm:p-8 lg:p-10">
              <div className="glass-edge-glow rounded-3xl" aria-hidden="true" />

              <Badge
                variant="outline"
                className="tech-value max-w-full whitespace-normal break-words border-brand-teal/40 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-brand-teal-pale"
              >
                {t.home.heroBadge}
              </Badge>
              <h1 className="text-fluid-hero mt-5 font-display font-extrabold">
                {t.home.heroTitleA}{" "}
                <span className="text-brand-teal-pale">{t.home.heroTitleB}</span>{" "}
                {t.home.heroTitleC}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#b6c5d4] sm:text-lg">
                {t.home.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild variant="cta" size="lg" className="min-h-12 px-6 text-[15px]">
                  <a href="#/products">
                    {t.home.heroCtaPrimary}
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-h-12 border-white/25 bg-transparent px-6 text-[15px] text-white hover:bg-white/10 hover:text-white"
                >
                  <a href="#/rfq">{t.home.heroCtaSecondary}</a>
                </Button>
              </div>

              {/* Swiss-grade precision line — redesigned reticle seal */}
              <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
                <SwissSeal className="h-10 w-10 shrink-0" />
                <div className="min-w-0">
                  <p className="tech-value text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-teal-pale">
                    {t.method.eyebrow}
                  </p>
                  <a
                    href="#/company"
                    className="mt-0.5 inline-block text-[13px] font-medium text-[#c9d6e2] underline-offset-4 hover:text-white hover:underline"
                  >
                    {t.home.swissCta}
                    <ArrowRight className="ms-1 inline h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* Trust strip — verified facts only, floating on glass */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="mt-6 lg:mt-8"
            >
              <dl className="glass-chip glass-dark-strong grid grid-cols-2 gap-px overflow-hidden rounded-xl sm:grid-cols-4">
                {trustItems.map((item) => (
                  <div key={item} className="px-4 py-3.5">
                    <dt className="sr-only">{item}</dt>
                    <dd className="flex items-center gap-2 text-[13px] font-semibold leading-snug text-[#d5e0ea]">
                      <Artifact name="cross" className="h-3.5 w-3.5 shrink-0 text-brand-teal-pale/80" strokeWidth={2} />
                      <span className="min-w-0">{item}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </motion.div>

          {/* ── SCENE RAIL + HUD — the right stage ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="relative flex flex-col items-start gap-5 lg:items-end"
          >
            {/* Precision HUD — rotating reticle ring around the seal */}
            <div className="pointer-events-none absolute -top-24 end-0 hidden xl:block" aria-hidden="true">
              <div className="relative h-36 w-36">
                <div className="absolute inset-0 rounded-full border border-dashed border-brand-teal-pale/25 motion-safe:animate-[seal-rotate_60s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-brand-champagne/20 motion-safe:animate-[seal-rotate_90s_linear_infinite_reverse]" />
                <SwissSeal className="absolute inset-0 m-auto h-16 w-16 opacity-90" />
              </div>
            </div>

            {/* Scene rail — five labelled scene keys with dwell progress */}
            <div
              className="glass-chip glass-dark-strong w-full max-w-md rounded-2xl p-4 lg:max-w-sm"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={resume}
              onFocus={() => setPaused(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resume();
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="tech-value text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-teal-pale">
                  {t.home.heroSceneRailLabel}
                </p>
                {/* Explicit pause/play control (WCAG 2.2.2) */}
                <button
                  type="button"
                  onClick={toggleUserPause}
                  aria-pressed={userPaused}
                  aria-label={userPaused ? t.a11y.playCarousel : t.a11y.pauseCarousel}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[#c9d6e2] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {userPaused ? (
                    <Play className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                  ) : (
                    <Pause className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-5 gap-2">
                {slides.map((slide, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={slide.src}
                      type="button"
                      aria-label={t.home.heroSlideLabel.replace("{n}", String(i + 1)).replace("{total}", String(slides.length))}
                      aria-current={isActive}
                      onClick={() => setActive(i)}
                      className="group relative inline-flex min-h-11 flex-col justify-end rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <span
                        className={cn(
                          "relative block aspect-[16/10] w-full overflow-hidden rounded-md ring-1 transition-all",
                          isActive
                            ? "ring-brand-teal-pale/80 shadow-[0_0_18px_rgba(115,216,205,0.25)]"
                            : "ring-white/20 opacity-60 group-hover:opacity-90 group-focus-visible:opacity-90",
                        )}
                      >
                        <Image
                          src={slide.src}
                          alt=""
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      </span>
                      <span
                        className={cn(
                          "tech-value mt-1 block text-[9px] font-semibold tracking-[0.18em]",
                          isActive ? "text-brand-teal-pale" : "text-[#8ba0b2]",
                        )}
                      >
                        SC 0{i + 1}
                      </span>
                      {/* dwell progress underline */}
                      <span className="mt-0.5 block h-[2px] w-full overflow-hidden rounded-full bg-white/15">
                        <span
                          key={`${i}-cycle-${cycle}`}
                          className={cn(
                            "block h-full w-full origin-left rounded-full rtl:origin-right",
                            isActive &&
                              (reducedMotion
                                ? "scale-x-100 bg-brand-teal-pale"
                                : `animate-[carousel-fill_6500ms_linear_forwards] bg-brand-teal-pale${
                                    effectivePause ? " [animation-play-state:paused]" : ""
                                  }`),
                          )}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="tech-value mt-3 text-[10px] leading-relaxed text-[#9fb2c4]">
                {t.common.illustrativeImageNote}
              </p>
            </div>

            {/* Floating artifact chip — larger cinematic companion */}
            <div
              className="glass-chip glass-dark-strong hidden items-center gap-3 rounded-xl px-4 py-3 sm:flex"
              aria-hidden="true"
            >
              <Artifact name="mask" animated className="h-9 w-9 text-brand-teal-pale" />
              <Artifact name="syringe" animated delay={0.3} className="h-8 w-8 text-brand-champagne" />
              <Artifact name="pulse" animated delay={0.5} className="h-8 w-8 text-brand-teal-pale/80" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
