import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("loads the complete page, assets and navigation without errors or overflow", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const failedAssets: string[] = [];
  page.on("response", (response) => {
    if (
      response.status() >= 400 &&
      response.url().includes("/detailingmaniacs/")
    )
      failedAssets.push(response.url());
  });
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: /OBSESIA PENTRU PERFECȚIUNE/ }),
  ).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 75));
    }
  });
  await expect(
    page.getByRole("heading", { name: /HAI SĂ-I REDĂM/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const images = await page
    .locator("img")
    .evaluateAll((images) =>
      images.every((image) => image.complete && image.naturalWidth > 0),
    );
  expect(images).toBe(true);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  if (testInfo.project.name === "mobile") {
    const originalViewport = page.viewportSize()!;
    await page.setViewportSize({ width: 320, height: 800 });
    expect(
      await page.locator("#hero-heading > span").evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= window.innerWidth;
      }),
    ).toBe(true);
    await page.setViewportSize(originalViewport);
    await page.getByRole("button", { name: "Deschide meniul" }).click();
    await page
      .getByRole("navigation", { name: "Navigare mobilă" })
      .getByRole("link", { name: /Proiecte/ })
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Navigare principală" })
      .getByRole("link", { name: "Proiecte" })
      .click();
  }
  await expect(page).toHaveURL(/#proiecte$/);
  expect(errors).toEqual([]);
  expect(failedAssets).toEqual([]);
});

test("booking validates input, updates the estimate and prepares the correct WhatsApp message", async ({
  page,
}) => {
  await page.goto("./");
  await page
    .getByRole("button", { name: "Programează-te", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Solicită o programare" });
  await dialog
    .getByLabel("Ce îți dorești pentru mașina ta?")
    .selectOption("interior");
  await dialog.getByRole("radio", { name: /Mare \/ SUV/ }).check();
  await expect(dialog.locator(".price-summary")).toContainText("990");
  await dialog.getByRole("button", { name: "Continuă" }).click();
  await expect(dialog.getByLabel("Marca și modelul")).toBeVisible();
  await dialog.getByLabel("Marca și modelul").fill("BMW X5, 2022");
  await dialog.getByRole("button", { name: "Continuă" }).click();
  await expect(dialog.locator(".selected-summary")).toContainText(
    "Detailing interior",
  );
  await dialog.getByLabel("Numele tău").fill("Radu");
  await dialog
    .getByLabel("Ce ar trebui să știm?")
    .fill("Curățare scaune și protecție piele.");
  await dialog.getByRole("button", { name: "Pregătește mesajul" }).click();
  const link = dialog.getByRole("link", { name: "Deschide WhatsApp" });
  const url = new URL((await link.getAttribute("href"))!);
  expect(url.hostname).toBe("wa.me");
  expect(url.pathname).toBe("/40738368842");
  expect(url.searchParams.get("text")).toContain("Radu");
  expect(url.searchParams.get("text")).toContain("BMW X5, 2022");
  expect(url.searchParams.get("text")).toContain("Detailing interior");
  expect(url.searchParams.get("text")).toContain("Mare / SUV");
  expect(url.searchParams.get("text")).toContain(
    "Curățare scaune și protecție piele.",
  );
  await expect(dialog).toContainText("Nimic nu a fost trimis încă");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Programează-te", exact: true }),
  ).toBeFocused();
});

test("service details carry the chosen service into booking", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Descoperă Protecție PPF" }).click();
  const detail = page.getByRole("dialog", {
    name: "Protecție PPF",
    exact: true,
  });
  await expect(detail).toContainText("Acoperire parțială sau integrală");
  await detail.getByRole("button", { name: "Solicită o programare" }).click();
  const booking = page.getByRole("dialog", { name: "Solicită o programare" });
  await expect(
    booking.getByLabel("Ce îți dorești pentru mașina ta?"),
  ).toHaveValue("ppf");
  await expect(booking).toContainText(
    "Tariful de pornire este pentru protecție parțială",
  );
  await page.keyboard.press("Escape");
  await expect(booking).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});

test("gallery filters, expands and supports keyboard navigation in the lightbox", async ({
  page,
}) => {
  await page.goto("./");
  const filters = page.getByRole("group", { name: "Filtrează proiectele" });
  await filters.getByRole("button", { name: "Interior", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-card")).toContainText(
    "Atenție la fiecare suprafață",
  );
  await filters.getByRole("button", { name: "PPF", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await filters.getByRole("button", { name: /Toate/ }).click();
  await page.getByRole("button", { name: "Vezi toate proiectele" }).click();
  await expect(page.locator(".project-card")).toHaveCount(6);
  await page
    .getByRole("button", { name: "Vezi proiectul Audi RS6 Avant" })
    .click();
  const gallery = page.getByRole("dialog");
  await expect(gallery).toContainText("Audi RS6 Avant");
  await gallery.getByRole("button", { name: "Proiectul următor" }).click();
  await expect(gallery).toContainText("Porsche 911");
  await page.keyboard.press("ArrowLeft");
  await expect(gallery).toContainText("Audi RS6 Avant");
  await page.keyboard.press("Escape");
  await expect(gallery).not.toBeVisible();
});

test("FAQ expands and the workshop video is available", async ({ page }) => {
  await page.goto("./");
  const question = page.getByRole("button", {
    name: "Care este diferența dintre ceramică și PPF?",
  });
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("region", {
      name: "Care este diferența dintre ceramică și PPF?",
    }),
  ).toContainText("barieră fizică");
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "Intră în atelier" }).click();
  const video = page.locator("video");
  await expect(video).toBeVisible();
  await expect
    .poll(() => video.evaluate((element) => element.readyState))
    .toBeGreaterThanOrEqual(1);
  await expect
    .poll(() => video.evaluate((element) => element.videoWidth))
    .toBeGreaterThan(0);
});

test("page and booking meet WCAG 2.2 AA automated accessibility checks", async ({
  page,
}) => {
  await page.goto("./");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const pageAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(pageAudit.violations).toEqual([]);
  await page
    .getByRole("button", { name: "Programează-te", exact: true })
    .click();
  const bookingAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(bookingAudit.violations).toEqual([]);
});
