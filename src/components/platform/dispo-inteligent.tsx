"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Send, X } from "lucide-react";
import { LogoMark } from "@/components/platform/logo";
import { useI18n } from "@/lib/i18n/provider";
import { getRecaptchaToken } from "@/lib/recaptcha-client";
import { cn } from "@/lib/utils";

/**
 * Dispo Inteligent — the site-wide AI assistant.
 *
 * Behaviour contract:
 * - Every 7 s while the panel is closed, a "Did you know?" fact bubble rises
 *   beside the launcher and cycles through six medical-grade facts (translated).
 *   The interval suspends while the tab is hidden.
 * - The bubble opens the assistant on tap; dismissing it (X) or opening the
 *   chat stops the auto-trigger for the session — never nagging.
 * - Answers come from POST /api/chat (server-side LLM, grounded to verified
 *   company facts; no prices/MOQs/lead-times ever). 429 responses surface a
 *   dedicated, translated rate-limit message.
 * - Auto-trigger suppression: on conversion pages (RFQ / contact) the parent
 *   passes `suppressAutoTrigger` so the "Did you know?" bubble can never
 *   float over an active form's controls — the launcher remains available.
 * - WCAG 2.2: launcher is a labelled button with aria-expanded; the panel is a
 *   modal labelled dialog (aria-modal) with a Tab focus trap, Escape close and
 *   focus restoration to the launcher; message log is aria-live; Motion
 *   degrades under prefers-reduced-motion (MotionConfig reducedMotion="user").
 */
type Msg = { role: "user" | "assistant"; content: string };

const AUTO_TRIGGER_MS = 7000;
const BUBBLE_LIFETIME_MS = 6600;
const FACT_COUNT = 6;

