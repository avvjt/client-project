"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  partnershipSchema,
  type PartnershipFieldErrorCode,
  type PartnershipErrorCode,
} from "@/lib/partnership-schema";
import {
  PARTNERSHIP_FOCUS,
  PARTNERSHIP_TRACK_ROUTES,
  type PartnershipTrack,
} from "@/content/partnership";
import { getRecaptchaToken } from "@/lib/recaptcha-client";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<string, PartnershipFieldErrorCode>>;

interface FormState {
  organization: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  focus: string;
  message: string;
  consent: boolean;
}

const INITIAL: FormState = {
  organization: "",
  contactName: "",
  email: "",
  phone: "",
  country: "",
  focus: "",
  message: "",
  consent: false,
};

const FIELD_IDS: Record<PartnershipTrack, Record<string, string>> = {
  vendors: {
    focus: "ptr-vendors-focus",
    message: "ptr-vendors-message",
  },
  rnd: { focus: "ptr-rnd-focus", message: "ptr-rnd-message" },
  investors: { focus: "ptr-investors-focus", message: "ptr-investors-message" },
  aiTech: { focus: "ptr-aitech-focus", message: "ptr-aitech-message" },
};

function fieldId(track: PartnershipTrack, field: string): string {
  return FIELD_IDS[track][field] ?? `ptr-${track}-${field}`;
}

/**
 * Partnership intake form — one bespoke instance per modal track. State
 * lives inside the Radix portal content, so closing the modal unmounts the
 * form and the next opening always starts from a clean slate.
 */
