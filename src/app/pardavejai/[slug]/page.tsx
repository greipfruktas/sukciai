import { notFound } from "next/navigation";
import { SourceList } from "@/features/cases/source-list";
import { demoSeller } from "@/features/sellers/demo-data";

const labels = {
  verified_dispute: "Redakcijos patikrintas vartotojo ginčas",
  repeated_pattern: "Pasikartojančių pranešimų perspėjimas",
  official_process: "Oficialus institucijos procesas",
};

export default async function SellerPage({ params }: { params: Promise<{ slug: string }> }) {
  if ((await params).slug !== demoSeller.slug) notFound();
  return <main id="turinys" className="article-page seller-profile"><p className="section-label">Pardavėjo patikra · demonstracija</p><h1>{demoSeller.displayName}</h1><p className="article-deck">{demoSeller.summary}</p><p className="status-label"><span>{labels[demoSeller.status]}</span></p><aside className="demo-notice"><strong>Demonstraciniai duomenys.</strong> Profilis nėra susijęs su tikru žmogumi ar įmone.</aside><div className="article-layout"><article><h2>Patikros chronologija</h2><ol className="timeline">{demoSeller.timeline.map((event) => <li key={event.date}><time dateTime={event.date}>{event.date}</time><div><h3>{event.title}</h3><p>{event.description}</p></div></li>)}</ol><h2>Pardavėjo pozicija</h2><p>{demoSeller.sellerResponse}</p><h2>Šaltiniai</h2><SourceList sources={demoSeller.sources} /></article><aside className="fact-file"><h2>Susieti duomenys</h2><dl>{demoSeller.identifiers.map((identifier) => <div key={`${identifier.type}-${identifier.maskedValue}`}><dt>{identifier.type === "phone" ? "Telefonas" : "Banko sąskaita"}</dt><dd>{identifier.maskedValue}</dd></div>)}<dt>Būsena</dt><dd>{labels[demoSeller.status]}</dd></dl><p className="privacy-note">Pilni telefono ir sąskaitos duomenys viešai nerodomi. Paieška veikia tik pagal tikslų sutapimą.</p></aside></div></main>;
}
