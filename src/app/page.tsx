import { CaseCard } from "@/features/cases/case-card";
import { demoCases } from "@/features/cases/queries";

export default function HomePage() {
  const [lead, ...latest] = demoCases;
  return (
    <main id="turinys">
      <aside className="demo-notice"><strong>Demonstraciniai duomenys.</strong> Kol neprijungti ir redakcijos patikrinti tikrieji šaltiniai, šiame makete nerodomi realūs asmenys ar kaltinimai.</aside>
      <section className="news-wire" aria-label="Naujausi būsenų pakeitimai"><p>Naujausi pakeitimai</p><a href={`/atvejai/${demoCases[2].slug}`}><time>09:02</time> Tyrimas nutrauktas</a><a href={`/atvejai/${demoCases[0].slug}`}><time>08:31</time> Paskelbtas galutinis sprendimas</a></section>
      <section className="lead-grid">
        <div className="lead-grid__main"><p className="section-label">Naujausia</p><CaseCard item={lead} featured /></div>
        <div className="lead-grid__side"><p className="section-label">Svarbu žinoti</p><h2>Čia nėra „kaltųjų sąrašo“</h2><p>Kiekvienas atvejis rodo dabartinę procesinę būseną. Nutraukimas, išteisinimas ar sprendimo pakeitimas gauna tokį pat matomumą.</p><a className="text-link" href="/metodika">Kaip tikriname informaciją →</a></div>
      </section>
      <section className="latest-section"><div className="section-heading"><h2>Naujausi patvirtinti atvejai</h2><a href="/paieska">Visas registras →</a></div><div className="case-list">{latest.map((item) => <CaseCard item={item} key={item.slug} />)}</div></section>
      <section className="topic-grid"><div><p className="section-label">Skaidrinam</p><h2>Savivaldybių tarybų narių išlaidų duomenys vienoje vietoje</h2><p>Filtruokite pagal savivaldybę, laikotarpį ir dabartinę atvejo būseną.</p><a className="text-link" href="/skaidrinam">Atverti rinkinį →</a></div><div className="method-box"><p className="section-label">Mūsų vaidmuo</p><h2>Agreguojame, netiriame</h2><p>Portalas neatlieka pirminio tyrimo. Santraukos rengiamos pagal nurodytus viešus šaltinius. Kiekvienas faktinis teiginys turi būti atsekamas iki dokumento ar publikacijos.</p><a className="text-link" href="/metodika">Šaltinių ir publikavimo politika →</a></div></section>
    </main>
  );
}
