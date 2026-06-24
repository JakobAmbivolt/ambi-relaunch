"use client";

import { useState, type FormEvent } from "react";
import { FormField } from "@/components/forms/FormField";

type Errors = Partial<Record<string, string>>;

function inputClass(error?: string) {
  return `w-full border bg-white p-3 text-sm text-ink placeholder-slate-400 transition-colors focus:border-amber focus:outline-none ${
    error ? "border-red-400" : "border-line"
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

  // Zufalls-Captcha pro Render-Instanz; Frage mit suppressHydrationWarning gerendert.
  const [captchaA] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaB] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

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

  function handleSubmit(e: FormEvent) {
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
      <div className="border border-amber bg-amber/10 p-6 text-sm text-ink">
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
        <label htmlFor="bewerbung-anhang" className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
          Anhang (z.B. Lebenslauf, Zeugnisse etc.)
        </label>
        <input
          id="bewerbung-anhang"
          type="file"
          accept=".jpg,.jpeg,.jpe,.mka,.7z,.xla,.xls,.xlt,.xlw,.odg"
          className="border border-line bg-white text-sm text-text file:mr-4 file:cursor-pointer file:border-0 file:bg-amber file:px-4 file:py-2 file:font-mono file:text-xs file:font-semibold file:uppercase file:tracking-[0.12em] file:text-white hover:file:bg-amber-bright"
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
        <span className="flex items-center gap-3">
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
        </span>
      </FormField>

      <button
        type="submit"
        className="group/btn relative inline-flex items-center justify-center gap-2.5 self-start bg-amber px-6 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-amber-bright"
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 bg-current opacity-70 transition-transform duration-200 group-hover/btn:scale-150"
        />
        Senden
      </button>
    </form>
  );
}
