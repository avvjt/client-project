"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export type HeroSlide = { src: string; alt: string };

const SLIDE_MS = 6500;

/**
 * Cinematic hero carousel — a five-frame film loop.
 *
 * Motion language: each cut is a motion-blur crossfade — the outgoing frame
 * dissolves while drifting out of focus (opacity→0, blur 0→10px, scale up),
 * the incoming frame resolves into focus (blur 10px→0, settle to scale 1),
 * then holds with a slow Ken Burns drift. Progress is shown as a film-strip
 * of thin fill bars.
 *
 * Accessibility contract (WCAG 2.2):
 * - a visible pause/play control governs auto-advance (2.2.2); auto-advance
 *   additionally pauses on hover and whenever focus enters the frame
 * - auto-advance suspends while the tab is hidden
 * - with `prefers-reduced-motion: reduce` there is no auto-advance, no blur,
 *   no zoom — manual selection is a short plain crossfade
 * - inactive frames are `aria-hidden`; indicator buttons are keyboard
 *   operable with translated labels and meet the 24×24 px target minimum
 */
export function CinematicHeroCarousel({
  slides,
  slideLabel,
  children,
  className,
  tone = "dark",
}: {
  slides: HeroSlide[];
  /** Template: "Show image {n} of {total}" (pre-translated). */
  slideLabel: string;
  /** Overlays rendered above the frames (gradient, chips, notes). */
  children?: ReactNode;
  className?: string;
  /** "dark" = navy hero frame; "light" = on light sections (neutral border). */
  tone?: "dark" | "light";
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { t } = useI18n();

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
    // Recreated on every `active` change, so a manual selection earns a full dwell.
    const id = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      setActive((a) => (a + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [effectivePause, slides.length, active]);

  // Every resume (hover-leave or play button) grants a fresh full dwell and
  // restarts the fill bar so animation and timer stay in sync.
  const resume = () => {
    setPaused(false);
    setCycle((c) => c + 1);
  };
  const toggleUserPause = () => {
    const next = !userPaused;
    setUserPaused(next);
    if (!next) setCycle((c) => c + 1);
  };

  return (
    <div
      className={cn(
        "relative aspect-[16/11] overflow-hidden rounded-2xl shadow-2xl",
        tone === "dark" ? "border border-white/15" : "border border-border bg-card",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={resume}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resume();
      }}
    >
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
                  : "z-0 scale-[1.06] opacity-0 blur-[10px]",
            )}
          >
            <div
              className={cn(
                "absolute inset-0",
                isActive && !reducedMotion && "animate-[kenburns_8s_ease-out_forwards]",
              )}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
            </div>
          </div>
        );
      })}

      {children}

      {/* Film-strip progress — each bar also acts as a slide selector */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-1.5 pb-3.5">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={slideLabel.replace("{n}", String(i + 1)).replace("{total}", String(slides.length))}
            aria-current={i === active}
            onClick={() => setActive(i)}
            className="group inline-flex min-h-11 min-w-11 items-end justify-center px-1 py-3"
          >
            <span className="block h-[3px] w-9 overflow-hidden rounded-full bg-white/25 shadow-[0_0_0_1px_rgba(11,23,38,0.25)] transition-colors group-hover:bg-white/50 group-focus-visible:ring-1 group-focus-visible:ring-white/70">
              <span
                key={`${i}-cycle-${cycle}`}
                className={cn(
                  "block h-full w-full origin-left rounded-full bg-white/40 rtl:origin-right",
                  i === active &&
                    (reducedMotion
                      ? "scale-x-100 bg-brand-teal-pale"
                      : `animate-[carousel-fill_6500ms_linear_forwards] bg-brand-teal-pale${
                          effectivePause ? " [animation-play-state:paused]" : ""
                        }`),
                )}
              />
            </span>
          </button>
        ))}
      </div>

      {/* Explicit pause/play control (WCAG 2.2.2) — hover-pause alone is not enough */}
      <button
        type="button"
        onClick={toggleUserPause}
        aria-pressed={userPaused}
        aria-label={userPaused ? t.a11y.playCarousel : t.a11y.pauseCarousel}
        className="absolute bottom-3 end-3 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-ring"
      >
        {userPaused ? (
          <Play className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
        ) : (
          <Pause className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
