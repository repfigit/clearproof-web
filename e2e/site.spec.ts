import { expect, test } from "@playwright/test";

test("homepage uses the publication source, works on mobile, and explains authorization", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Prove the checks passed.");
  await expect(page.getByText("Verified npm release: 9.9.9.", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: /Published synthetic article/ })).toHaveAttribute(
    "href", "https://docs.clearproof.world/explainers/published-example",
  );
  await expect(page.getByRole("link", { name: /Future synthetic article/ })).toHaveCount(0);
  await page.getByRole("button", { name: "With clearproof", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Checks encoded in the proof" })).toBeVisible();
  await expect(page.getByText(/storage enforces one-time consumption/)).toBeVisible();
  await expect(page.getByText(/Illustrative synthetic transfer/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect(errors).toEqual([]);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect(await (await request.get("/sitemap.xml")).text()).toContain("https://www.clearproof.world");
});

test("reduced motion leaves the illustrative transfer under manual control", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Pause the demo" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Plain message", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "With clearproof", exact: true }).click();
  await expect(page.getByRole("button", { name: "With clearproof", exact: true })).toHaveAttribute("aria-pressed", "true");
});
