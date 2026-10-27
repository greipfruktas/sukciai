import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Metodika | Sukčiai.lt", description: "Kaip Sukčiai.lt tikrina pranešimus, šaltinius ir priima publikavimo sprendimus." };

const principles = [
  ["01", "Pranešimas", "Vartotojo pateikta informacija yra signalas patikrai, o ne viešas kaltinimas."],
  ["02", "Patvirtinimas", "Redaktorius sutikrina dokumentus, tapatybę ir informaciją oficialiuose šaltiniuose."],
  ["03", "Atsakymo teisė", "Prieš publikavimą susijusiam asmeniui ar įmonei suteikiama galimybė pateikti poziciją."],
  ["04", "Sprendimas", "Publikuojami tik pakankamai pagrįsti faktai, nurodant jų šaltinius ir procesinę būseną."],
] as const;

export default function MethodologyPage() {
  return <main id="turinys" className="info-page">
    <header className="index-header"><p className="section-label">Redakcinis standartas</p><h1>Kaip tikriname informaciją</h1><p>Sukčiai.lt neatlieka pirminių tyrimų ir nenustato kaltės. Portalas surenka informaciją, tikrina ją pagal dokumentus bei patikimus šaltinius ir aiškiai parodo, kuo remiasi kiekvienas paskelbtas teiginys.</p></header>
    <ol className="principle-list">{principles.map(([number, title, text]) => <li key={number}><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div></li>)}</ol>
    <div className="policy-grid"><article className="policy-copy">
      <section><p className="section-label">Publikavimo slenkstis</p><h2>Kas gali būti paskelbta</h2><p>Pranešimas neviešinamas automatiškai. Publikavimo sprendimą priima administratorius tik tada, kai galima patikrinti sandorį, mokėjimą, neįvykdytą įsipareigojimą ir pranešimo autoriaus ryšį su įvykiu.</p><p>Policijai pateiktas pareiškimas ar bylos numeris yra svarbus patikros elementas, tačiau savaime neįrodo asmens kaltės. Tekste atskiriame patvirtintus faktus, pareiškėjo teiginius ir institucijų sprendimus.</p></section>
      <section><p className="section-label">Šaltiniai</p><h2>Kuo remiamės</h2><p>Pirmenybę teikiame teismų, policijos, prokuratūros, VMI, Registrų centro, VTEK, savivaldybių ir kitų kompetentingų institucijų paskelbtai informacijai. Žiniasklaidos publikacijos naudojamos tik nurodant originalų leidėją ir nuorodą.</p><p>Šaltiniui pasikeitus ar tapus neprieinamam, įrašas peržiūrimas. Portalas neprisiima kito leidėjo tyrimo autorystės.</p></section>
      <section><p className="section-label">Duomenų mažinimas</p><h2>Ką slepiame</h2><p>Pilni telefono numeriai ir banko sąskaitos viešai nerodomi. Jie gali būti naudojami tik tikslaus sutapimo paieškai. Neskelbiame pranešėjo kontaktų, neapdorotų įrodymų ar duomenų, kurie nėra būtini vartotojų apsaugos tikslui.</p></section>
    </article><aside className="fact-file policy-aside"><h2>Sprendimo principai</h2><dl><dt>Automatinis viešinimas</dt><dd>Nėra</dd><dt>Šaltiniai prie teiginių</dt><dd>Privalomi</dd><dt>Pardavėjo pozicija</dt><dd>Prašoma prieš publikavimą</dd><dt>Neaiškumas</dt><dd>Publikavimas atidedamas</dd></dl><Link className="text-link" href="/pataisymai">Pateikti pataisymą →</Link></aside></div>
  </main>;
}
