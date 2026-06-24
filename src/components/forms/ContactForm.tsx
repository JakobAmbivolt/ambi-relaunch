"use client";

import { useState, type FormEvent } from "react";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Errors = Partial<Record<string, string>>;

// Endpunkt: PHP-Skript, das per mail() an anfrage@ambivolt.de versendet.
// Läuft nur auf PHP-fähigem Hosting (siehe public/kontakt.php).
const ENDPOINT = "/kontakt.php";

function fieldClass(error?: string) {
  return `w-full border bg-white px-4 py-3 text-sm text-ink placeholder-text/50 outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/15 ${
    error ? "border-red-400" : "border-line"
  }`;
}

export function ContactForm() {
  const [profil, setProfil] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [datenschutz, setDatenschutz] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

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
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return; // Spam-Bot
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setServerError(null);
    setSending(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profil,
          name,
          email,
          telefon,
          nachricht,
          datenschutz,
          website: honeypot,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setSubmitted(true);
      } else {
        setServerError(
          data?.error ??
            "Der Versand ist fehlgeschlagen. Bitte kontaktieren Sie uns direkt per Telefon oder E-Mail."
        );
      }
    } catch {
      setServerError(
        "Der Versand ist fehlgeschlagen. Bitte kontaktieren Sie uns direkt per Telefon oder E-Mail."
      );
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="relative border border-line border-t-2 border-t-green bg-surface p-6 text-sm text-ink">
        <p className="flex items-center gap-2 font-display font-bold">
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center border border-green/40 bg-green/10">
            <Icon name="check" className="h-3.5 w-3.5 text-green" />
          </span>
          Vielen Dank!
        </p>
        <p className="mt-2 text-text">
          Ihre Nachricht wurde gesendet. Wir melden uns schnellstmöglich bei Ihnen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot — für echte Nutzer unsichtbar, fängt simple Bots ab */}
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

      {/* Reihe 1: Profil + Name */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Ihr Profil" required error={errors.profil}>
          <div className="relative">
            <select
              value={profil}
              onChange={(ev) => setProfil(ev.target.value)}
              className={`${fieldClass(errors.profil)} appearance-none pr-10 ${
                profil ? "text-ink" : "text-text/60"
              }`}
            >
              <option value="">Bitte wählen …</option>
              <option value="Eigenanlagen-Betreiber">Eigenanlagen-Betreiber</option>
              <option value="PV-Profi">PV-Profi</option>
            </select>
            <Icon
              name="chevron"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text"
            />
          </div>
        </FormField>

        <FormField label="Name" required error={errors.name}>
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Ihr Name"
            autoComplete="name"
            className={fieldClass(errors.name)}
          />
        </FormField>
      </div>

      {/* Reihe 2: E-Mail + Telefon (mit Icon) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="E-Mail-Adresse" required error={errors.email}>
          <div className="relative">
            <Icon
              name="mail"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber"
            />
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="ihre@email.de"
              autoComplete="email"
              className={`${fieldClass(errors.email)} pl-10`}
            />
          </div>
        </FormField>

        <FormField label="Telefon" required error={errors.telefon}>
          <div className="relative">
            <Icon
              name="phone"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber"
            />
            <input
              type="tel"
              value={telefon}
              onChange={(ev) => setTelefon(ev.target.value)}
              placeholder="08722 – 966 85 77"
              autoComplete="tel"
              className={`${fieldClass(errors.telefon)} pl-10`}
            />
          </div>
        </FormField>
      </div>

      {/* Nachricht */}
      <FormField label="Nachricht" error={errors.nachricht}>
        <textarea
          value={nachricht}
          onChange={(ev) => setNachricht(ev.target.value)}
          rows={5}
          placeholder="Ihre optionale Nachricht …"
          className={fieldClass(errors.nachricht)}
        />
      </FormField>

      {/* Datenschutz */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-text">
          <input
            type="checkbox"
            checked={datenschutz}
            onChange={(ev) => setDatenschutz(ev.target.checked)}
            className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-none border border-line accent-amber"
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
            Zweck der Kontaktaufnahme verarbeitet werden. *
          </span>
        </label>
        {errors.datenschutz && (
          <p className="pl-7 font-mono text-xs text-red-600">{errors.datenschutz}</p>
        )}
      </div>

      {/* Absenden */}
      <div className="mt-1 flex flex-wrap items-center justify-end gap-x-5 gap-y-3 border-t border-line pt-5">
        {serverError && (
          <p className="w-full text-right font-mono text-xs text-red-600" role="alert">
            {serverError}
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={sending}
          className="disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Senden …" : "Absenden"}
        </Button>
      </div>
    </form>
  );
}