export function DispoInteligent({
  suppressAutoTrigger = false,
}: {
  /** When true (RFQ / contact pages) the fact-bubble auto-trigger is muted
   *  and any visible bubble retires immediately — it must never cover the
   *  quotation form's controls. The launcher stays available. */
  suppressAutoTrigger?: boolean;
}) {
  const { t } = useI18n();

  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState<{ id: number; text: string } | null>(null);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const factIndex = useRef(0);
  const bubbleId = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const facts = [t.chat.fact1, t.chat.fact2, t.chat.fact3, t.chat.fact4, t.chat.fact5, t.chat.fact6];
  // The 7 s interval must never serve a stale captured array after a locale switch.
  const factsRef = useRef(facts);
  factsRef.current = facts;

  // Seed the greeting on first open (keeps SSR output deterministic).
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t.chat.greeting }]);
    }
  }, [open, messages.length, t.chat.greeting]);

  // Auto-trigger: a fresh fact bubble every 7 s while closed, not muted and
  // the tab is visible (no wake-ups or re-renders in background tabs).
  useEffect(() => {
    if (open || !autoEnabled || suppressAutoTrigger) return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      bubbleId.current += 1;
      const current = factsRef.current;
      setBubble({ id: bubbleId.current, text: current[factIndex.current % FACT_COUNT] });
      factIndex.current += 1;
    }, AUTO_TRIGGER_MS);
    return () => window.clearInterval(id);
  }, [open, autoEnabled, suppressAutoTrigger]);

  // On conversion pages, retire any bubble that is already on screen.
  useEffect(() => {
    if (suppressAutoTrigger) setBubble(null);
  }, [suppressAutoTrigger]);

  // Each bubble retires on its own after its lifetime.
  useEffect(() => {
    if (!bubble) return;
    const id = window.setTimeout(() => {
      setBubble((b) => (b?.id === bubble.id ? null : b));
    }, BUBBLE_LIFETIME_MS);
    return () => window.clearTimeout(id);
  }, [bubble]);

  // Keep the log pinned to the newest message.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, typing]);

  // Escape closes the dialog; Tab is trapped inside it (WCAG 2.4.3).
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && panel) {
        const focusables = panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);

  // Focus the input when the panel opens; restore focus to the launcher on close.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      return;
    }
    const panel = panelRef.current;
    const hadFocus = panel && document.activeElement instanceof Node && panel.contains(document.activeElement);
    if (hadFocus) launcherRef.current?.focus();
  }, [open]);

  const openAssistant = useCallback(() => {
    setBubble(null);
    setAutoEnabled(false);
    setOpen(true);
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, 1000);
      if (!text || typing) return;
      const history = messages.slice(-12).map((m) => ({ role: m.role, content: m.content }));
      setMessages((m) => [...m, { role: "user", content: text }]);
      setInput("");
      setTyping(true);
      try {
        // reCAPTCHA v3 (no-op token when the site key is not configured).
        const captchaToken = await getRecaptchaToken("chat_message");
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history, ...(captchaToken ? { recaptchaToken: captchaToken } : {}) }),
        });
        if (res.status === 429) {
          setMessages((m) => [...m, { role: "assistant", content: t.chat.rateLimited }]);
          return;
        }
        if (res.status === 403) {
          setMessages((m) => [...m, { role: "assistant", content: t.chat.captchaFailed }]);
          return;
        }
        const data: { reply?: string } = await res.json();
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.reply ?? t.chat.errGeneric },
        ]);
      } catch {
        setMessages((m) => [...m, { role: "assistant", content: t.chat.errGeneric }]);
      } finally {
        setTyping(false);
      }
    },
    [messages, typing, t.chat.errGeneric, t.chat.rateLimited, t.chat.captchaFailed]
  );

  return (
    <>
      {/* ── Fact bubble ── */}
      <AnimatePresence>
        {bubble && !open && (
          <motion.div
            key={bubble.id}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] end-4 z-40 w-[min(86vw,320px)]"
          >
            <div className="glass-panel glass-dark rounded-2xl p-4 shadow-2xl">
              <div className="flex items-start justify-between gap-2">
                <p className="tech-value text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-teal-pale">
                  {t.chat.factLabel}
                </p>
                {/* Dismiss = clear the visible bubble AND mute the auto-trigger.
                    (Previously only the trigger was muted, so the bubble
                    lingered for its full lifetime — the "close does nothing" bug.) */}
                <button
                  type="button"
                  onClick={() => {
                    setBubble(null);
                    setAutoEnabled(false);
                  }}
                  className="-me-1.5 -mt-1.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-[#8ba0b2] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-ring"
                  aria-label={t.chat.closeLabel}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                onClick={openAssistant}
                className="mt-1.5 block w-full text-start text-[13px] leading-relaxed text-[#d5e0ea] focus-visible:outline-2 focus-visible:outline-ring"
                aria-label={`${bubble.text} — ${t.chat.openFactLabel}`}
              >
                {bubble.text}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Assistant panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="liquid-glass liquid-glass-dark fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] end-4 z-50 flex w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl shadow-2xl"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.chat.name}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
              <LogoMark className="h-8 w-8" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-extrabold text-white">{t.chat.name}</p>
                <p className="tech-value truncate text-[10px] uppercase tracking-[0.18em] text-brand-teal-pale">
                  {t.chat.tagline}
                </p>
              </div>
              {/* 44px touch target with negative margins keeps the header compact */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-me-2 -mt-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-[#8ba0b2] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-ring"
                aria-label={t.chat.closeLabel}
              >
                <X className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
            </div>

            {/* Message log */}
            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              className="max-h-[46vh] min-h-[180px] flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-end gap-2",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {m.role === "assistant" && <LogoMark className="h-6 w-6 shrink-0" />}
                  <p
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-sm bg-brand-teal/25 text-white"
                        : "rounded-bl-sm bg-white/[0.08] text-[#dce6ef]",
                    )}
                  >
                    {m.content}
                  </p>
                </div>
              ))}
              {typing && (
                <div className="flex items-end gap-2">
                  <LogoMark className="h-6 w-6 shrink-0" />
                  <p
                    role="status"
                    className="rounded-2xl rounded-bl-sm bg-white/[0.08] px-3.5 py-2.5 text-[13px] text-[#8ba0b2]"
                  >
                    <span className="sr-only">{t.chat.typing}</span>
                    <span className="inline-flex gap-1" aria-hidden="true">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-teal-pale [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-teal-pale [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-teal-pale [animation-delay:300ms]" />
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="border-t border-white/10 bg-white/[0.03] px-3 py-3"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.chat.placeholder}
                  maxLength={1000}
                  className="h-11 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.06] px-3.5 text-[13px] text-white placeholder:text-[#7e93a6] focus-visible:border-brand-teal/50 focus-visible:outline-2 focus-visible:outline-ring"
                  aria-label={t.chat.placeholder}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-swiss text-white transition-colors hover:bg-brand-swiss/90 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-ring"
                  aria-label={t.chat.send}
                >
                  <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                </button>
              </div>
              <p className="tech-value mt-2 text-[11px] leading-relaxed text-[#93a7b8]">
                {t.chat.disclosure}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Launcher ── */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openAssistant())}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] end-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full shadow-2xl ring-2 ring-white/20 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-ring motion-safe:animate-[chat-glow_3s_ease-in-out_infinite]"
        aria-label={open ? t.chat.closeLabel : t.chat.openLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <LogoMark className="h-14 w-14 rounded-full" />
        {/* live dot */}
        <span
          className="absolute end-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-brand-navy bg-brand-teal-signal"
          aria-hidden="true"
        />
      </button>
    </>
  );
}
