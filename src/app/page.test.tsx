import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import HomePage from "./page";

it("identifies the service as a source aggregator", () => {
  render(<HomePage />);

  expect(
    screen.getByText(/portalas neatlieka pirminio tyrimo/i),
  ).toBeVisible();
});