function PartnershipForm({ track }: { track: PartnershipTrack }) {
  const { t, locale } = useI18n();
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<PartnershipErrorCode | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const startedAt = useRef<number>(Date.now());
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Per-track focus options: opaque values from the shared content module,
  // localized labels from the dictionary (same order, zipped by index).
  const focusOptions = PARTNERSHIP_FOCUS[track].map((value, i) => {
    const labels: Record<PartnershipTrack, readonly string[]> = {
      vendors: [
        t.partnerModal.focusVendors1,
        t.partnerModal.focusVendors2,
        t.partnerModal.focusVendors3,
        t.partnerModal.focusVendors4,
      ],
      rnd: [
        t.partnerModal.focusRnd1,
        t.partnerModal.focusRnd2,
        t.partnerModal.focusRnd3,
        t.partnerModal.focusRnd4,
      ],
      investors: [
        t.partnerModal.focusInvestors1,
        t.partnerModal.focusInvestors2,
        t.partnerModal.focusInvestors3,
        t.partnerModal.focusInvestors4,
      ],
      aiTech: [
        t.partnerModal.focusAiTech1,
        t.partnerModal.focusAiTech2,
        t.partnerModal.focusAiTech3,
        t.partnerModal.focusAiTech4,
      ],
    };
    return { value, label: labels[track][i] };
  });
  const focusLabel = focusOptions.find((o) => o.value === values.focus)?.label;

  const focusFieldLabel: Record<PartnershipTrack, string> = {
    vendors: t.partnerModal.focusVendors,
    rnd: t.partnerModal.focusRnd,
    investors: t.partnerModal.focusInvestors,
    aiTech: t.partnerModal.focusAiTech,
  };

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function errorMessage(field: string, code: PartnershipFieldErrorCode): string {
    switch (code) {
      case "REQUIRED":
        return t.rfq.errRequired;
      case "SHORT":
        return t.rfq.errShort;
      case "LONG":
        return t.rfq.errLong;
      case "EMAIL":
        return t.rfq.errEmail;
      case "CHOICE":
        return t.rfq.errChoice;
      case "CONSENT":
        return t.rfq.errConsent;
      default:
        return t.rfq.errRequired;
    }
  }

  /** Move keyboard focus to the first invalid field. */
  function focusFirstInvalid(fieldErrors: FieldErrors) {
    const firstKey = Object.keys(fieldErrors)[0];
    if (!firstKey) return;
    requestAnimationFrame(() => {
      document.getElementById(fieldId(track, firstKey))?.focus();
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    // Client-side validation with the shared schema.
    const parsed = partnershipSchema.safeParse({ ...values, track, locale });
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message as PartnershipFieldErrorCode;
      }
      setErrors(fieldErrors);
      focusFirstInvalid(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      // reCAPTCHA v3 (no-op token when the site key is not configured).
      const captchaToken = await getRecaptchaToken("partnership_submit");
      const res = await fetch("/api/partnership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          startedAt: String(startedAt.current),
          company_website: honeypotRef.current?.value ?? "", // honeypot — humans leave it empty
          recaptchaToken: captchaToken ?? "",
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        reference?: string;
        code?: PartnershipErrorCode;
        fields?: FieldErrors;
      };

      if (res.ok && json.ok && json.reference) {
        setReference(json.reference);
        return;
      }
      if (json.code === "VALIDATION" && json.fields) {
        setErrors(json.fields);
        focusFirstInvalid(json.fields);
      } else if (json.code) {
        setFormError(json.code);
      } else {
        setFormError("SERVER");
      }
    } catch {
      setFormError("SERVER");
    } finally {
      setSubmitting(false);
    }
  }

  const errProps = (field: string) =>
    errors[field]
      ? ({ "aria-invalid": true, "aria-describedby": `${fieldId(track, field)}-error` } as const)
      : {};

  function FieldError({ field }: { field: string }) {
    if (!errors[field]) return null;
    return (
      <p
        id={`${fieldId(track, field)}-error`}
        role="alert"
        className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium text-destructive"
      >
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {errorMessage(field, errors[field]!)}
      </p>
    );
  }

  /* ---------- Success state ---------- */
  if (reference) {
    return (
      <div
        className="rounded-xl border border-brand-teal/40 bg-secondary/60 p-6 text-center"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden="true" />
        <h4 className="mt-3 font-display text-lg font-bold">{t.partnerModal.successTitle}</h4>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t.partnerModal.successBody}
        </p>
        <div className="mx-auto mt-4 w-fit rounded-lg border border-border bg-background px-5 py-3">
          <p className="tech-value text-xs uppercase tracking-widest text-muted-foreground">
            {t.rfq.successRefLabel}
          </p>
          <p className="tech-value mt-1 text-lg font-semibold tracking-wide text-primary">
            {reference}
          </p>
        </div>
        <p className="tech-value mx-auto mt-3 max-w-sm text-xs text-muted-foreground">
          {t.rfq.referenceNote}
        </p>
        <DialogClose asChild>
          <Button variant="outline" className="mt-5 min-h-11">
            {t.common.close}
          </Button>
        </DialogClose>
      </div>
    );
  }

  /* ---------- Form ---------- */
  const inputCls = "min-h-11 bg-background";

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      {formError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
          <p className="text-sm font-medium text-destructive">
            {formError === "RATE_LIMITED"
              ? t.rfq.errRateLimited
              : formError === "CAPTCHA"
                ? t.rfq.errCaptcha
                : t.rfq.errServer}
          </p>
        </div>
      )}

      {/* Organization */}
      <div>
        <Label htmlFor={fieldId(track, "organization")}>{t.rfq.org} *</Label>
        <Input
          id={fieldId(track, "organization")}
          name="organization"
          autoComplete="organization"
          value={values.organization}
          onChange={(e) => set("organization", e.target.value)}
          placeholder={t.rfq.orgPlaceholder}
          className={cn(inputCls, "mt-1.5", errors.organization && "border-destructive")}
          {...errProps("organization")}
        />
        <FieldError field="organization" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Contact name */}
        <div>
          <Label htmlFor={fieldId(track, "contactName")}>{t.rfq.contactName} *</Label>
          <Input
            id={fieldId(track, "contactName")}
            name="contactName"
            autoComplete="name"
            value={values.contactName}
            onChange={(e) => set("contactName", e.target.value)}
            placeholder={t.rfq.contactNamePlaceholder}
            className={cn(inputCls, "mt-1.5", errors.contactName && "border-destructive")}
            {...errProps("contactName")}
          />
          <FieldError field="contactName" />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor={fieldId(track, "email")}>{t.rfq.email} *</Label>
          <Input
            id={fieldId(track, "email")}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder={t.rfq.emailPlaceholder}
            className={cn(inputCls, "mt-1.5", errors.email && "border-destructive")}
            {...errProps("email")}
          />
          <FieldError field="email" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Phone */}
        <div>
          <Label htmlFor={fieldId(track, "phone")}>
            {t.rfq.phone} <span className="text-muted-foreground">({t.common.optional})</span>
          </Label>
          <Input
            id={fieldId(track, "phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder={t.rfq.phonePlaceholder}
            className={cn(inputCls, "mt-1.5")}
          />
        </div>

        {/* Country */}
        <div>
          <Label htmlFor={fieldId(track, "country")}>{t.rfq.country} *</Label>
          <Input
            id={fieldId(track, "country")}
            name="country"
            autoComplete="country-name"
            value={values.country}
            onChange={(e) => set("country", e.target.value)}
            placeholder={t.rfq.countryPlaceholder}
            className={cn(inputCls, "mt-1.5", errors.country && "border-destructive")}
            {...errProps("country")}
          />
          <FieldError field="country" />
        </div>
      </div>

      {/* Focus — per-track select */}
      <div>
        <Label htmlFor={fieldId(track, "focus")}>{focusFieldLabel[track]} *</Label>
        <Select
          value={values.focus}
          onValueChange={(v) => {
            // Radix's hidden native <select> can emit an empty change while
            // its option list registers (closed content) — never let an empty
            // emission clobber a selected value.
            if (v) set("focus", v);
          }}
        >
          <SelectTrigger
            id={fieldId(track, "focus")}
            className={cn("mt-1.5 min-h-11 w-full", errors.focus && "border-destructive")}
            aria-invalid={Boolean(errors.focus)}
            aria-describedby={errors.focus ? `${fieldId(track, "focus")}-error` : undefined}
          >
            <SelectValue placeholder={t.rfq.selectPlaceholder}>{focusLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {focusOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError field="focus" />
      </div>

      {/* Message */}
      <div>
        <Label htmlFor={fieldId(track, "message")}>{t.partnerModal.messageLabel} *</Label>
        <Textarea
          id={fieldId(track, "message")}
          name="message"
          rows={4}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder={t.partnerModal.messagePlaceholder}
          className={cn("mt-1.5 bg-background", errors.message && "border-destructive")}
          {...errProps("message")}
        />
        <FieldError field="message" />
      </div>

      {/* Consent */}
      <div>
        <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-4">
          <Checkbox
            id={fieldId(track, "consent")}
            checked={values.consent}
            onCheckedChange={(checked) => set("consent", checked === true)}
            className="mt-0.5"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${fieldId(track, "consent")}-error` : undefined}
          />
          <div>
            <Label
              htmlFor={fieldId(track, "consent")}
              className="text-[13px] font-medium leading-relaxed"
            >
              {t.partnerModal.consent} *
            </Label>
            <FieldError field="consent" />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">{t.rfq.privacyNote}</p>
        <Button type="submit" variant="cta" size="lg" disabled={submitting} className="min-h-12 min-w-40">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t.rfq.submitting}
            </>
          ) : (
            t.partnerModal.submit
          )}
        </Button>
      </div>

      {/* Honeypot — hidden from humans, catches dumb bots */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={`${fieldId(track, "honeypot")}`}>Website</label>
        <input
          id={`${fieldId(track, "honeypot")}`}
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          ref={honeypotRef}
        />
      </div>
    </form>
  );
}

/**
 * Standalone modal portal for one "Partner with us" title. Fully
 * self-contained: trigger + portal content + per-track form + submit.
 * The portal renders into document.body (outside the footer DOM), with
 * focus trap, ESC close, aria-modal and scroll lock via Radix.
 */
export function PartnerModal({ track, label }: { track: PartnershipTrack; label: string }) {
  const { t } = useI18n();

  const copy: Record<PartnershipTrack, { title: string; intro: string }> = {
    vendors: { title: t.partnerModal.vendorsTitle, intro: t.partnerModal.vendorsIntro },
    rnd: { title: t.partnerModal.rndTitle, intro: t.partnerModal.rndIntro },
    investors: { title: t.partnerModal.investorsTitle, intro: t.partnerModal.investorsIntro },
    aiTech: { title: t.partnerModal.aiTechTitle, intro: t.partnerModal.aiTechIntro },
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          className="block w-full -my-1.5 py-1.5 text-start text-sm text-[#a9bac9] transition-colors hover:text-brand-teal-pale focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none"
        >
          {label}
        </button>
      </DialogTrigger>
      <DialogContent closeLabel={t.common.close} className="sm:max-w-xl">
        <div>
          <p className="tech-value text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            {t.footer.headingPartners}
          </p>
          <DialogTitle className="mt-1 text-xl">{copy[track].title}</DialogTitle>
          <DialogDescription className="mt-2">{copy[track].intro}</DialogDescription>
        </div>

        <PartnershipForm track={track} />

        {/* Full page remains reachable — the modal never replaces navigation. */}
        <div className="border-t border-border pt-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t.partnerModal.fullPage}{" "}
            <DialogClose asChild>
              <a
                href={PARTNERSHIP_TRACK_ROUTES[track]}
                className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
              >
                {label}
              </a>
            </DialogClose>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
