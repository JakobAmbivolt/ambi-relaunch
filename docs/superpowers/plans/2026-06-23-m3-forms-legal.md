# M3 Forms & Legal Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build client-side contact & application forms (Phase-1 UI only, no backend) plus Impressum and Datenschutzerklärung legal pages for the AmbiVolt Next.js rebuild.

**Architecture:** 9 new files: 2 "use client" form components (`ContactForm`, `ApplicationForm`), 3 server components (`MapPlaceholder`, `LegalPageLayout`, `FormField` wrapper), 4 route pages (`/kontakt`, `/jetzt-bewerben`, `/impressum`, `/datenschutzerklaerung`). Forms validate client-side and show a Phase-1 inline note instead of submitting. Legal pages use a shared `LegalPageLayout` that renders prose with bold subheadings, bullet lists, and URL linkification.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, `@/*` → `src/*` alias, npm.

---

## File Map

| File | Create/Modify | Responsibility |
|---|---|---|
| `src/components/forms/FormField.tsx` | Create (Server) | Label + required asterisk + error text wrapper |
| `src/components/forms/ContactForm.tsx` | Create ("use client") | Kontakt form: Profil select, Name, Firma, E-Mail, Telefon, Nachricht textarea, Datenschutz checkbox, math captcha, honeypot |
| `src/components/forms/ApplicationForm.tsx` | Create ("use client") | Bewerbungs form: Vorname, Nachname, Geburtsdatum, Telefon, E-Mail, Praktikum/Ausbildung select, Nachricht textarea, file upload, Datenschutz checkbox, math captcha, honeypot |
| `src/components/sections/MapPlaceholder.tsx` | Create (Server) | Static map placeholder with pin icon, address, and Routenplaner link |
| `src/components/sections/LegalPageLayout.tsx` | Create (Server) | Prose column: H1, numbered headings, paragraphs split by `\n\n`, bullet detection, URL linkification, bold first-line for `paragraphs[]` variant |
| `src/app/kontakt/page.tsx` | Create (Server) | Metadata + PageHero + intro section + 2-col grid (ContactForm / ContactInfo + OpeningHours + MapPlaceholder) |
| `src/app/jetzt-bewerben/page.tsx` | Create (Server) | Metadata + PageHero + 2-col grid (ApplicationForm / ContactInfo + OpeningHours) |
| `src/app/impressum/page.tsx` | Create (Server) | Metadata (noindex) + LegalPageLayout with impressum paragraphs |
| `src/app/datenschutzerklaerung/page.tsx` | Create (Server) | Metadata (noindex) + LegalPageLayout with datenschutz sections |

---

## Task 1: FormField helper component

**Files:**
- Create: `src/components/forms/FormField.tsx`

- [ ] **Step 1: Create the file**

```tsx
import type { ReactNode } from "react";

export function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-amber" aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd C:\Users\ambiv\ambi-relaunch && npx tsc --noEmit`
Expected: 0 errors (or same count as before this task)

- [ ] **Step 3: Commit**

```bash
git add src/components/forms/FormField.tsx
git commit -m "feat(m3): add FormField helper component"
```

---

## Task 2: MapPlaceholder component

**Files:**
- Create: `src/components/sections/MapPlaceholder.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { company } from "@/content/company";

export function MapPlaceholder() {
  return (
    <div className="mt-6 flex flex-col items-center gap-4 rounded border border-slate-200 bg-surface p-6 text-center">
      <Icon name="pin" className="h-8 w-8 text-amber" />
      <p className="text-sm text-text">
        {company.legalName}
        <br />
        {company.street}, {company.zip} {company.city}
      </p>
      <Button
        href="https://goo.gl/maps/vrrkSpwHgoMbFEiXA"
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        className="text-xs"
      >
        Routenplaner öffnen
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd C:\Users\ambiv\ambi-relaunch && npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/MapPlaceholder.tsx
git commit -m "feat(m3): add MapPlaceholder component (static, DSGVO-safe)"
```

---

## Task 3: LegalPageLayout component

