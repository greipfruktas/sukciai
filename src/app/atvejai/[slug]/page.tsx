import { notFound } from "next/navigation";
import { getCaseBySlug } from "@/features/cases/queries";
import { SourceList } from "@/features/cases/source-list";
import { StatusLabel } from "@/features/cases/status-label";
import { Timeline } from "@/features/cases/timeline";

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const item = getCaseBySlug((await params).slug);
  if (!item) notFound();
  return (
    <main id="turinys" className="article-page">
      <p className="section-label">{item.kicker}</p><h1>{item.title}</h1><p className="article-deck">{item.summary}</p><StatusLabel status={item.status} date={item.statusDate} />
      <aside className="provenance-note"><strong>Apie šią santrauką</strong><p>Portalas neatlieka pirminio tyrimo. Ši santrauka parengta pagal žemiau nurodytus viešus šaltinius.</p></aside>
      <div className="article-layout"><article><h2>Patvirtinti faktai</h2>{item.claims.map((claim) => <p className="claim" key={claim.text}>{claim.text} <a href={`#saltinis-${claim.sourceIndex}`} aria-label={`Šaltinis ${claim.sourceIndex}`}>[{claim.sourceIndex}]</a></p>)}<h2>Chronologija</h2><Timeline events={item.timeline} /><h2>Šaltiniai</h2><SourceList sources={item.sources} /></article><aside className="fact-file"><h2>Atvejo duomenys</h2><dl><dt>Asmuo</dt><dd>{item.person}</dd><dt>Institucija</dt><dd>{item.institution}</dd><dt>Savivaldybė</dt><dd>{item.municipality}</dd>{item.amount ? <><dt>Minima suma</dt><dd>{item.amount}</dd></> : null}<dt>Šaltinių skaičius</dt><dd>{item.sourceCount}</dd></dl></aside></div>
    </main>
  );
}
