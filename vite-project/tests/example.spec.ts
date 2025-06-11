import { test, expect } from "./fixtures/base-page";

test("has employee and redirects to employees path", async ({ basePage }) => {
  const EXPTECTED_EMPLOYEE = "Margaret Peacock";

  await expect(basePage).toHaveURL(/.*\/employees/);

  const employeeCardsContainer = basePage.locator(".employee-cards-container");
  await employeeCardsContainer.waitFor({ state: "attached" });

  const expectedCard = employeeCardsContainer.locator(".card", {
    hasText: EXPTECTED_EMPLOYEE,
  });
  await expect(expectedCard).toBeVisible();
});

test("Wait for map to load and check for an expected country pop up", async ({
  basePage,
}) => {
  const EXPECTED_COUNTRY_TEST_ID = "USA-Tacoma";
  const EXPECTED_COUNTRY_POPUP_TEXT = "Tacoma, USA";

  const mapNavLink = basePage.locator('a[href="/map"]');
  await expect(mapNavLink).toBeVisible();
  await mapNavLink.click();
  await expect(basePage).toHaveURL(/.*\/map/);

  const leafletContainer = basePage.locator(".leaflet-container");
  await leafletContainer.waitFor({ state: "attached" });

  const londonDataTestId = basePage.locator(
    `[data-testid="${EXPECTED_COUNTRY_TEST_ID}"]`
  );

  await expect(londonDataTestId).toBeAttached();
  await londonDataTestId.evaluate((element) => {
    (element as HTMLElement).click();
  });

  const popup = basePage.locator(".leaflet-pane .leaflet-popup-pane");
  const popupText = popup.locator(`text=${EXPECTED_COUNTRY_POPUP_TEXT}`);

  await expect(popupText).toBeVisible();
});
