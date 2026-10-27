import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("release-critical public and administrative routes respond", async ({ page, request }) => {
  for (const path of ["/", "/pranesti", "/viesieji-pinigai", "/pardavejai/demonstracinis-pardavejas", "/pataisymai", "/admin/review"]) {
    const response = await request.get(path);
    expect(response.ok(), `${path} should respond`).toBeTruthy();
  }
  const health = await request.get("/api/health");
  expect(health.ok()).toBeTruthy();
  await expect(health.json()).resolves.toMatchObject({ status: "ok", checks: { application: "ready", database: expect.any(String) } });
  await page.goto("/");
  await expect(page.getByText("Nepublikuotas juodraštis")).toHaveCount(0);
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});
