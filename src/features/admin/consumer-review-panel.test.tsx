import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ConsumerReviewPanel } from "./consumer-review-panel";

const report = {
  id: "report-demo",
  version: 2,
  seller: "Demonstracinis pardavėjas",
  identifiers: ["Telefonas: +370 6•• ••999", "Įmonės kodas: 123456789"],
  matchingReports: 1,
  amount: "1 250 Eur",
  workStatus: "Darbai neatlikti",
  description: "Sumokėtas avansas, tačiau sutartas statinys nepristatytas.",
  evidence: [{ name: "pavedimas.pdf", type: "Mokėjimo dokumentas" }],
  missingEvidence: ["Sutartis arba užsakymo patvirtinimas"],
  responseDeadline: "2026-11-03",
  recommendation: "Stebėti – vienas patikrintas pranešimas, nėra oficialaus dokumento",
};

it("shows evidence, matches, missing documents, deadline and policy recommendation", () => {
  render(<ConsumerReviewPanel report={report} role="publisher" />);
  expect(screen.getByText("pavedimas.pdf")).toBeVisible();
  expect(screen.getByText(/1 ankstesnis sutapimas/i)).toBeVisible();
  expect(screen.getByText("Sutartis arba užsakymo patvirtinimas")).toBeVisible();
  expect(screen.getByText(/2026-11-03/)).toBeVisible();
  expect(screen.getByText(/Stebėti – vienas patikrintas/i)).toBeVisible();
});

it("only gives publication controls to a publisher", () => {
  const { rerender } = render(<ConsumerReviewPanel report={report} role="viewer" />);
  expect(screen.queryByRole("button", { name: /publikuoti/i })).not.toBeInTheDocument();
  expect(screen.getByText(/tik peržiūros režimas/i)).toBeVisible();
  rerender(<ConsumerReviewPanel report={report} role="publisher" />);
  expect(screen.getByRole("button", { name: /publikuoti neutralų įrašą/i })).toBeVisible();
  expect(screen.getByRole("button", { name: /paprašyti informacijos/i })).toBeVisible();
});
