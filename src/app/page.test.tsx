import { render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import HomePage from "./page";
import { metadata } from "./layout";

const originalMode = process.env.PORTAL_MODE;
afterEach(() => { process.env.PORTAL_MODE = originalMode; });

it("leads with seller checking and keeps public funds separate", () => {
  process.env.PORTAL_MODE = "demo";
  render(<HomePage />);
  expect(screen.getByRole("heading", { name: /patikrinkite prieš pervesdami pinigus/i })).toBeVisible();
  expect(screen.getByRole("link", { name: /pranešti atvejį/i })).toHaveAttribute("href", "/pranesti");
  expect(screen.getByRole("link", { name: /viešieji pinigai/i })).toHaveAttribute("href", "/viesieji-pinigai");
});

it("shows only the pre-launch landing page by default", () => {
  delete process.env.PORTAL_MODE;
  render(<HomePage />);
  expect(screen.getByRole("heading", { name: /kuriame saugesnę vietą patikrinti pardavėją/i })).toBeVisible();
  expect(screen.queryByRole("link", { name: /pranešti atvejį/i })).not.toBeInTheDocument();
});

it("keeps the pre-launch site out of search indexes", () => {
  expect(metadata.robots).toEqual({ index: false, follow: false });
});
