import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { routes } from "./routes";

// WCAG 2.2 AA in both themes (doc 09).
for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme });

    for (const route of [...routes, "/does-not-exist"]) {
      test(`${route} has no axe violations`, async ({ page }) => {
        await page.goto(route);
        // Measure the settled page: entrance animations (e.g. a portfolio's zoom-in)
        // briefly blend text with the background while they run.
        await page.waitForFunction(() =>
          document
            .getAnimations()
            .every((animation) => animation.playState !== "running"),
        );
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(results.violations).toEqual([]);
      });
    }
  });
}
