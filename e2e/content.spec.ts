import { expect, test } from "@playwright/test";

// Runs against supabase/seed.sql: every row is fake and labelled [Sample].

test("J2: home → discipline → project, with no dead ends", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("main")
    .getByRole("link", { name: "[Sample] Discipline A" })
    .click();
  await expect(
    page.getByRole("heading", { level: 1, name: "[Sample] Discipline A" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "[Sample] Project one" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "[Sample] Project one" }),
  ).toBeVisible();

  // Back to the discipline from the project's own metadata.
  await page.getByRole("link", { name: "[Sample] Discipline A" }).click();
  await expect(page).toHaveURL(/\/disciplines\/sample-discipline-a$/);
});

test("project page shows only evidence sections with content", async ({
  page,
}) => {
  await page.goto("/projects/sample-project-one");
  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: "Context" })).toBeVisible();
  await expect(main.getByRole("heading", { name: "Problem" })).toBeVisible();
  for (const hidden of ["Process", "Decisions", "Implementation", "Outcomes"]) {
    await expect(main.getByRole("heading", { name: hidden })).toHaveCount(0);
  }
  // Draft highlights are never shown.
  await expect(main.getByText("[Sample] Highlight one.")).toBeVisible();
  await expect(main.getByText(/Highlight two \(draft\)/)).toHaveCount(0);
});

test("drafts are never published", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByText("[Sample] Draft project")).toHaveCount(0);

  await page.goto("/projects/sample-draft-project");
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();

  await page.goto("/disciplines/sample-draft-discipline");
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
});

test("project filters narrow the list and are shareable", async ({ page }) => {
  await page.goto("/projects");
  const list = page.getByRole("main").getByRole("list").last();
  await expect(list.getByRole("listitem")).toHaveCount(2);

  await page
    .getByLabel("Technology")
    .selectOption({ label: "[Sample] Skill two" });
  await expect(page).toHaveURL(/technology=sample-skill-two/);
  await expect(page.getByRole("status")).toHaveText("Showing 1 of 2 projects");
  await expect(list.getByRole("listitem")).toHaveCount(1);

  // A shared filtered URL restores the filter.
  await page.reload();
  await expect(page.getByLabel("Technology")).toHaveValue("sample-skill-two");

  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(list.getByRole("listitem")).toHaveCount(2);
});

test("about page shows the profile biography", async ({ page }) => {
  await page.goto("/about");
  await expect(
    page.getByText("[Sample] Biography placeholder. Replace in Studio."),
  ).toBeVisible();
});

test.describe("section navigation", () => {
  test("lists the page's sections and marks the one chosen", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/projects/sample-project-one");
    if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
    const sections = page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("list", { name: "On this page" });
    await expect(sections.getByRole("link")).toHaveText([
      "Context",
      "Problem",
      "Highlights",
    ]);

    await sections.getByRole("link", { name: "Problem" }).click();
    await expect(page).toHaveURL(/#problem$/);
    if (isMobile) {
      // The menu closes and the top bar says where you are.
      await expect(page.getByRole("banner")).toContainText("Work / Problem");
    } else {
      await expect(
        sections.getByRole("link", { name: "Problem" }),
      ).toHaveAttribute("aria-current", "location");
    }
  });

  test("desktop sidebar stays in place while the page scrolls", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "desktop only");
    await page.setViewportSize({ width: 1280, height: 500 });
    await page.goto("/projects/sample-project-one");
    await page.mouse.wheel(0, 1500);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(0);
    const box = await page.getByRole("banner").boundingBox();
    expect(Math.abs(Math.round(box?.y ?? -1))).toBe(0);
  });
});
