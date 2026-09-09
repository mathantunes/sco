import { expect, test } from "@playwright/test";

test("completes the full session, product selection, and checkout flow", async ({ page }) => {
  await page.goto("/?deviceId=device1");

  await expect(page.getByTestId("idle-heading")).toBeVisible();
  await page.getByTestId("start-shopping").click();

  await expect(page.getByTestId("shopping-heading")).toBeVisible();
  await expect(page.getByTestId("menu-categories")).toBeVisible();
  await expect(page.getByTestId("device-id")).toHaveText("Device device1");

  await page.getByTestId("category-snacks").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByTestId("add-product-chips-sea-salt").click();

  await expect(page.getByTestId("proceed-to-payment")).toBeEnabled();
  await page.getByTestId("proceed-to-payment").click();
  await expect(page.getByTestId("payment-approved")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId("payment-thank-you")).toBeVisible({ timeout: 10_000 });
});
