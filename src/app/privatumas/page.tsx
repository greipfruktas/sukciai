import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privatumas | Sukčiai.lt", description: "Sukčiai.lt demonstracinės versijos privatumo informacija." };

export default function PrivacyPage() {
  return <main id="turinys" className="info-page">
    <header className="index-header"><p className="section-label">Privatumas</p><h1>Mažiau duomenų, mažiau rizikos</h1><p>Šiame puslapyje paaiškiname dabartinės demonstracinės versijos veikimą. Tikro pranešimų priėmimo neįjungsime, kol nebus parengta privati saugykla, prieigos kontrolė ir galutinė teisinė privatumo informacija.</p></header>
    <aside className="demo-notice"><strong>Demonstracinė versija.</strong> Pranešimo formos duomenys į serverį nesiunčiami.</aside>
    <div className="policy-grid"><article className="policy-copy">
      <section><p className="section-label">Forma</p><h2>Kur lieka juodraštis</h2><p>Pildant pranešimo formą juodraštis laikinai saugomas tik šiame įrenginyje, jūsų naršyklės vietinėje saugykloje. Paspaudus galutinį pateikimo mygtuką demonstraciniai duomenys iš vietinio juodraščio pašalinami ir į serverį nesiunčiami.</p></section>
      <section><p className="section-label">Paieška</p><h2>Jautrūs identifikatoriai</h2><p>Telefono numeriai ir banko sąskaitos nėra rodomi viešai. Ateityje jų paieška veiks tik pagal visą tikslią reikšmę, o saugojimui bus naudojamos vienkryptės techninės žymos. Paieškos reikšmės neturi patekti į viešus URL adresus.</p></section>
      <section><p className="section-label">Viešinimas</p><h2>Duomenų mažinimas</h2><p>Publikuojant patikrintą atvejį turi būti rodoma tik vartotojų apsaugai būtina informacija. Pranešėjo kontaktai, neapdoroti dokumentai ir pertekliniai asmens duomenys neviešinami.</p></section>
      <section><p className="section-label">Jūsų teisės</p><h2>Pataisymas ir pašalinimas</h2><p>Dėl su jumis susijusios informacijos, netikslumo ištaisymo ar privatumo klausimo kreipkitės adresu <a href="mailto:redakcija@sukciai.lt">redakcija@sukciai.lt</a>. Nurodykite konkretų puslapį, tačiau el. paštu nesiųskite perteklinių asmens dokumentų.</p></section>
    </article><aside className="fact-file policy-aside"><h2>Dabar</h2><dl><dt>Serverio duomenų bazė</dt><dd>Formai nenaudojama</dd><dt>Failų įkėlimas</dt><dd>Neaktyvus</dd><dt>Juodraštis</dt><dd>Tik jūsų naršyklėje</dd><dt>Automatinis publikavimas</dt><dd>Nėra</dd></dl></aside></div>
  </main>;
}
