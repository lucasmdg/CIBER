import { test, expect } from "@playwright/test";

test("landing renders and links to sign-in", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("SentinelX", { exact: false })).toBeVisible();
  await page.getByRole("link", { name: /sign in|enter the soc/i }).click();
  await expect(page).toHaveURL(/login/);
});
