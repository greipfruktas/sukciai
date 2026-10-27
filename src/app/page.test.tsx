import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import HomePage from "./page";

it("leads with seller checking and keeps public funds separate", () => {
  render(<HomePage />);
  expect(screen.getByRole("heading", { name: /patikrinkite prieš pervesdami pinigus/i })).toBeVisible();
  expect(screen.getByRole("link", { name: /pranešti atvejį/i })).toHaveAttribute("href", "/pranesti");
  expect(screen.getByRole("link", { name: /viešieji pinigai/i })).toHaveAttribute("href", "/viesieji-pinigai");
});
