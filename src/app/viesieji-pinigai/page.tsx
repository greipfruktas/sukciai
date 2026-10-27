import { CaseCard } from "@/features/cases/case-card";
import { demoCases } from "@/features/cases/queries";

export default function PublicFundsPage() {
  return <main id="turinys"><header className="index-header"><p className="section-label">Atskira redakcinė skiltis</p><h1>Viešieji pinigai</h1><p>Institucijų sprendimai, savivaldybių išlaidos ir viešųjų lėšų naudojimo atvejai. Ši skiltis atskirta nuo vartotojų pardavėjų patikros.</p></header><aside className="demo-notice"><strong>Demonstraciniai duomenys.</strong> Tikri atvejai bus rodomi tik su patikrintais viešais šaltiniais.</aside><div className="case-list">{demoCases.map((item) => <CaseCard item={item} key={item.slug} />)}</div></main>;
}
