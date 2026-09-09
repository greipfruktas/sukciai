import { CaseCard } from "@/features/cases/case-card";
import { demoCases } from "@/features/cases/queries";

export default function SkaidrinamPage() {
  return <main id="turinys"><header className="index-header"><p className="section-label">Teminis rinkinys</p><h1>Skaidrinam</h1><p>Tarybos narių išlaidų ir jas vertinusių institucijų sprendimų registras.</p></header><aside className="demo-notice"><strong>Demonstraciniai duomenys.</strong> Tikrasis istorinis rinkinys bus viešinamas tik patikrinus kiekvieną įrašą ir jo šaltinius.</aside><div className="filters" aria-label="Atvejų filtrai"><label>Savivaldybė<select><option>Visos savivaldybės</option></select></label><label>Būsena<select><option>Visos būsenos</option></select></label><label>Laikotarpis<select><option>2021–2026</option></select></label></div><div className="case-list">{demoCases.map((item) => <CaseCard item={item} key={item.slug} />)}</div></main>;
}
