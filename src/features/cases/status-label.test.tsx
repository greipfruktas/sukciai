import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { StatusLabel } from "./status-label";

it("renders a human-readable status and date", () => {
  render(<StatusLabel status="acquitted" date="2026-09-08" />);

  expect(screen.getByText("Išteisintas")).toBeVisible();
  expect(screen.getByText("2026-09-08")).toBeVisible();
});