**Files:**
- Create: `src/components/sections/LegalPageLayout.tsx`

This component handles two data shapes:
- `datenschutz.sections[i]` has `.heading` and `.body` (text with `\n\n` paragraph breaks and `\n` line breaks, lines starting with `"- "` become list items)
- `impressum.sections[0]` has `.paragraphs[]` where the **first line of each string** is a bold subheading, the rest is body text

URL detection: the ODR link `https://ec.europa.eu/consumers/odr/` must be rendered as an `<a>`. We detect any `https://...` token in text and linkify it.

- [ ] **Step 1: Create the file**

```tsx
import { Container } from "@/components/ui/Container";

type LegalSection = {
  heading?: string;
  body?: string;
  paragraphs?: string[];
};

// Linkify URLs in a plain text string into React nodes
function linkify(text: string): (string | JSX.Element)[] {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const parts: (string | JSX.Element)[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const url = match[0].replace(/[.,;)]+$/, ""); // trim trailing punctuation
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber underline hover:opacity-80 break-all"
      >
        {url}
      </a>
    );
    last = match.index + url.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// Render a single line — may contain URLs
function Line({ text }: { text: string }) {
  return <>{linkify(text)}</>;
}

// Render a body string (paragraphs split by \n\n, lines by \n, "- " lines become <li>)
function BodyText({ text }: { text: string }) {
  const paragraphs = text.split("\n\n");
  return (
    <>
      {paragraphs.map((para, pi) => {
        const lines = para.split("\n");
        const allBullets = lines.every((l) => l.startsWith("- "));
        const someBullets = lines.some((l) => l.startsWith("- "));

        if (allBullets) {
          return (
            <ul key={pi} className="mt-3 list-disc pl-6 space-y-1">
              {lines.map((l, li) => (
                <li key={li}>
                  <Line text={l.slice(2)} />
                </li>
              ))}
            </ul>
          );
        }

        if (someBullets) {
          // Mixed: render each line individually
          return (
            <p key={pi} className="mt-3 text-text leading-relaxed">
              {lines.map((l, li) => (
                <span key={li}>
                  {l.startsWith("- ") ? "• " + l.slice(2) : <Line text={l} />}
                  {li < lines.length - 1 && <br />}
                </span>
              ))}
            </p>
          );
        }

        // Plain paragraph: lines joined with <br/>
        return (
          <p key={pi} className="mt-3 text-text leading-relaxed">
            {lines.map((l, li) => (
              <span key={li}>
                <Line text={l} />
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

// Render an impressum paragraph[] entry: first line is bold subheading, rest is text
function ImpressumParagraph({ text }: { text: string }) {
  const lines = text.split("\n");
  const [heading, ...rest] = lines;
  return (
    <div className="mt-5">
      {heading && <strong className="block font-semibold text-ink"><Line text={heading} /></strong>}
      {rest.map((l, i) => (
        <span key={i}>
          <Line text={l} />
          {i < rest.length - 1 && <br />}
        </span>
      ))}
    </div>
  );
}

export function LegalPageLayout({
  title,
  sections,
}: {
  title: string;
  sections: LegalSection[];
}) {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-10 text-3xl font-bold text-ink md:text-4xl">{title}</h1>

          {sections.map((sec, si) => (
            <div key={si}>
              {/* Section with heading + body */}
              {sec.heading && (
                <h2 className="mt-8 mb-3 text-xl font-bold text-ink">{sec.heading}</h2>
              )}
              {sec.body && <BodyText text={sec.body} />}

              {/* Impressum-style paragraphs[] with bold first line */}
              {sec.paragraphs && sec.paragraphs.length > 0 && (
                <div>
                  {sec.paragraphs.map((p, pi) => (
                    <ImpressumParagraph key={pi} text={p} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

Note: `JSX.Element` is available in TSX files without explicit import in React 19 (global JSX namespace). If tsc complains, replace `JSX.Element` with `React.JSX.Element` and add `import type React from "react"` at the top.

- [ ] **Step 2: Verify TypeScript**

Run: `cd C:\Users\ambiv\ambi-relaunch && npx tsc --noEmit`

If you see `JSX.Element` errors, add at top:
```tsx
import type React from "react";
```
And change `JSX.Element` to `React.JSX.Element`.

Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/LegalPageLayout.tsx
git commit -m "feat(m3): add LegalPageLayout component for Impressum & Datenschutz"
```

