import { expect, test } from "@playwright/test";

test("homepage leads to a fully sourced case page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Demonstraciniai duomenys.")).toBeVisible();
  await page.getByRole("link", { name: /institucija paskelbė galutinį sprendimą/i }).first().click();
  await expect(page.getByRole("heading", { name: "Patvirtinti faktai" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Šaltiniai" })).toBeVisible();
  await expect(page.getByText(/portalas neatlieka pirminio tyrimo/i)).toBeVisible();
});

test("register remains readable on a mobile viewport", async ({ page }) => {
  await page.goto("/paieska");
  await expect(page.getByRole("heading", { name: "Atvejų registras" })).toBeVisible();
  await expect(page.getByRole("searchbox")).toBeVisible();
  await expect(page.getByText("Įsiteisėjęs sprendimas")).toBeVisible();
});
