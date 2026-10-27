import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Kontaktai | Sukčiai.lt", description: "Susisiekite su Sukčiai.lt redakcija." };

export default function ContactsPage() {
  return <main id="turinys" className="info-page">
    <header className="index-header"><p className="section-label">Kontaktai</p><h1>Susisiekite su redakcija</h1><p>Pranešimams apie galimą nesąžiningą pardavėją, paskelbtos informacijos patikslinimams ir bendriems klausimams naudojame atskirus kelius.</p></header>
    <div className="contact-grid">
      <section className="contact-card contact-card--primary"><p className="section-label">Naujas atvejis</p><h2>Turite dokumentų?</h2><p>Naudokite struktūruotą pranešimo formą. Demonstracinėje versijoje užpildyti duomenys į serverį nesiunčiami.</p><Link className="contact-action" href="/pranesti">Pranešti atvejį →</Link></section>
      <section className="contact-card"><p className="section-label">Redakcija</p><h2>Bendri klausimai</h2><p>Dėl metodikos, partnerystės ar oficialių šaltinių pateikimo rašykite redakcijai.</p><a className="contact-action" href="mailto:redakcija@sukciai.lt">redakcija@sukciai.lt</a></section>
      <section className="contact-card"><p className="section-label">Pataisymas</p><h2>Informacija apie jus?</h2><p>Jei norite ginčyti teiginį, pateikti poziciją arba prašyti ištaisyti netikslumą, nurodykite konkretų įrašą ir pagrindžiančius šaltinius.</p><Link className="contact-action" href="/pataisymai">Pataisymai ir atsakymo teisė →</Link></section>
    </div>
    <aside className="provenance-note"><strong>Svarbu.</strong><p>El. paštu nesiųskite banko prisijungimų, slaptažodžių ar perteklinių asmens dokumentų kopijų. Skubios grėsmės ar vykstančio nusikaltimo atveju kreipkitės į policiją numeriu 112.</p></aside>
  </main>;
}