---

## Task 4: ContactForm component

**Files:**
- Create: `src/components/forms/ContactForm.tsx`

Fields from `kontakt.form.fields` (confirmed in JSON):
1. "Ihr Profil" — select, required, options: ["Eigenanlagen-Betreiber", "PV-Profi"], default option text: "Ihr Profil"
2. "Name" — text, required
3. "Firma / Institution" — text, not required
4. "E-Mail-Adresse" — email, required
5. "Telefon" — text, required
6. "Ihre optionale Nachricht …" — textarea, not required
7. Datenschutz checkbox — required, link to /datenschutzerklaerung/
8. Math captcha — two random numbers generated on mount
9. Honeypot hidden input

Phase-1 submit policy: validate → on success show inline note, do NOT navigate or POST.

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useState, useEffect } from "react";
import { FormField } from "@/components/forms/FormField";

type Errors = Partial<Record<string, string>>;

function inputClass(error?: string) {
  return `w-full rounded border p-3 text-sm text-ink placeholder-slate-400 outline-none transition-colors focus:border-amber ${
    error ? "border-red-400" : "border-slate-300"
  }`;
}

export function ContactForm() {
  const [profil, setProfil] = useState("");
  const [name, setName] = useState("");
  const [firma, setFirma] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [datenschutz, setDatenschutz] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [captchaA, setCaptchaA] = useState(0);
  const [captchaB, setCaptchaB] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setCaptchaA(Math.floor(Math.random() * 9) + 1);
    setCaptchaB(Math.floor(Math.random() * 9) + 1);
  }, []);

  function validate(): Errors {
    const e: Errors = {};
    if (!profil) e.profil = "Bitte wählen Sie Ihr Profil aus.";
    if (!name.trim()) e.name = "Name ist ein Pflichtfeld.";
    if (!email.trim()) {
      e.email = "E-Mail-Adresse ist ein Pflichtfeld.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    }
    if (!telefon.trim()) e.telefon = "Telefon ist ein Pflichtfeld.";
    if (!datenschutz) e.datenschutz = "Bitte stimmen Sie der Datenschutzerklärung zu.";
    const answerNum = parseInt(captchaAnswer, 10);
    if (isNaN(answerNum) || answerNum !== captchaA + captchaB) {
      e.captcha = "Die Antwort auf die Mathe-Aufgabe ist nicht korrekt.";
    }
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return; // spam bot
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="rounded border border-amber bg-amber/10 p-6 text-sm text-ink">
        <p className="font-semibold">Vielen Dank!</p>
        <p className="mt-1">
          Der Formularversand wird in Kürze aktiviert – bitte kontaktieren Sie uns direkt per
          Telefon oder E-Mail.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(ev) => setHoneypot(ev.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <FormField label="Ihr Profil" required error={errors.profil}>
        <select
          value={profil}
          onChange={(ev) => setProfil(ev.target.value)}
          className={inputClass(errors.profil)}
        >
          <option value="">Ihr Profil</option>
          <option value="Eigenanlagen-Betreiber">Eigenanlagen-Betreiber</option>
          <option value="PV-Profi">PV-Profi</option>
        </select>
      </FormField>

      <FormField label="Name" required error={errors.name}>
        <input
          type="text"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          placeholder="Ihr Name"
          className={inputClass(errors.name)}
        />
      </FormField>

      <FormField label="Firma / Institution" error={errors.firma}>
        <input
          type="text"
          value={firma}
          onChange={(ev) => setFirma(ev.target.value)}
          placeholder="Firma oder Institution (optional)"
          className={inputClass(errors.firma)}
        />
      </FormField>

      <FormField label="E-Mail-Adresse" required error={errors.email}>
        <input
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="ihre@email.de"
          className={inputClass(errors.email)}
        />
      </FormField>

      <FormField label="Telefon" required error={errors.telefon}>
        <input
          type="tel"
          value={telefon}
          onChange={(ev) => setTelefon(ev.target.value)}
          placeholder="08722 – 966 85 77"
          className={inputClass(errors.telefon)}
        />
      </FormField>

      <FormField label="Ihre optionale Nachricht …" error={errors.nachricht}>
        <textarea
          value={nachricht}
          onChange={(ev) => setNachricht(ev.target.value)}
          rows={5}
          placeholder="Ihre Nachricht an uns …"
          className={inputClass(errors.nachricht)}
        />
      </FormField>

      {/* Datenschutz */}
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-3 text-sm text-text">
          <input
            type="checkbox"
            checked={datenschutz}
            onChange={(ev) => setDatenschutz(ev.target.checked)}
            className="mt-0.5 h-4 w-4 flex-shrink-0 accent-amber"
          />
          <span>
            Ich habe die{" "}
            <a
              href="/datenschutzerklaerung/"
              className="text-amber underline hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datenschutzerklärung
            </a>{" "}
            gelesen und bin damit einverstanden, dass die hier eingegebenen Informationen zum Zweck
            der Kontaktaufnahme gespeichert werden. *
          </span>
        </label>
        {errors.datenschutz && (
          <p className="text-sm text-red-600 pl-7">{errors.datenschutz}</p>
        )}
      </div>

      {/* Math captcha */}
      <FormField
        label={`Sicherheitsfrage: ${captchaA} + ${captchaB} = ?`}
        required
        error={errors.captcha}
      >
        <input
          type="number"
          value={captchaAnswer}
          onChange={(ev) => setCaptchaAnswer(ev.target.value)}
          placeholder="Ergebnis eingeben"
          className={inputClass(errors.captcha)}
        />
      </FormField>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors bg-amber text-white hover:bg-amber-bright self-start"
      >
        Senden
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd C:\Users\ambiv\ambi-relaunch && npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/forms/ContactForm.tsx
git commit -m "feat(m3): add ContactForm (Phase-1 client-side validation)"
```

---

## Task 5: ApplicationForm component

**Files:**
- Create: `src/components/forms/ApplicationForm.tsx`

Fields from `bewerben.form.fields` (confirmed in JSON):
1. "Vorname" — text, required
2. "Nachname" — text, required
3. "Geburtsdatum" — text (date), not required
4. "Telefon" — tel, not required
5. "E-Mail-Adresse" — email, required
6. "Praktikum oder Ausbildung" — select, required, options: ["Praktikum", "Ausbildung"]
7. "Deine Nachricht an uns..." — textarea, not required
8. "Anhang" — file, not required (accept attr for jpg/jpeg/jpe/mka/7z/xla/xls/xlt/xlw/odg, max 1 MB note)
9. Datenschutz checkbox — required, link to /datenschutzerklaerung/
10. Math captcha — random on mount
11. Honeypot

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useState, useEffect } from "react";
import { FormField } from "@/components/forms/FormField";

type Errors = Partial<Record<string, string>>;

function inputClass(error?: string) {
  return `w-full rounded border p-3 text-sm text-ink placeholder-slate-400 outline-none transition-colors focus:border-amber ${
    error ? "border-red-400" : "border-slate-300"
  }`;
}

export function ApplicationForm() {
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [geburtsdatum, setGeburtsdatum] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [stelle, setStelle] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [datenschutz, setDatenschutz] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [captchaA, setCaptchaA] = useState(0);
  const [captchaB, setCaptchaB] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setCaptchaA(Math.floor(Math.random() * 9) + 1);
    setCaptchaB(Math.floor(Math.random() * 9) + 1);
  }, []);

  function validate(): Errors {
    const e: Errors = {};
    if (!vorname.trim()) e.vorname = "Vorname ist ein Pflichtfeld.";
    if (!nachname.trim()) e.nachname = "Nachname ist ein Pflichtfeld.";
    if (!email.trim()) {
      e.email = "E-Mail-Adresse ist ein Pflichtfeld.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    }
    if (!stelle) e.stelle = "Bitte wählen Sie Praktikum oder Ausbildung aus.";
    if (!datenschutz) e.datenschutz = "Bitte stimmen Sie der Datenschutzerklärung zu.";
    const answerNum = parseInt(captchaAnswer, 10);
    if (isNaN(answerNum) || answerNum !== captchaA + captchaB) {
      e.captcha = "Die Antwort auf die Mathe-Aufgabe ist nicht korrekt.";
    }
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="rounded border border-amber bg-amber/10 p-6 text-sm text-ink">
        <p className="font-semibold">Vielen Dank!</p>
        <p className="mt-1">
          Der Formularversand wird in Kürze aktiviert – bitte kontaktieren Sie uns direkt per
          Telefon oder E-Mail.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(ev) => setHoneypot(ev.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Vorname" required error={errors.vorname}>
          <input
            type="text"
            value={vorname}
            onChange={(ev) => setVorname(ev.target.value)}
            placeholder="Dein Vorname"
            className={inputClass(errors.vorname)}
          />
        </FormField>

        <FormField label="Nachname" required error={errors.nachname}>
          <input
            type="text"
            value={nachname}
            onChange={(ev) => setNachname(ev.target.value)}
            placeholder="Dein Nachname"
            className={inputClass(errors.nachname)}
          />
        </FormField>
      </div>

      <FormField label="Geburtsdatum" error={errors.geburtsdatum}>
        <input
          type="text"
          value={geburtsdatum}
          onChange={(ev) => setGeburtsdatum(ev.target.value)}
          placeholder="TT.MM.JJJJ"
          className={inputClass(errors.geburtsdatum)}
        />
      </FormField>

      <FormField label="Telefon" error={errors.telefon}>
        <input
          type="tel"
          value={telefon}
          onChange={(ev) => setTelefon(ev.target.value)}
          placeholder="Deine Telefonnummer"
          className={inputClass(errors.telefon)}
        />
      </FormField>

      <FormField label="E-Mail-Adresse" required error={errors.email}>
        <input
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="deine@email.de"
          className={inputClass(errors.email)}
        />
      </FormField>

      <FormField label="Praktikum oder Ausbildung" required error={errors.stelle}>
        <select
          value={stelle}
          onChange={(ev) => setStelle(ev.target.value)}
          className={inputClass(errors.stelle)}
        >
          <option value="">Bitte wählen …</option>
          <option value="Praktikum">Praktikum</option>
          <option value="Ausbildung">Ausbildung</option>
        </select>
      </FormField>

      <FormField label="Deine Nachricht an uns..." error={errors.nachricht}>
        <textarea
          value={nachricht}
          onChange={(ev) => setNachricht(ev.target.value)}
          rows={5}
          placeholder="Schreib uns etwas über dich …"
          className={inputClass(errors.nachricht)}
        />
      </FormField>

      {/* File upload */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-ink">
          Anhang (z.B. Lebenslauf, Zeugnisse etc.)
        </label>
        <input
          type="file"
          accept=".jpg,.jpeg,.jpe,.mka,.7z,.xla,.xls,.xlt,.xlw,.odg"
          className="text-sm text-text file:mr-4 file:cursor-pointer file:rounded file:border-0 file:bg-amber file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-amber-bright"
        />
        <p className="text-xs text-text">
          Akzeptierte Dateiendungen: jpg, jpeg, jpe, mka, 7z, xla, xls, xlt, xlw, odg. Maximale
          Dateigröße: 1 MB
        </p>
      </div>

      {/* Datenschutz */}
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-3 text-sm text-text">
          <input
            type="checkbox"
            checked={datenschutz}
            onChange={(ev) => setDatenschutz(ev.target.checked)}
            className="mt-0.5 h-4 w-4 flex-shrink-0 accent-amber"
          />
          <span>
            Ich habe die{" "}
            <a
              href="/datenschutzerklaerung/"
              className="text-amber underline hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datenschutzerklärung
            </a>{" "}
            gelesen und bin damit einverstanden, dass die hier eingegebenen Informationen zum Zweck
            der Kontaktaufnahme gespeichert werden. *
          </span>
        </label>
        {errors.datenschutz && (
          <p className="text-sm text-red-600 pl-7">{errors.datenschutz}</p>
        )}
      </div>

      {/* Math captcha */}
      <FormField
        label={`Sicherheitsfrage: ${captchaA} + ${captchaB} = ?`}
        required
        error={errors.captcha}
      >
        <input
          type="number"
          value={captchaAnswer}
          onChange={(ev) => setCaptchaAnswer(ev.target.value)}
          placeholder="Ergebnis eingeben"
          className={inputClass(errors.captcha)}
        />
      </FormField>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors bg-amber text-white hover:bg-amber-bright self-start"
      >
        Senden
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd C:\Users\ambiv\ambi-relaunch && npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/forms/ApplicationForm.tsx
git commit -m "feat(m3): add ApplicationForm (Phase-1 client-side validation)"
```

---

## Task 6: /kontakt route page

**Files:**
- Create: `src/app/kontakt/page.tsx`

Data: `kontakt` from `@/content/m3`, section `"intro"`.
Layout: PageHero → intro section (centered) → 2-col grid (lg:col-span-7/5 or simpler `lg:grid-cols-[2fr_1fr]`): LEFT = form heading + ContactForm; RIGHT = ContactInfo + OpeningHours + MapPlaceholder.

Note: The heading in the intro section contains `&nbsp;` in the JSON ("Haben Sie Fragen  oder …") — call `decodeHtml` (strip `&nbsp;`, `&amp;`) which is already used in `unternehmen/page.tsx` — copy that local helper.

- [ ] **Step 1: Create the file**

```tsx
import type { Metadata } from "next";
import { kontakt, section } from "@/content/m3";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { PageHero } from "@/components/sections/PageHero";
import { ContactInfo } from "@/components/ui/ContactInfo";
import { OpeningHours } from "@/components/ui/OpeningHours";
import { MapPlaceholder } from "@/components/sections/MapPlaceholder";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: kontakt.metaTitle,
  description: kontakt.metaDescription,
};

function decodeHtml(str: string) {
  return str.replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
}

export default function KontaktPage() {
  const intro = section(kontakt, "intro");

  return (
    <>
      <PageHero
        eyebrow={kontakt.heroEyebrow}
        title={<Highlight color="amber">{kontakt.heroTitle}</Highlight>}
        bgImage="/images/hero-bg.jpg"
      />

      {/* Intro */}
      {intro && (
        <section className="bg-surface py-12 md:py-16">
          <Container>
            <div className="mx-auto max-w-2xl text-center flex flex-col gap-4">
              {intro.heading && (
                <h2 className="text-2xl font-bold text-ink md:text-3xl">
                  {decodeHtml(intro.heading)}
                </h2>
              )}
              {intro.paragraphs?.map((p, i) => (
                <p key={i} className="text-text">
                  {p}
                </p>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Main: form + contact sidebar */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
            {/* Left: form */}
            <div>
              <h2 className="mb-2 text-2xl font-bold text-ink">Nachricht senden</h2>
              <p className="mb-6 text-sm text-text">Felder mit * sind Pflichtfelder</p>
              <ContactForm />
            </div>

            {/* Right: contact info */}
            <div className="flex flex-col gap-8">
              <ContactInfo heading="Kontakt" />
              <OpeningHours />
              <MapPlaceholder />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd C:\Users\ambiv\ambi-relaunch && npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/app/kontakt/page.tsx
git commit -m "feat(m3): add /kontakt route with ContactForm"
```

---

## Task 7: /jetzt-bewerben route page

**Files:**
- Create: `src/app/jetzt-bewerben/page.tsx`

Metadata: use custom (the JSON meta is wrong — same as kontakt meta by accident). Title "Jetzt bewerben", description "Bewirb dich bei AmbiVolt – Praktikum oder Ausbildung."

PageHero: no bgImage, title = `<Highlight color="amber">Willkommen bei AmbiVolt!</Highlight>`. Hero children = subheading + paragraph from `section(bewerben, "hero")`.

Main: 2-col grid. LEFT = ApplicationForm. RIGHT = ContactInfo + OpeningHours.

- [ ] **Step 1: Create the file**

```tsx
import type { Metadata } from "next";
import { bewerben, section } from "@/content/m3";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { PageHero } from "@/components/sections/PageHero";
import { ContactInfo } from "@/components/ui/ContactInfo";
import { OpeningHours } from "@/components/ui/OpeningHours";
import { ApplicationForm } from "@/components/forms/ApplicationForm";

export const metadata: Metadata = {
  title: "Jetzt bewerben",
  description: "Bewirb dich bei AmbiVolt – Praktikum oder Ausbildung.",
};

export default function JetztBewerbenPage() {
  const hero = section(bewerben, "hero");

  return (
    <>
      <PageHero
        title={<Highlight color="amber">Willkommen bei AmbiVolt!</Highlight>}
        align="center"
      >
        {hero?.subheading && (
          <p className="mt-4 text-lg text-white/90">{hero.subheading}</p>
        )}
        {hero?.paragraphs?.[0] && (
          <p className="mt-2 text-base text-white/75">{hero.paragraphs[0]}</p>
        )}
      </PageHero>

      {/* Main: form + contact sidebar */}
      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
            {/* Left: form */}
            <div>
              <h2 className="mb-2 text-2xl font-bold text-ink">Sende uns deine Bewerbung</h2>
              <ApplicationForm />
            </div>

            {/* Right: contact info */}
            <div className="flex flex-col gap-8">
              <ContactInfo heading="Kontakt" />
              <OpeningHours />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd C:\Users\ambiv\ambi-relaunch && npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/app/jetzt-bewerben/page.tsx
git commit -m "feat(m3): add /jetzt-bewerben route with ApplicationForm"
```

---

## Task 8: /impressum route page

**Files:**
- Create: `src/app/impressum/page.tsx`

Data: `impressum` from `@/content/m3`. The `impressum.sections[0]` has `.paragraphs[]` (no `.body`). Pass sections directly to `LegalPageLayout`.

Note: `impressum` is typed as `M3Page & { sections: LegalSection[] }`. `LegalSection` has `heading?`, `body?`, `paragraphs?`. The impressum section has `heading: "Impressum"` and `paragraphs: [...]`. Since we already show the title as `<h1>` in `LegalPageLayout`, and the impressum section heading is also "Impressum", skip rendering the section heading to avoid duplication (or the layout already shows h1 and then section heading as h2 — that renders as `<h2>Impressum</h2>` after `<h1>Impressum</h1>` which is odd). 

**Decision:** Pass the section's heading as the title to LegalPageLayout and pass `sections` with heading omitted — actually just pass the sections as-is: the layout renders `h1 {title}` then `h2 {sec.heading}` if present. Since both are "Impressum", suppress the section heading by mapping it out, OR: just accept the minor duplication. Cleanest: pass `sections={impressum.sections.map(s => ({ ...s, heading: undefined }))}` so only the h1 "Impressum" shows.

- [ ] **Step 1: Create the file**

```tsx
import type { Metadata } from "next";
import { impressum } from "@/content/m3";
import { LegalPageLayout } from "@/components/sections/LegalPageLayout";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  // Strip the redundant "Impressum" section heading so it doesn't double under the h1
  const sections = (impressum.sections ?? []).map((s) => ({
    paragraphs: s.paragraphs,
    body: s.body,
    heading: s.heading === "Impressum" ? undefined : s.heading,
  }));

  return <LegalPageLayout title="Impressum" sections={sections} />;
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd C:\Users\ambiv\ambi-relaunch && npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/app/impressum/page.tsx
git commit -m "feat(m3): add /impressum route"
```

---

## Task 9: /datenschutzerklaerung route page

**Files:**
- Create: `src/app/datenschutzerklaerung/page.tsx`

Data: `datenschutz` from `@/content/m3`. Type is `LegalPage` with `.sections[i].heading` and `.sections[i].body` (no `paragraphs`). Pass directly to `LegalPageLayout`.

- [ ] **Step 1: Create the file**

```tsx
import type { Metadata } from "next";
import { datenschutz } from "@/content/m3";
import { LegalPageLayout } from "@/components/sections/LegalPageLayout";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <LegalPageLayout
      title={datenschutz.heroTitle}
      sections={datenschutz.sections}
    />
  );
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd C:\Users\ambiv\ambi-relaunch && npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/app/datenschutzerklaerung/page.tsx
git commit -m "feat(m3): add /datenschutzerklaerung route"
```

---

## Task 10: Full build verification + lint + squash commit

- [ ] **Step 1: Run tsc**

```bash
cd C:\Users\ambiv\ambi-relaunch && npx tsc --noEmit
```

Expected: 0 errors. Fix any before continuing.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: 0 errors, 0 warnings. Common issues to fix:
- `any` type — replace with correct type
- Unused imports — remove them
- `React.FormEvent` — if `React` is not imported, add `import type React from "react"` or use `import { type FormEvent } from "react"` and use `FormEvent` directly

If lint errors appear, fix them in the relevant files, then re-run lint.

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: success. Confirm these routes are listed in the build output:
- `/kontakt`
- `/jetzt-bewerben`
- `/impressum`
- `/datenschutzerklaerung`
- `/datenschutz` should show as a redirect (not a page)

- [ ] **Step 4: Squash commit with final message**

```bash
git add -A
git commit -m "feat(m3): Kontakt- & Bewerbungsformular (Phase-1 UI) + Impressum & Datenschutz (LegalPageLayout)"
```

---

## Known Gotchas & Decisions

1. **`React.FormEvent` import**: In `ContactForm.tsx` and `ApplicationForm.tsx`, `React.FormEvent` is used. Since these are `.tsx` files with `"use client"`, React is available. But if `React` is not explicitly imported and TSC complains, change `React.FormEvent` to `FormEvent` and add `import { type FormEvent } from "react"` at the top.

2. **`JSX.Element` in `LegalPageLayout`**: The `linkify` return type is `(string | JSX.Element)[]`. In modern React 19 + TS, use `React.JSX.Element` and import `type React from "react"`. Alternatively use `ReactNode` from `"react"` — but `linkify` returns a mix of strings and elements, so `(string | React.JSX.Element)[]` is most accurate. If needed, change to `(string | ReactElement)[]` with `import { type ReactElement } from "react"`.

3. **Button `target` prop**: `Button` accepts `LinkProps` which spreads `Omit<ComponentPropsWithoutRef<typeof Link>>` — `Link` supports `target` and `rel` natively, so `target="_blank"` in `MapPlaceholder` will work fine.

4. **`datenschutz.sections` type mismatch**: `datenschutz` is typed as `LegalPage` which has `sections: LegalSection[]` where `LegalSection = { heading?: string; body?: string; paragraphs?: string[] }`. `LegalPageLayout` accepts `{ heading?: string; body?: string; paragraphs?: string[] }[]`. These are structurally identical — no cast needed.

5. **`impressum.sections` nullable guard**: `impressum.sections ?? []` ensures we don't crash if the JSON is unexpected.

6. **`amber-bright` color token**: Used in form button hover state. This token is used elsewhere in the codebase (e.g., `Button.tsx`) so it is defined. Don't introduce new tokens.

7. **No `"use client"` on `FormField.tsx`**: It's a pure server component (just JSX, no hooks). It can be imported into client components without issues.

8. **`trailingSlash: true`** in `next.config.ts`: Routes must be accessed with trailing slash. Links to `/datenschutzerklaerung/` (with slash) in forms are correct.
