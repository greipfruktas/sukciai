import { CaseCard } from "@/features/cases/case-card";
import { demoCases } from "@/features/cases/queries";

export default function PersonPage() {
  return <main id="turinys"><header className="index-header"><p className="section-label">Asmens profilis</p><h1>Demonstracinis asmuo</h1><p>Čia rodomi tik su patvirtintais viešais šaltiniais susieti atvejai ir jų dabartinė būsena.</p></header><aside className="demo-notice"><strong>Demonstraciniai duomenys.</strong> Tai nėra realaus asmens profilis ar kaltųjų sąrašas.</aside><div className="case-list"><CaseCard item={demoCases[0]} /></div></main>;
}
