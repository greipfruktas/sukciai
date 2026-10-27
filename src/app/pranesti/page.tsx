import { ReportForm } from "@/features/reports/report-form";

export default function ReportPage() {
  return <main id="turinys" className="report-page"><header className="index-header"><p className="section-label">Pranešti atvejį</p><h1>Pateikite faktus ir dokumentus</h1><p>Pranešimas nepasirodys viešai, kol administratorius nepatikrins įrodymų, oficialių šaltinių ir pardavėjo pozicijos.</p></header><ReportForm /></main>;
}
