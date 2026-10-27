import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SellerSearchForm } from "./search-form";

afterEach(() => vi.unstubAllGlobals());

it("submits an exact seller lookup with an explicit identifier type", async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: "none", results: [], disclaimer: "Rezultato nebuvimas nereiškia, kad pardavėjas patikimas." }) });
  vi.stubGlobal("fetch", fetchMock);
  render(<SellerSearchForm />);
  fireEvent.change(screen.getByLabelText("Ko ieškote?"), { target: { value: "phone" } });
  fireEvent.change(screen.getByLabelText("Paieškos reikšmė"), { target: { value: "+37069999999" } });
  fireEvent.click(screen.getByRole("button", { name: "Patikrinti" }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/sellers/search?type=phone&q=%2B37069999999"));
  expect(await screen.findByText(/rezultato nebuvimas nereiškia/i)).toBeVisible();
});

it("links a matched result to its seller profile", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: "match", disclaimer: "", results: [{ slug: "demo", displayName: "Demonstracinis pardavėjas", summary: "Patikrintas ginčas", status: "verified_dispute", identifiers: [] }] }) }));
  render(<SellerSearchForm />);
  fireEvent.change(screen.getByLabelText("Paieškos reikšmė"), { target: { value: "123456789" } });
  fireEvent.click(screen.getByRole("button", { name: "Patikrinti" }));
  expect(await screen.findByRole("link", { name: "Demonstracinis pardavėjas" })).toHaveAttribute("href", "/pardavejai/demo");
});
