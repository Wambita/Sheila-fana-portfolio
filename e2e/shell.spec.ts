import { expect, test } from "@playwright/test";

test("sends security headers", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("unknown routes return 404", async ({ request }) => {
  const response = await request.get("/does-not-exist");
  expect(response.status()).toBe(404);
});

test.describe("theme", () => {
  test("follows the system preference by default", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });

  test("explicit choice persists across reloads", async ({
    page,
    isMobile,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    if (isMobile) await page.getByRole("button", { name: "Menu" }).click();

    const toggle = page.getByRole("button", { name: "Dark theme" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });
});

test.describe("navigation", () => {
  test("skip link is the first focusable element", async ({ page }) => {
    await page.goto("/about");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("marks the current page", async ({ page, isMobile }) => {
    await page.goto("/about");
    if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("mobile menu opens, closes on Escape and on navigation", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    const menu = page.getByRole("button", { name: "Menu" });
    const nav = page.getByRole("navigation", { name: "Primary" });

    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(nav.getByRole("link", { name: "Work" })).toBeHidden();

    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeFocused();

    await menu.click();
    await nav.getByRole("link", { name: "Writing" }).click();
    await expect(page).toHaveURL(/\/writing$/);
    await expect(menu).toHaveAttribute("aria-expanded", "false");
  });

  test("desktop sidebar is always visible", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
    await expect(
      page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: "Work" }),
    ).toBeVisible();
  });
});
