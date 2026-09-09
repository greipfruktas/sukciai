import { CaseCard } from "@/features/cases/case-card";
import { demoCases } from "@/features/cases/queries";

export default function SearchPage() {
  return <main id="turinys"><header className="index-header"><p className="section-label">Patikrinta informacija</p><h1>Atvejų registras</h1><p>Ieškokite pagal asmenį, instituciją, savivaldybę ar bylos numerį.</p></header><form className="search-form"><label htmlFor="q">Paieška</label><div><input id="q" name="q" type="search" placeholder="Vardas, institucija arba bylos numeris"/><button type="submit">Ieškoti</button></div></form><aside className="demo-notice"><strong>Demonstraciniai duomenys.</strong> Paieškos indeksas dar neprijungtas prie patvirtinto istorinio rinkinio.</aside><div className="case-list">{demoCases.map((item) => <CaseCard item={item} key={item.slug} />)}</div></main>;
}
