import { test as baseTest, Page, expect } from "@playwright/test";

type BasePageFixtures = {
  basePage: Page;
};

export const test = baseTest.extend<BasePageFixtures>({
  basePage: async ({ page }, use) => {
    console.log("Navigating to base URL...");
    await page.goto("http://localhost:5173");

    await use(page);
  },
});

export { expect };
