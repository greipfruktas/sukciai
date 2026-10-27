import { expect, test } from "@playwright/test";

test("homepage centers seller checking and separates public funds", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Kuriama demonstracinė versija.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Patikrinkite prieš pervesdami pinigus" })).toBeVisible();
  await expect(page.getByLabel("Ko ieškote?")).toBeVisible();
  await expect(page.getByLabel("Paieškos reikšmė")).toBeVisible();
  await expect(page.getByRole("link", { name: "Pranešti atvejį", exact: true }).last()).toHaveAttribute("href", "/pranesti");
  await expect(page.getByRole("link", { name: /viešieji pinigai/i }).last()).toHaveAttribute("href", "/viesieji-pinigai");
});

test("report form remains usable on a mobile viewport", async ({ page }) => {
  await page.goto("/pranesti");
  await expect(page.getByRole("heading", { name: "Pateikite faktus ir dokumentus" })).toBeVisible();
  await page.getByLabel("Jūsų vardas ir pavardė").fill("Ona Onaitytė");
  await page.getByLabel("El. paštas").fill("ona@example.lt");
  await page.getByLabel("Telefono numeris", { exact: true }).fill("+37061234567");
  await page.getByRole("button", { name: "Toliau" }).click();
  await expect(page.getByText("2 iš 5")).toBeVisible();
  await expect(page.getByLabel("Įrodymai")).toBeVisible();
});

test("published demo profile masks sensitive identifiers", async ({ page }) => {
  await page.goto("/pardavejai/demonstracinis-pardavejas");
  await expect(page.getByText("+370 6•• ••999")).toBeVisible();
  await expect(page.getByText(/pilni telefono ir sąskaitos duomenys viešai nerodomi/i)).toBeVisible();
});
