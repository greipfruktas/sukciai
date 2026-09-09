import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { SourceList } from "./source-list";

it("shows complete provenance for every source", () => {
  render(<SourceList sources={[{
    title: "Teismo sprendimas",
    publisher: "Lietuvos teismai",
    publishedAt: "2026-09-08",
    documentNumber: "A-42/2026",
    url: "https://teismai.lt/byla/A-42-2026",
  }]} />);

  expect(screen.getByRole("link", { name: "Teismo sprendimas" })).toHaveAttribute(
    "href",
    "https://teismai.lt/byla/A-42-2026",
  );
  expect(screen.getByText(/Lietuvos teismai/)).toBeVisible();
  expect(screen.getByText(/2026-09-08/)).toBeVisible();
  expect(screen.getByText(/A-42\/2026/)).toBeVisible();
});
