import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import HomePage from "./page";

it("identifies the service as a source aggregator", () => {
  render(<HomePage />);

  expect(
    screen.getByText(/portalas neatlieka pirminio tyrimo/i),
  ).toBeVisible();
  expect(screen.getByText(/demonstraciniai duomenys/i)).toBeVisible();
  expect(screen.getByRole("region", { name: /naujausi būsenų pakeitimai/i })).toBeVisible();
  expect(screen.getAllByText(/šaltiniai/i).length).toBeGreaterThan(0);
});
