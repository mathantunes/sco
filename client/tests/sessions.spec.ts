import { expect, test } from "@playwright/test";

test("starts a shopping session from the idle screen", async ({ page }) => {
  await page.goto("/?deviceId=device1");

  await expect(page.getByTestId("idle-heading")).toBeVisible();
  await page.getByTestId("start-shopping").click();

  await expect(page.getByTestId("shopping-heading")).toBeVisible();
  await expect(page.getByTestId("menu-categories")).toBeVisible();
  await expect(page.getByTestId("device-id")).toHaveText("Device device1");
});
