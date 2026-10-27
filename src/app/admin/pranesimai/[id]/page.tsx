import { ConsumerReviewPanel } from "@/features/admin/consumer-review-panel";

const demoReport = { id: "report-demo", version: 2, seller: "Demonstracinis pardavėjas", identifiers: ["Telefonas: +370 6•• ••999", "Įmonės kodas: 123456789"], matchingReports: 1, amount: "1 250 Eur", workStatus: "Darbai neatlikti", description: "Sumokėtas avansas, tačiau sutartas statinys nepristatytas.", evidence: [{ name: "pavedimas.pdf", type: "Mokėjimo dokumentas" }], missingEvidence: ["Sutartis arba užsakymo patvirtinimas"], responseDeadline: "2026-11-03", recommendation: "Stebėti – vienas patikrintas pranešimas, nėra oficialaus dokumento" };

export default function ConsumerReportReviewPage() { return <main id="turinys"><ConsumerReviewPanel report={demoReport} role="publisher" /></main>; }
