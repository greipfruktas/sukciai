"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const DRAFT_KEY = "sukciai-report-draft";
type Draft = Record<string, string | boolean>;
const steps = ["Jūsų kontaktai", "Pardavėjas", "Sandoris", "Darbų rezultatas", "Patvirtinimas"];

export function ReportForm() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    // The draft is an external browser store and can only be restored after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) { try { setDraft(JSON.parse(saved)); } catch { localStorage.removeItem(DRAFT_KEY); } }
  }, []);

  function update(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const value = event.target instanceof HTMLInputElement && event.target.type === "checkbox" ? event.target.checked : event.target.value;
    const next = { ...draft, [event.target.name]: value };
    setDraft(next); localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  }

  function next() {
    if (step === 0 && (!draft.reporterName || !draft.email || !draft.phone)) { setError("Užpildykite vardą, el. paštą ir telefoną."); return; }
    if (step === 1 && ![draft.sellerName, draft.sellerPhone, draft.iban, draft.companyCode, draft.website, draft.facebook].some(Boolean)) { setError("Nurodykite bent vieną pardavėjo identifikatorių."); return; }
    if (step === 2 && (!draft.amount || !draft.paymentDate || !draft.description)) { setError("Nurodykite sumą, mokėjimo datą ir aprašymą."); return; }
    if (step === 3 && !draft.workStatus) { setError("Pasirinkite darbų būseną."); return; }
    setError(""); setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.authenticityConfirmed) { setError("Patvirtinkite, kad pateikta informacija yra teisinga."); return; }
    localStorage.removeItem(DRAFT_KEY); setSent(true); setError("");
  }

  if (sent) return <div className="submission-success" role="status"><p className="section-label">Juodraštis parengtas</p><h2>Pranešimo forma užpildyta</h2><p>Demonstracinėje aplinkoje duomenys į serverį nesiunčiami. Gamybinį pateikimą įjungsime tik prijungę privatų failų saugojimą, kontaktų patvirtinimą ir administratoriaus prisijungimą.</p></div>;

  return <form className="report-form" onSubmit={submit}><div className="form-progress"><span>{step + 1} iš 5</span><ol>{steps.map((label, index) => <li className={index === step ? "active" : index < step ? "done" : ""} key={label}>{label}</li>)}</ol></div><div className="form-stage"><p className="section-label">{steps[step]}</p>{step === 0 ? <><label>Jūsų vardas ir pavardė<input name="reporterName" value={String(draft.reporterName || "")} onChange={update} autoComplete="name" /></label><label>El. paštas<input name="email" type="email" value={String(draft.email || "")} onChange={update} autoComplete="email" /></label><label>Telefono numeris<input name="phone" value={String(draft.phone || "")} onChange={update} autoComplete="tel" /></label></> : null}{step === 1 ? <div className="form-grid"><label>Vardas arba pavadinimas<input name="sellerName" value={String(draft.sellerName || "")} onChange={update} /></label><label>Telefono numeris<input name="sellerPhone" value={String(draft.sellerPhone || "")} onChange={update} /></label><label>Banko sąskaita<input name="iban" value={String(draft.iban || "")} onChange={update} /></label><label>Įmonės kodas<input name="companyCode" value={String(draft.companyCode || "")} onChange={update} /></label><label>Svetainė<input name="website" value={String(draft.website || "")} onChange={update} /></label><label>Facebook nuoroda<input name="facebook" value={String(draft.facebook || "")} onChange={update} /></label></div> : null}{step === 2 ? <><div className="form-grid"><label>Pervesta suma, Eur<input name="amount" type="number" min="0.01" step="0.01" value={String(draft.amount || "")} onChange={update} /></label><label>Mokėjimo data<input name="paymentDate" type="date" value={String(draft.paymentDate || "")} onChange={update} /></label><label>Pažadėtas terminas<input name="promisedDate" type="date" value={String(draft.promisedDate || "")} onChange={update} /></label><label>Policijos ar institucijos numeris<input name="officialReference" value={String(draft.officialReference || "")} onChange={update} /></label></div><label>Kas įvyko?<textarea name="description" rows={7} value={String(draft.description || "")} onChange={update} /></label></> : null}{step === 3 ? <><label>Darbų būsena<select name="workStatus" value={String(draft.workStatus || "")} onChange={update}><option value="">Pasirinkite</option><option value="not_done">Neatlikti</option><option value="partially_done">Atlikti iš dalies</option><option value="late">Atlikti pavėluotai</option><option value="defective">Atlikti su trūkumais</option></select></label><label>Papildomas paaiškinimas<textarea name="workDetails" rows={6} value={String(draft.workDetails || "")} onChange={update} /></label></> : null}{step === 4 ? <><div className="privacy-confirmation"><h2>Prieš pateikiant</h2><p>Administratorius patikrins dokumentus ir oficialius šaltinius. Pranešimas nebus publikuojamas automatiškai.</p></div><label className="checkbox-label"><input name="authenticityConfirmed" type="checkbox" checked={Boolean(draft.authenticityConfirmed)} onChange={update} /> Patvirtinu, kad pateikta informacija ir dokumentai yra autentiški.</label></> : null}<div className="form-actions">{step > 0 ? <button type="button" className="secondary-action" onClick={() => { setStep((current) => current - 1); setError(""); }}>Atgal</button> : null}{step < steps.length - 1 ? <button type="button" onClick={next}>Toliau</button> : <button type="submit">Pateikti patikrai</button>}</div>{error ? <p className="form-error" role="alert">{error}</p> : null}</div><aside className="evidence-uploader"><label htmlFor="evidence-files">Įrodymai</label><input id="evidence-files" name="evidence" type="file" accept="image/jpeg,image/png,application/pdf" multiple /><p>Iki 10 JPG, PNG arba PDF failų. Failai nėra viešinami automatiškai.</p></aside><p className="local-draft-note">Juodraštis saugomas tik šiame įrenginyje, kol pateiksite formą.</p></form>;
}
