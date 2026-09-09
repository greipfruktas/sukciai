import { CaseCard } from "@/features/cases/case-card";
import { demoCases } from "@/features/cases/queries";

export default function MunicipalityPage() {
  return <main id="turinys"><header className="index-header"><p className="section-label">Savivaldybė</p><h1>Demonstracinė savivaldybė</h1><p>Patvirtinti atvejai ir dabartinės jų procesinės būsenos.</p></header><aside className="demo-notice"><strong>Demonstraciniai duomenys.</strong> Tai maketo puslapis, ne tikros savivaldybės suvestinė.</aside><div className="case-list">{demoCases.slice(0, 2).map((item) => <CaseCard item={item} key={item.slug} />)}</div></main>;
}
