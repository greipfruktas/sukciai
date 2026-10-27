import Link from "next/link";
import { SellerSearchForm } from "@/features/sellers/search-form";

function HoldingPage() {
  return <main id="turinys" className="launch-page">
    <div className="launch-shell">
      <header className="launch-header"><span className="launch-wordmark">SUKČIAI<span>.LT</span></span><span>Ruošiama</span></header>
      <section className="launch-hero"><p className="eyebrow">Vartotojų saugumo portalas</p><h1>Kuriame saugesnę vietą patikrinti pardavėją.</h1><p className="launch-deck">Čia galėsite patikrinti pardavėją prieš pervesdami pinigus ir pranešti apie neįvykdytą susitarimą. Viešinsime tik administratoriaus patikrintą informaciją su aiškiai nurodytais šaltiniais.</p></section>
      <section className="launch-principles" aria-label="Portalo principai"><article><b>01</b><h2>Patikra</h2><p>Pranešimai nebus viešinami automatiškai.</p></article><article><b>02</b><h2>Šaltiniai</h2><p>Prie kiekvieno teiginio bus nurodytas jo pagrindas.</p></article><article><b>03</b><h2>Atsakymo teisė</h2><p>Susijęs asmuo ar įmonė galės pateikti savo poziciją.</p></article></section>
      <footer className="launch-footer"><p>Portalas ruošiamas atsakingam viešam startui.</p><p>Patikrinta informacija · duomenų apsauga · redakcinė peržiūra</p></footer>
    </div>
  </main>;
}

function DemoHomePage() {
  return (
    <main id="turinys">
      <aside className="demo-notice"><strong>Kuriama demonstracinė versija.</strong> Paieška naudoja tik testinius įrašus. Tikri asmenys ir nepatvirtinti pranešimai neviešinami.</aside>
      <section className="consumer-hero">
        <div className="consumer-hero__copy"><p className="eyebrow">Prieš mokant avansą</p><h1>Patikrinkite prieš pervesdami pinigus</h1><p>Ieškokite pagal telefono numerį, banko sąskaitą, įmonės kodą ar pardavėjo vardą. Rodome tik administratoriaus patikrintus ir publikuoti patvirtintus atvejus.</p></div>
        <div className="consumer-hero__search"><SellerSearchForm /></div>
      </section>
      <section className="trust-strip" aria-label="Kaip saugome informaciją"><p><strong>01</strong> Pranešimas neviešinamas automatiškai</p><p><strong>02</strong> Administratorius tikrina įrodymus ir oficialius šaltinius</p><p><strong>03</strong> Pardavėjui suteikiama teisė atsakyti</p></section>
      <section className="how-section"><div className="section-heading"><h2>Kaip tai veikia</h2><span>Patikra, ne viešas kaltinimas</span></div><div className="how-grid"><article><b>1</b><h3>Patikrinkite</h3><p>Įveskite tikslų turimą identifikatorių. Vien tai, kad rezultato nėra, negarantuoja pardavėjo patikimumo.</p></article><article><b>2</b><h3>Praneškite</h3><p>Pateikite sandorio faktus, mokėjimo informaciją ir dokumentus. Jūsų kontaktai bei neapdoroti failai lieka privatūs.</p></article><article><b>3</b><h3>Laukite patikros</h3><p>Redaktorius sutikrina informaciją. Neutralus įrašas galimas tik esant pakankamiems įrodymams.</p></article></div></section>
      <section className="consumer-warning"><div><p className="section-label">Turite dokumentų?</p><h2>Padėkite apsaugoti kitą pirkėją</h2><p>Praneškite apie neįvykdytą arba tik iš dalies įvykdytą susitarimą. Publikavimo sprendimą visada priims administratorius.</p></div><Link className="primary-link" href="/pranesti">Pranešti atvejį</Link></section>
      <section className="safety-section"><p className="section-label">Prieš pervedant</p><div className="section-heading"><h2>Keturi paprasti patikrinimai</h2></div><ol className="safety-list"><li>Patikrinkite įmonę Registrų centro ir VMI sistemose.</li><li>Sutartyje įrašykite terminą, kainą ir darbų apimtį.</li><li>Nepasitikėkite vien socialinio tinklo profiliu ar atsiliepimų ekrano nuotraukomis.</li><li>Mokėjimo paskirtyje aiškiai nurodykite, už ką mokate.</li></ol></section>
      <section className="public-funds-bridge"><div><p className="section-label">Atskira rubrika</p><h2>Viešieji pinigai</h2></div><p>Politikų ir institucijų atvejai lieka atskiroje redakcinėje erdvėje. Čia agreguojame tik oficialių institucijų ir patikimų žiniasklaidos šaltinių paskelbtą informaciją.</p><Link className="text-link" href="/viesieji-pinigai">Viešieji pinigai →</Link></section>
    </main>
  );
}

export default function HomePage() {
  return process.env.PORTAL_MODE === "demo" ? <DemoHomePage /> : <HoldingPage />;
}
