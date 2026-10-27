import Link from "next/link";

export default function ConsumerReportQueuePage() {
  return <main id="turinys"><p className="eyebrow">Administravimas</p><h1>Vartotojų pranešimai</h1><div className="admin-metrics"><p><strong>1</strong>Laukia pirminės patikros</p><p><strong>0</strong>Baigiasi atsakymo terminas</p><p><strong>0</strong>Parengta publikacijai</p></div><ul className="review-queue"><li><div><Link href="/admin/pranesimai/report-demo">Demonstracinis pardavėjas</Link><p>1 250 Eur · darbai neatlikti · 1 galimas sutapimas</p></div><span>Trūksta 1 dokumento</span></li></ul></main>;
}
