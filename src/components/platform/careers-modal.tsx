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
  careersSchema,
  type CareersFieldErrorCode,
  type CareersErrorCode,
} from "@/lib/careers-schema";
import { CAREERS_AREAS, CAREERS_PLACEMENTS, CAREERS_STAGES } from "@/content/careers";
import { getRecaptchaToken } from "@/lib/recaptcha-client";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<string, CareersFieldErrorCode>>;

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  placement: string;
  area: string;
  stage: string;
  spark: string;
  horizon: string;
  link: string;
  consent: boolean;
}

const INITIAL: FormState = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  placement: "",
  area: "",
  stage: "",
  spark: "",
  horizon: "",
  link: "",
  consent: false,
};

function fieldId(field: string): string {
  return `car-careers-${field}`;
}

/**
 * Careers intake form — the "contact the careers team" questionnaire.
 * State lives inside the Radix portal content, so closing the modal
 * unmounts the form and the next opening always starts from a clean slate.
 */
function CareersForm() {
  const { t, locale } = useI18n();
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<CareersErrorCode | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const startedAt = useRef<number>(Date.now());
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Choice options: opaque values from the shared content module, localized
  // labels from the dictionary (same order, zipped by index).
  const placementOptions = CAREERS_PLACEMENTS.map((value, i) => ({
    value,
    label: [
      t.careersModal.placement1,
      t.careersModal.placement2,
      t.careersModal.placement3,
      t.careersModal.placement4,
      t.careersModal.placement5,
    ][i],
  }));
  const areaOptions = CAREERS_AREAS.map((value, i) => ({
    value,
    label: [
      t.careersModal.area1,
      t.careersModal.area2,
      t.careersModal.area3,
      t.careersModal.area4,
      t.careersModal.area5,
      t.careersModal.area6,
      t.careersModal.area7,
    ][i],
  }));
  const stageOptions = CAREERS_STAGES.map((value, i) => ({
    value,
    label: [
      t.careersModal.stage1,
      t.careersModal.stage2,
      t.careersModal.stage3,
      t.careersModal.stage4,
      t.careersModal.stage5,
    ][i],
  }));
  const placementLabel = placementOptions.find((o) => o.value === values.placement)?.label;
  const areaLabel = areaOptions.find((o) => o.value === values.area)?.label;
  const stageLabel = stageOptions.find((o) => o.value === values.stage)?.label;

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function errorMessage(field: string, code: CareersFieldErrorCode): string {
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
      document.getElementById(fieldId(firstKey))?.focus();
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    // Client-side validation with the shared schema.
    const parsed = careersSchema.safeParse({ ...values, locale });
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message as CareersFieldErrorCode;
      }
      setErrors(fieldErrors);
      focusFirstInvalid(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      // reCAPTCHA v3 (no-op token when the site key is not configured).
      const captchaToken = await getRecaptchaToken("careers_submit");
      const res = await fetch("/api/careers", {
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
        code?: CareersErrorCode;
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
      ? ({ "aria-invalid": true, "aria-describedby": `${fieldId(field)}-error` } as const)
      : {};

  function FieldError({ field }: { field: string }) {
    if (!errors[field]) return null;
    return (
      <p
        id={`${fieldId(field)}-error`}
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
        <h4 className="mt-3 font-display text-lg font-bold">{t.careersModal.successTitle}</h4>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t.careersModal.successBody}
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

      {/* Full name */}
      <div>
        <Label htmlFor={fieldId("fullName")}>{t.rfq.contactName} *</Label>
        <Input
          id={fieldId("fullName")}
          name="fullName"
          autoComplete="name"
          value={values.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          placeholder={t.rfq.contactNamePlaceholder}
          className={cn(inputCls, "mt-1.5", errors.fullName && "border-destructive")}
          {...errProps("fullName")}
        />
        <FieldError field="fullName" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Email */}
        <div>
          <Label htmlFor={fieldId("email")}>{t.rfq.email} *</Label>
          <Input
            id={fieldId("email")}
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
          <Label htmlFor={fieldId("phone")}>
            {t.rfq.phone} <span className="text-muted-foreground">({t.common.optional})</span>
          </Label>
          <Input
            id={fieldId("phone")}
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

      {/* Country */}
      <div>
        <Label htmlFor={fieldId("country")}>{t.rfq.country} *</Label>
        <Input
          id={fieldId("country")}
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

      {/* Placement — what kind of role are they exploring? */}
      <div>
        <Label htmlFor={fieldId("placement")}>{t.careersModal.placementLabel} *</Label>
        <Select
          value={values.placement}
          onValueChange={(v) => {
            // Radix's hidden native <select> can emit an empty change while
            // its option list registers (closed content) — never let an empty
            // emission clobber a selected value.
            if (v) set("placement", v);
          }}
        >
          <SelectTrigger
            id={fieldId("placement")}
            className={cn("mt-1.5 min-h-11 w-full", errors.placement && "border-destructive")}
            aria-invalid={Boolean(errors.placement)}
            aria-describedby={errors.placement ? `${fieldId("placement")}-error` : undefined}
          >
            <SelectValue placeholder={t.rfq.selectPlaceholder}>{placementLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {placementOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError field="placement" />
      </div>

      {/* Area — where would they want to contribute? */}
      <div>
        <Label htmlFor={fieldId("area")}>{t.careersModal.areaLabel} *</Label>
        <Select
          value={values.area}
          onValueChange={(v) => {
            if (v) set("area", v);
          }}
        >
          <SelectTrigger
            id={fieldId("area")}
            className={cn("mt-1.5 min-h-11 w-full", errors.area && "border-destructive")}
            aria-invalid={Boolean(errors.area)}
            aria-describedby={errors.area ? `${fieldId("area")}-error` : undefined}
          >
            <SelectValue placeholder={t.rfq.selectPlaceholder}>{areaLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {areaOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError field="area" />
      </div>

      {/* Stage — where is their journey now? */}
      <div>
        <Label htmlFor={fieldId("stage")}>{t.careersModal.stageLabel} *</Label>
        <Select
          value={values.stage}
          onValueChange={(v) => {
            if (v) set("stage", v);
          }}
        >
          <SelectTrigger
            id={fieldId("stage")}
            className={cn("mt-1.5 min-h-11 w-full", errors.stage && "border-destructive")}
            aria-invalid={Boolean(errors.stage)}
            aria-describedby={errors.stage ? `${fieldId("stage")}-error` : undefined}
          >
            <SelectValue placeholder={t.rfq.selectPlaceholder}>{stageLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {stageOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError field="stage" />
      </div>

      {/* Spark — the creative story question */}
      <div>
        <Label htmlFor={fieldId("spark")}>{t.careersModal.sparkLabel} *</Label>
        <Textarea
          id={fieldId("spark")}
          name="spark"
          rows={4}
          value={values.spark}
          onChange={(e) => set("spark", e.target.value)}
          placeholder={t.careersModal.sparkPlaceholder}
          className={cn("mt-1.5 bg-background", errors.spark && "border-destructive")}
          {...errProps("spark")}
        />
        <FieldError field="spark" />
      </div>

      {/* Horizon — the optional forward-looking question */}
      <div>
        <Label htmlFor={fieldId("horizon")}>
          {t.careersModal.horizonLabel}{" "}
          <span className="text-muted-foreground">({t.common.optional})</span>
        </Label>
        <Textarea
          id={fieldId("horizon")}
          name="horizon"
          rows={3}
          value={values.horizon}
          onChange={(e) => set("horizon", e.target.value)}
          placeholder={t.careersModal.horizonPlaceholder}
          className={cn("mt-1.5 bg-background", errors.horizon && "border-destructive")}
          {...errProps("horizon")}
        />
        <FieldError field="horizon" />
      </div>

      {/* Work link — optional, validated as text only */}
      <div>
        <Label htmlFor={fieldId("link")}>
          {t.careersModal.linkLabel}{" "}
          <span className="text-muted-foreground">({t.common.optional})</span>
        </Label>
        <Input
          id={fieldId("link")}
          name="link"
          type="url"
          inputMode="url"
          autoComplete="url"
          value={values.link}
          onChange={(e) => set("link", e.target.value)}
          placeholder={t.careersModal.linkPlaceholder}
          className={cn(inputCls, "mt-1.5", errors.link && "border-destructive")}
          {...errProps("link")}
        />
        <FieldError field="link" />
      </div>

      {/* Consent */}
      <div>
        <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-4">
          <Checkbox
            id={fieldId("consent")}
            checked={values.consent}
            onCheckedChange={(checked) => set("consent", checked === true)}
            className="mt-0.5"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${fieldId("consent")}-error` : undefined}
          />
          <div>
            <Label
              htmlFor={fieldId("consent")}
              className="text-[13px] font-medium leading-relaxed"
            >
              {t.careersModal.consent} *
            </Label>
            <FieldError field="consent" />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
          {t.careersModal.privacyNote}
        </p>
        <Button type="submit" variant="cta" size="lg" disabled={submitting} className="min-h-12 min-w-40">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t.rfq.submitting}
            </>
          ) : (
            t.careersModal.submit
          )}
        </Button>
      </div>

      {/* Honeypot — hidden from humans, catches dumb bots */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={fieldId("honeypot")}>Website</label>
        <input
          id={fieldId("honeypot")}
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
 * Standalone modal portal for the careers page. Fully self-contained:
 * trigger + portal content + questionnaire + submit. The portal renders
 * into document.body (outside the page DOM), with focus trap, ESC close,
 * aria-modal and scroll lock via Radix.
 */
export function CareersModal({ label }: { label?: string } = {}) {
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
          {label ?? t.careers.cta}
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={t.common.close} className="sm:max-w-xl">
        <div>
          <p className="tech-value text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            {t.footer.linkCareers}
          </p>
          <DialogTitle className="mt-1 text-xl">{t.careersModal.title}</DialogTitle>
          <DialogDescription className="mt-2">{t.careersModal.intro}</DialogDescription>
        </div>

        <CareersForm />

        {/* The page stays exactly where it is — the modal never navigates. */}
        <div className="border-t border-border pt-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t.careersModal.emailNote}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
