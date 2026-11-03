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
  aiInquirySchema,
  investorInquirySchema,
  supplyInquirySchema,
  vendorInquirySchema,
  type InquiryFieldErrorCode,
  type InquiryErrorCode,
} from "@/lib/inquiry-schema";
import {
  INQUIRY_AI_DOMAINS,
  INQUIRY_AI_STAGES,
  INQUIRY_INVESTOR_FOCUS,
  INQUIRY_INVESTOR_HORIZON,
  INQUIRY_MARKET_OTHER,
  INQUIRY_MARKETS,
  INQUIRY_OUTSIDE_INDIA,
  INQUIRY_SUPPLY_SECTORS,
  INQUIRY_VENDOR_CATEGORIES,
  INQUIRY_VENDOR_STAGES,
  INQUIRY_VENDOR_STATES,
  INDIAN_REGION_LABELS,
  type InquiryTrack,
} from "@/content/inquiry";
import { Flag, MARKET_FLAG_LABELS, type FlagCode } from "@/components/platform/flags";
import { getRecaptchaToken } from "@/lib/recaptcha-client";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Shared machinery                                                    */
/* ------------------------------------------------------------------ */

type FieldErrors = Partial<Record<string, InquiryFieldErrorCode>>;

interface FormState {
  organization: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  market: string;
  marketOther: string;
  focus: string;
  horizon: string;
  stage: string;
  narrative: string;
  vision: string;
  link: string;
  consent: boolean;
}

const INITIAL: FormState = {
  organization: "",
  contactName: "",
  email: "",
  phone: "",
  country: "",
  state: "",
  market: "",
  marketOther: "",
  focus: "",
  horizon: "",
  stage: "",
  narrative: "",
  vision: "",
  link: "",
  consent: false,
};

const SCHEMAS = {
  investor: investorInquirySchema,
  ai: aiInquirySchema,
  vendor: vendorInquirySchema,
  supply: supplyInquirySchema,
} as const;

function fieldId(track: InquiryTrack, field: string): string {
  return `inq-${track}-${field}`;
}

interface Option {
  value: string;
  label: string;
  flag?: FlagCode;
}

/** Zip opaque tokens with localized labels by index (careers-modal pattern). */
function zipOptions(tokens: readonly string[], labels: string[]): Option[] {
  return tokens.map((value, i) => ({ value, label: labels[i] ?? value }));
}

/**
 * Build the exact per-track payload. Each track's schema defines its own
 * shape; unknown fields are never sent.
 */
function payloadFor(
  track: InquiryTrack,
  values: FormState,
  locale: string
): Record<string, unknown> {
  if (track === "supply") {
    return {
      track,
      organization: values.organization,
      contactName: values.contactName,
      email: values.email,
      phone: values.phone,
      focus: values.focus,
      market: values.market,
      marketOther: values.marketOther,
      narrative: values.narrative,
      vision: values.vision,
      link: values.link,
      consent: values.consent,
      locale,
    };
  }
  return {
    track,
    organization: values.organization,
    contactName: values.contactName,
    email: values.email,
    phone: values.phone,
    country: values.country,
    focus: values.focus,
    ...(track === "investor" ? { horizon: values.horizon } : { stage: values.stage }),
    ...(track === "vendor" ? { state: values.state } : {}),
    narrative: values.narrative,
    vision: values.vision,
    link: values.link,
    consent: values.consent,
    locale,
  };
}

/* ------------------------------------------------------------------ */
/* The shared form                                                     */
/* ------------------------------------------------------------------ */

