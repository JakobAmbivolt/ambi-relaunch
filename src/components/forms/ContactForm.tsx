"use client";

import { useState, type FormEvent } from "react";
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

  // Zufalls-Captcha pro Render-Instanz; Frage wird mit suppressHydrationWarning
  // gerendert, damit der (abweichende) Client-Wert ohne Hydration-Warnung gilt.
  const [captchaA] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaB] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

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

  function handleSubmit(e: FormEvent) {
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
            gelesen und bin damit einverstanden, dass die hier eingegebenen Informationen zum
            Zweck der Kontaktaufnahme gespeichert werden. *
          </span>
        </label>
        {errors.datenschutz && (
          <p className="pl-7 text-sm text-red-600">{errors.datenschutz}</p>
        )}
      </div>

      {/* Math captcha */}
      <FormField label="Sicherheitsfrage" required error={errors.captcha}>
        <div className="flex items-center gap-3">
          <span suppressHydrationWarning className="whitespace-nowrap text-sm font-medium text-ink">
            {captchaA} + {captchaB} =
          </span>
          <input
            type="number"
            value={captchaAnswer}
            onChange={(ev) => setCaptchaAnswer(ev.target.value)}
            placeholder="Ergebnis"
            className={inputClass(errors.captcha)}
          />
        </div>
      </FormField>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 self-start bg-amber px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-amber-bright"
      >
        Senden
      </button>
    </form>
  );
}
