import { expect, test } from "@playwright/test";

test("exact demo lookup finds only the published masked fixture", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Paieškos reikšmė").fill("123456789");
  await page.getByRole("button", { name: "Patikrinti" }).click();
  await expect(page.getByRole("link", { name: "Demonstracinis pardavėjo profilis" })).toBeVisible();
  await page.getByLabel("Paieškos reikšmė").fill("987654321");
  await page.getByRole("button", { name: "Patikrinti" }).click();
  await expect(page.getByText(/rezultato nebuvimas nereiškia/i)).toBeVisible();
});

test("report draft survives reload and fixture submission stays local", async ({ page }) => {
  await page.goto("/pranesti");
  await page.getByLabel("Jūsų vardas ir pavardė").fill("Ona Onaitytė");
  await page.getByLabel("El. paštas").fill("ona@example.lt");
  await page.getByLabel("Telefono numeris", { exact: true }).fill("+37061234567");
  await page.reload();
  await expect(page.getByLabel("Jūsų vardas ir pavardė")).toHaveValue("Ona Onaitytė");
  await page.getByRole("button", { name: "Toliau" }).click();
  await page.getByLabel("Įmonės kodas").fill("123456789");
  await page.getByRole("button", { name: "Toliau" }).click();
  await page.getByLabel("Pervesta suma, Eur").fill("1250");
  await page.getByLabel("Mokėjimo data").fill("2026-10-01");
  await page.getByLabel("Kas įvyko?").fill("Sumokėtas avansas, tačiau sutartas statinys nepristatytas.");
  await page.getByRole("button", { name: "Toliau" }).click();
  await page.getByLabel("Darbų būsena").selectOption("not_done");
  await page.getByRole("button", { name: "Toliau" }).click();
  await page.getByLabel(/Patvirtinu, kad pateikta informacija/i).check();
  await page.getByRole("button", { name: "Pateikti patikrai" }).click();
  await expect(page.getByRole("heading", { name: "Pranešimo forma užpildyta" })).toBeVisible();
  await expect(page.getByText(/duomenys į serverį nesiunčiami/i)).toBeVisible();
});

test("moderation fixture exposes policy, response and masked publication", async ({ page }) => {
  await page.goto("/admin/pranesimai/report-demo");
  await expect(page.getByText(/Stebėti – vienas patikrintas/i)).toBeVisible();
  await expect(page.getByText("2026-11-03")).toBeVisible();
  await expect(page.getByRole("button", { name: "Publikuoti neutralų įrašą" })).toBeVisible();
  await page.goto("/pardavejai/demonstracinis-pardavejas");
  await expect(page.getByRole("heading", { name: "Pardavėjo pozicija" })).toBeVisible();
  await expect(page.getByText("+370 6•• ••999")).toBeVisible();
  await expect(page.getByText("+37061234567")).toHaveCount(0);
});
