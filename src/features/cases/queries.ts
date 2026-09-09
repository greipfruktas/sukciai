import type { CaseCardItem } from "./case-card";

export type PublicCase = CaseCardItem & {
  kicker: string; person: string; institution: string; amount?: string;
  claims: { text: string; sourceIndex: number }[];
  timeline: { date: string; title: string; description: string; sourceUrl: string }[];
  sources: { title: string; publisher: string; publishedAt: string; documentNumber?: string; url: string }[];
};

export const demoCases: PublicCase[] = [
  {
    slug: "galutinis-institucijos-sprendimas", kicker: "Galutinis sprendimas",
    title: "Institucija paskelbė galutinį sprendimą dėl viešųjų lėšų naudojimo",
    summary: "Demonstracinė santrauka rodo, kaip atrodys tik oficialiu dokumentu patvirtintas atvejis, kai bus prijungti tikrieji šaltiniai.",
    status: "final_decision", statusDate: "2026-09-08", municipality: "Demonstracinė savivaldybė", sourceCount: 2,
    person: "Demonstracinis asmuo", institution: "Demonstracinė institucija", amount: "12 480 Eur",
    claims: [{ text: "Galutinį sprendimą paskelbė kompetentinga institucija.", sourceIndex: 1 }, { text: "Nurodyta suma šiame makete yra demonstracinė.", sourceIndex: 2 }],
    timeline: [{ date: "2026-09-08", title: "Paskelbtas galutinis sprendimas", description: "Įvykio tekstas būtų generuojamas tik iš dokumentu pagrįsto teiginio.", sourceUrl: "#saltinis-1" }, { date: "2026-06-14", title: "Gautas pirminis institucijos pranešimas", description: "Ankstesnė būsena išlieka matoma chronologijoje.", sourceUrl: "#saltinis-2" }],
    sources: [{ title: "Demonstracinis galutinio sprendimo įrašas", publisher: "Testinė redakcijos aplinka", publishedAt: "2026-09-08", documentNumber: "DEMO-01", url: "#saltinis-1" }, { title: "Demonstracinis pirminis pranešimas", publisher: "Testinė redakcijos aplinka", publishedAt: "2026-06-14", documentNumber: "DEMO-02", url: "#saltinis-2" }],
  },
  {
    slug: "tyrimas-del-islaidu", kicker: "Tvirtinimo eilėje", title: "Paskelbta informacija apie pradėtą išlaidų patikrinimą",
    summary: "Nebaigto proceso pavyzdys: toks turinys viešai pasirodytų tik po administratoriaus patvirtinimo.", status: "investigation_started", statusDate: "2026-09-05", municipality: "Pajūrio savivaldybė", sourceCount: 1,
    person: "Demonstracinis asmuo", institution: "Kontrolės institucija", claims: [{ text: "Institucija pranešė apie pradėtą patikrinimą.", sourceIndex: 1 }],
    timeline: [{ date: "2026-09-05", title: "Pradėtas patikrinimas", description: "Procesas nėra baigtas.", sourceUrl: "#saltinis-1" }], sources: [{ title: "Demonstracinis institucijos pranešimas", publisher: "Testinė redakcijos aplinka", publishedAt: "2026-09-05", url: "#saltinis-1" }],
  },
  {
    slug: "tyrimas-nutrauktas", kicker: "Būsena atnaujinta", title: "Institucija pranešė, kad demonstracinis tyrimas nutrauktas",
    summary: "Paneigianti ar procesą užbaigianti informacija portale rodoma tokiu pačiu matomumu kaip ankstesnis pranešimas.", status: "investigation_closed", statusDate: "2026-09-02", municipality: "Aukštaitijos savivaldybė", sourceCount: 1,
    person: "Kitas demonstracinis asmuo", institution: "Demonstracinė institucija", claims: [{ text: "Institucija paskelbė, kad procesas nutrauktas.", sourceIndex: 1 }],
    timeline: [{ date: "2026-09-02", title: "Tyrimas nutrauktas", description: "Atnaujinta dabartinė atvejo būsena.", sourceUrl: "#saltinis-1" }], sources: [{ title: "Demonstracinis pranešimas apie nutraukimą", publisher: "Testinė redakcijos aplinka", publishedAt: "2026-09-02", url: "#saltinis-1" }],
  },
];

export function getCaseBySlug(slug: string) { return demoCases.find((item) => item.slug === slug); }