function InquiryForm({ track }: { track: InquiryTrack }) {
  const { t, locale } = useI18n();
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<InquiryErrorCode | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const startedAt = useRef<number>(Date.now());
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const honeypotRef = useRef<HTMLInputElement>(null);

  /* ---- per-track copy ---- */
  const copy = (() => {
    switch (track) {
      case "investor":
        return {
          focusLabel: t.investorModal.focusLabel,
          focusOptions: zipOptions(INQUIRY_INVESTOR_FOCUS, [
            t.investorModal.focus1,
            t.investorModal.focus2,
            t.investorModal.focus3,
            t.investorModal.focus4,
          ]),
          stageLabel: t.investorModal.horizonLabel,
          stageOptions: zipOptions(INQUIRY_INVESTOR_HORIZON, [
            t.investorModal.horizon1,
            t.investorModal.horizon2,
            t.investorModal.horizon3,
            t.investorModal.horizon4,
          ]),
          narrativeLabel: t.investorModal.narrativeLabel,
          narrativePlaceholder: t.investorModal.narrativePlaceholder,
          visionLabel: t.investorModal.visionLabel,
          visionPlaceholder: t.investorModal.visionPlaceholder,
          linkLabel: t.investorModal.linkLabel,
          linkPlaceholder: t.investorModal.linkPlaceholder,
          consent: t.investorModal.consent,
          privacyNote: t.investorModal.privacyNote,
          submit: t.investorModal.submit,
          successTitle: t.investorModal.successTitle,
          successBody: t.investorModal.successBody,
          emailNote: t.investorModal.emailNote,
        };
      case "ai":
        return {
          focusLabel: t.aiModal.domainLabel,
          focusOptions: zipOptions(INQUIRY_AI_DOMAINS, [
            t.aiModal.domain1,
            t.aiModal.domain2,
            t.aiModal.domain3,
            t.aiModal.domain4,
            t.aiModal.domain5,
          ]),
          stageLabel: t.aiModal.stageLabel,
          stageOptions: zipOptions(INQUIRY_AI_STAGES, [
            t.aiModal.stage1,
            t.aiModal.stage2,
            t.aiModal.stage3,
            t.aiModal.stage4,
          ]),
          narrativeLabel: t.aiModal.narrativeLabel,
          narrativePlaceholder: t.aiModal.narrativePlaceholder,
          visionLabel: t.aiModal.visionLabel,
          visionPlaceholder: t.aiModal.visionPlaceholder,
          linkLabel: t.aiModal.linkLabel,
          linkPlaceholder: t.aiModal.linkPlaceholder,
          consent: t.aiModal.consent,
          privacyNote: t.aiModal.privacyNote,
          submit: t.aiModal.submit,
          successTitle: t.aiModal.successTitle,
          successBody: t.aiModal.successBody,
          emailNote: t.aiModal.emailNote,
        };
      case "vendor":
        return {
          focusLabel: t.vendorModal.categoryLabel,
          focusOptions: zipOptions(INQUIRY_VENDOR_CATEGORIES, [
            t.vendorModal.category1,
            t.vendorModal.category2,
            t.vendorModal.category3,
            t.vendorModal.category4,
          ]),
          stageLabel: t.vendorModal.stageLabel,
          stageOptions: zipOptions(INQUIRY_VENDOR_STAGES, [
            t.vendorModal.stage1,
            t.vendorModal.stage2,
            t.vendorModal.stage3,
            t.vendorModal.stage4,
          ]),
          narrativeLabel: t.vendorModal.narrativeLabel,
          narrativePlaceholder: t.vendorModal.narrativePlaceholder,
          visionLabel: t.vendorModal.visionLabel,
          visionPlaceholder: t.vendorModal.visionPlaceholder,
          linkLabel: t.vendorModal.linkLabel,
          linkPlaceholder: t.vendorModal.linkPlaceholder,
          consent: t.vendorModal.consent,
          privacyNote: t.vendorModal.privacyNote,
          submit: t.vendorModal.submit,
          successTitle: t.vendorModal.successTitle,
          successBody: t.vendorModal.successBody,
          emailNote: t.vendorModal.emailNote,
        };
      case "supply":
        return {
          focusLabel: t.supplyModal.sectorLabel,
          focusOptions: zipOptions(INQUIRY_SUPPLY_SECTORS, [
            t.supplyModal.sector1,
            t.supplyModal.sector2,
            t.supplyModal.sector3,
            t.supplyModal.sector4,
            t.supplyModal.sector5,
            t.supplyModal.sector6,
            t.supplyModal.sector7,
          ]),
          stageLabel: "",
          stageOptions: [],
          narrativeLabel: t.supplyModal.narrativeLabel,
          narrativePlaceholder: t.supplyModal.narrativePlaceholder,
          visionLabel: t.supplyModal.visionLabel,
          visionPlaceholder: t.supplyModal.visionPlaceholder,
          linkLabel: t.supplyModal.linkLabel,
          linkPlaceholder: t.supplyModal.linkPlaceholder,
          consent: t.supplyModal.consent,
          privacyNote: t.supplyModal.privacyNote,
          submit: t.supplyModal.submit,
          successTitle: t.supplyModal.successTitle,
          successBody: t.supplyModal.successBody,
          emailNote: t.supplyModal.emailNote,
        };
    }
  })();

  const focusLabel = copy.focusOptions.find((o) => o.value === values.focus)?.label;
  const stageLabel = copy.stageOptions.find((o) => o.value === values.stage)?.label;

  /* ---- state select (vendor only): all Indian states + UTs ---- */
  const stateOptions: Option[] = [
    ...zipOptions(INQUIRY_VENDOR_STATES, [...INDIAN_REGION_LABELS]),
    { value: INQUIRY_OUTSIDE_INDIA, label: t.vendorModal.outsideIndia },
  ];
  const stateLabel = stateOptions.find((o) => o.value === values.state)?.label;

  /* ---- market select (supply only): country name + flag ---- */
  const marketOptions: Option[] = [
    ...INQUIRY_MARKETS.map((m) => ({
      value: m.token,
      label: MARKET_FLAG_LABELS[m.flag],
      flag: m.flag,
    })),
    { value: INQUIRY_MARKET_OTHER, label: t.supplyModal.marketOtherOption },
  ];
  const marketOption = marketOptions.find((o) => o.value === values.market);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function errorMessage(field: string, code: InquiryFieldErrorCode): string {
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
      case "URL":
        return t.rfq.errUrl;
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

    // Client-side validation with the shared per-track schema.
    const parsed = SCHEMAS[track].safeParse(payloadFor(track, values, locale));
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message as InquiryFieldErrorCode;
      }
      setErrors(fieldErrors);
      focusFirstInvalid(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      // reCAPTCHA v3 (no-op token when the site key is not configured).
      const captchaToken = await getRecaptchaToken("inquiry_submit");
      const res = await fetch("/api/inquiry", {
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
        code?: InquiryErrorCode;
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
        <h4 className="mt-3 font-display text-lg font-bold">{copy.successTitle}</h4>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {copy.successBody}
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

  const selectProps = (field: keyof FormState, hasError: boolean) => ({
    id: fieldId(track, field),
    className: cn("mt-1.5 min-h-11 w-full", hasError && "border-destructive"),
    "aria-invalid": Boolean(hasError),
    "aria-describedby": hasError ? `${fieldId(track, field)}-error` : undefined,
  });

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

      <div className="grid gap-4 sm:grid-cols-2">
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

        {/* Contact */}
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      {/* Country (investor / ai / vendor — supply identifies via market) */}
      {track !== "supply" && (
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
      )}

      {/* Focus — the track's first choice dimension */}
      <div>
        <Label htmlFor={fieldId(track, "focus")}>{copy.focusLabel} *</Label>
        <Select
          value={values.focus}
          onValueChange={(v) => {
            // Radix's hidden native <select> can emit an empty change while
            // its option list registers — never let an empty emission clobber
            // a selected value.
            if (v) set("focus", v);
          }}
        >
          <SelectTrigger {...selectProps("focus", Boolean(errors.focus))}>
            <SelectValue placeholder={t.rfq.selectPlaceholder}>{focusLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {copy.focusOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError field="focus" />
      </div>

      {/* Market — Global Supply: country name + flag */}
      {track === "supply" && (
        <div>
          <Label htmlFor={fieldId(track, "market")}>{t.supplyModal.marketLabel} *</Label>
          <Select
            value={values.market}
            onValueChange={(v) => {
              if (v) set("market", v);
            }}
          >
            <SelectTrigger {...selectProps("market", Boolean(errors.market))}>
              <SelectValue placeholder={t.rfq.selectPlaceholder}>
                {marketOption && (
                  <span className="flex items-center gap-2">
                    {marketOption.flag && <Flag code={marketOption.flag} />}
                    {marketOption.label}
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {marketOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  <span className="flex items-center gap-2">
                    {o.flag && <Flag code={o.flag} />}
                    <span className="truncate">{o.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError field="market" />
        </div>
      )}

      {/* Market "other" free text — required when other is chosen */}
      {track === "supply" && values.market === INQUIRY_MARKET_OTHER && (
        <div>
          <Label htmlFor={fieldId(track, "marketOther")}>{t.supplyModal.marketOtherLabel} *</Label>
          <Input
            id={fieldId(track, "marketOther")}
            name="marketOther"
            value={values.marketOther}
            onChange={(e) => set("marketOther", e.target.value)}
            placeholder={t.supplyModal.marketOtherPlaceholder}
            className={cn(inputCls, "mt-1.5", errors.marketOther && "border-destructive")}
            {...errProps("marketOther")}
          />
          <FieldError field="marketOther" />
        </div>
      )}

      {/* State — Vendors: all Indian states & union territories */}
      {track === "vendor" && (
        <div>
          <Label htmlFor={fieldId(track, "state")}>{t.vendorModal.stateLabel} *</Label>
          <Select
            value={values.state}
            onValueChange={(v) => {
              if (v) set("state", v);
            }}
          >
            <SelectTrigger {...selectProps("state", Boolean(errors.state))}>
              <SelectValue placeholder={t.rfq.selectPlaceholder}>{stateLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {stateOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError field="state" />
          <p className="tech-value mt-2 text-xs leading-relaxed text-muted-foreground">
            {t.vendorModal.stateNote}
          </p>
        </div>
      )}

      {/* Stage / horizon — the track's second choice dimension */}
      {track !== "supply" && (
        <div>
          <Label htmlFor={fieldId(track, "stage")}>{copy.stageLabel} *</Label>
          <Select
            value={track === "investor" ? values.horizon : values.stage}
            onValueChange={(v) => {
              if (v) {
                if (track === "investor") set("horizon", v);
                else set("stage", v);
              }
            }}
          >
            <SelectTrigger
              {...selectProps(track === "investor" ? "horizon" : "stage", Boolean(
                track === "investor" ? errors.horizon : errors.stage
              ))}
            >
              <SelectValue placeholder={t.rfq.selectPlaceholder}>{stageLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {copy.stageOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {track === "investor" ? <FieldError field="horizon" /> : <FieldError field="stage" />}
        </div>
      )}

      {/* Narrative — the required engaging/creative question */}
      <div>
        <Label htmlFor={fieldId(track, "narrative")}>{copy.narrativeLabel} *</Label>
        <Textarea
          id={fieldId(track, "narrative")}
          name="narrative"
          rows={4}
          value={values.narrative}
          onChange={(e) => set("narrative", e.target.value)}
          placeholder={copy.narrativePlaceholder}
          className={cn("mt-1.5 bg-background", errors.narrative && "border-destructive")}
          {...errProps("narrative")}
        />
        <FieldError field="narrative" />
      </div>

      {/* Vision — the optional forward-looking question */}
      <div>
        <Label htmlFor={fieldId(track, "vision")}>
          {copy.visionLabel}{" "}
          <span className="text-muted-foreground">({t.common.optional})</span>
        </Label>
        <Textarea
          id={fieldId(track, "vision")}
          name="vision"
          rows={3}
          value={values.vision}
          onChange={(e) => set("vision", e.target.value)}
          placeholder={copy.visionPlaceholder}
          className={cn("mt-1.5 bg-background", errors.vision && "border-destructive")}
          {...errProps("vision")}
        />
        <FieldError field="vision" />
      </div>

      {/* Link — optional, validated as text only */}
      <div>
        <Label htmlFor={fieldId(track, "link")}>
          {copy.linkLabel}{" "}
          <span className="text-muted-foreground">({t.common.optional})</span>
        </Label>
        <Input
          id={fieldId(track, "link")}
          name="link"
          type="url"
          inputMode="url"
          autoComplete="url"
          value={values.link}
          onChange={(e) => set("link", e.target.value)}
          placeholder={copy.linkPlaceholder}
          className={cn(inputCls, "mt-1.5", errors.link && "border-destructive")}
          {...errProps("link")}
        />
        <FieldError field="link" />
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
              {copy.consent} *
            </Label>
            <FieldError field="consent" />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">{copy.privacyNote}</p>
        <Button type="submit" variant="cta" size="lg" disabled={submitting} className="min-h-12 min-w-40">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t.rfq.submitting}
            </>
          ) : (
            copy.submit
          )}
        </Button>
      </div>

      {/* Honeypot — hidden from humans, catches dumb bots */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={fieldId(track, "honeypot")}>Website</label>
        <input
          id={fieldId(track, "honeypot")}
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          ref={honeypotRef}
        />
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* The four standalone modal portals                                   */
/* ------------------------------------------------------------------ */

interface InquiryModalProps {
  label?: string;
}

/**
 * Each portal is fully self-contained: trigger + Radix portal content
 * (mounts standalone into document.body, outside the page DOM) + bespoke
 * questionnaire + submit. Focus trap, ESC close, aria-modal and scroll
 * lock are handled by the dialog primitive.
 */
export function InvestorModal({ label }: InquiryModalProps = {}) {
  const { t } = useI18n();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="cta"
          size="lg"
          aria-haspopup="dialog"
          className="min-h-12 shrink-0"
        >
          {label ?? t.investors.cta}
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={t.common.close} className="sm:max-w-xl">
        <div>
          <p className="tech-value text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            {t.footer.linkInvestors}
          </p>
          <DialogTitle className="mt-1 text-xl">{t.investorModal.title}</DialogTitle>
          <DialogDescription className="mt-2">{t.investorModal.intro}</DialogDescription>
        </div>
        <InquiryForm track="investor" />
        <div className="border-t border-border pt-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t.investorModal.emailNote}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AiCollabModal({ label }: InquiryModalProps = {}) {
  const { t } = useI18n();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="cta"
          size="lg"
          aria-haspopup="dialog"
          className="min-h-12 shrink-0"
        >
          {label ?? t.aiTech.cta}
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={t.common.close} className="sm:max-w-xl">
        <div>
          <p className="tech-value text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            {t.footer.linkAiTech}
          </p>
          <DialogTitle className="mt-1 text-xl">{t.aiModal.title}</DialogTitle>
          <DialogDescription className="mt-2">{t.aiModal.intro}</DialogDescription>
        </div>
        <InquiryForm track="ai" />
        <div className="border-t border-border pt-4">
          <p className="text-xs leading-relaxed text-muted-foreground">{t.aiModal.emailNote}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function VendorModal({ label }: InquiryModalProps = {}) {
  const { t } = useI18n();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="cta"
          size="lg"
          aria-haspopup="dialog"
          className="min-h-12 shrink-0"
        >
          {label ?? t.vendors.cta}
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={t.common.close} className="sm:max-w-xl">
        <div>
          <p className="tech-value text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            {t.footer.linkVendors}
          </p>
          <DialogTitle className="mt-1 text-xl">{t.vendorModal.title}</DialogTitle>
          <DialogDescription className="mt-2">{t.vendorModal.intro}</DialogDescription>
        </div>
        <InquiryForm track="vendor" />
        <div className="border-t border-border pt-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t.vendorModal.emailNote}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SupplyModal({ label }: InquiryModalProps = {}) {
  const { t } = useI18n();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="cta"
          size="lg"
          aria-haspopup="dialog"
          className="min-h-12 shrink-0"
        >
          {label ?? t.supply.cta}
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={t.common.close} className="sm:max-w-xl">
        <div>
          <p className="tech-value text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            {t.nav.alias.supply}
          </p>
          <DialogTitle className="mt-1 text-xl">{t.supplyModal.title}</DialogTitle>
          <DialogDescription className="mt-2">{t.supplyModal.intro}</DialogDescription>
        </div>
        <InquiryForm track="supply" />
        <div className="border-t border-border pt-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t.supplyModal.emailNote}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
