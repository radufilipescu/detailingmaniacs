import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { packageCatalog, packagePrice } from "../src/packages";
import type { ServiceId } from "../src/data";
import original from "./fixtures/original-packages.json" with { type: "json" };

test("package prices and inclusions match the original published tables", () => {
  for (const [id, source] of Object.entries(original)) {
    const catalog = packageCatalog[id as ServiceId]!;
    expect(catalog.source).toBe(source.source);
    expect(catalog.packages.map((item) => item.name)).toEqual(source.names);
    for (let size = 0; size < 3; size++) {
      expect(catalog.packages.map((item) => item.prices[size])).toEqual(
        source.basePricesBySize[size],
      );
      expect(catalog.packages.map((item) => packagePrice(item, size))).toEqual(
        source.displayedPricesBySize[size],
      );
    }
    if (id !== "colantare") {
      expect(catalog.features.map((feature) => feature.levels)).toEqual(
        source.sourceFeatures.map((row) =>
          row
            .slice(1)
            .flatMap((value, index) => (value === 1 ? [index + 1] : [])),
        ),
      );
    } else {
      // The original table repeats "Colantare integrala" once per brand.
      // The redesign consolidates those four identical rows into one.
      expect(catalog.features).toHaveLength(1);
      expect(catalog.features[0].levels).toEqual([1, 2, 3, 4]);
    }
  }
});

test("exterior package, vehicle class and extras are preserved in the WhatsApp enquiry", async ({
  page,
}) => {
  await page.goto("./#pachete");
  const section = page.locator("#pachete");
  await expect
    .poll(() =>
      section.evaluate((element) => element.getBoundingClientRect().top),
    )
    .toBeLessThanOrEqual(110);
  await expect(page.locator("#packages-heading")).toBeInViewport();
  await expect(section.locator(".package-card")).toHaveCount(4);
  await section.getByRole("radio", { name: /Mare \/ SUV/ }).check();
  const level3 = section.getByRole("article", { name: "Nivel 3", exact: true });
  await expect(level3.locator(".package-price")).toContainText("3.018");
  await expect(level3.locator("del")).toHaveText("3.550 lei");
  await level3.locator("summary").click();
  await expect(level3.locator(".package-details")).toContainText(
    "Protecție ceramică 4 ani — în 2 straturi",
  );
  await section
    .getByRole("checkbox", { name: /Protecție ceramică jante/ })
    .check();
  await level3.getByRole("button", { name: "Alege Nivel 3" }).click();
  const dialog = page.getByRole("dialog", { name: "Solicită o programare" });
  await expect(dialog.getByLabel("Pachetul dorit")).toHaveValue("exterior-3");
  await expect(
    dialog.getByRole("radio", { name: /Mare \/ SUV/ }),
  ).toBeChecked();
  await expect(
    dialog.getByRole("checkbox", { name: /Protecție ceramică jante/ }),
  ).toBeChecked();
  await expect(dialog.locator(".price-summary")).toContainText("4.268");
  await dialog.getByLabel("Marca și modelul").fill("BMW X5");
  await dialog.getByRole("button", { name: "Continuă" }).click();
  await expect(dialog.locator(".selected-summary")).toContainText("Nivel 3");
  await dialog.getByLabel("Numele tău").fill("Radu");
  await dialog.getByRole("button", { name: "Pregătește mesajul" }).click();
  const message = new URL(
    (await dialog
      .getByRole("link", { name: "Deschide WhatsApp" })
      .getAttribute("href"))!,
  ).searchParams.get("text")!;
  expect(message).toContain("Pachet: Nivel 3");
  expect(message).toContain("Tarif pachet: 3.018 lei + TVA");
  expect(message).toContain("Protecție ceramică jante — 1.250 lei + TVA");
  expect(message).toContain("Total orientativ: 4.268 lei + TVA");
  expect(message).toContain("Categorie: Mare / SUV");
});

test("PPF service opens its packages and the comparison remains accessible on mobile", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Descoperă Protecție PPF" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Vezi pachetele" })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page).toHaveURL(/#pachete$/);
  const section = page.locator("#pachete");
  await expect(section.getByRole("button", { name: "PPF 04" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await section.getByRole("radio", { name: /Medie/ }).check();
  await expect(
    section
      .getByRole("article", { name: "PPF 4", exact: true })
      .locator(".package-price"),
  ).toContainText("15.000");
  await section
    .getByRole("button", { name: "Compară toate serviciile" })
    .click();
  const table = section.getByRole("table");
  await expect(table).toBeVisible();
  const fullWrap = table.getByRole("row", { name: /Înfoliere completă PPF/ });
  await expect(fullWrap.getByRole("cell")).toHaveText([
    "Nu este inclus",
    "Nu este inclus",
    "Nu este inclus",
    "Inclus",
  ]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const audit = await new AxeBuilder({ page })
    .include("#pachete")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await section
    .getByRole("button", { name: "Alege PPF 3", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("Pachetul dorit")).toHaveValue("ppf-3");
  await expect(dialog.locator(".price-summary")).toContainText("7.000");
});

test("interior includes every service and wrapping uses the actual film brands", async ({
  page,
}) => {
  await page.goto("./#pachete");
  const section = page.locator("#pachete");
  const tabs = section.getByRole("group", { name: "Tipul pachetelor" });
  await tabs.getByRole("button", { name: "Interior 03" }).click();
  await expect(section.locator(".package-card")).toHaveCount(3);
  const level3 = section.getByRole("article", { name: "Nivel 3", exact: true });
  await expect(level3.locator(".package-price")).toContainText("1.440");
  await level3.locator("summary").click();
  await expect(level3.locator(".package-details li")).toHaveCount(22);
  await expect(level3.locator(".package-details")).toContainText(
    "Curățare compartiment roată de rezervă",
  );
  await expect(level3.locator(".package-details")).toContainText(
    "Protecție ceramică plastice interioare",
  );
  await tabs.getByRole("button", { name: "Colantare 04" }).click();
  await expect(section.locator(".package-card")).toHaveCount(4);
  await section.getByRole("radio", { name: /Mare \/ SUV/ }).check();
  await expect(
    section
      .getByRole("article", { name: "Avery Dennison", exact: true })
      .locator(".package-price"),
  ).toContainText("9.000");
  await expect(
    section
      .getByRole("article", { name: "Oracal Premium 970", exact: true })
      .locator(".package-price"),
  ).toContainText("10.500");
});

test("included treatments are not charged twice and switching services clears unrelated extras", async ({
  page,
}) => {
  await page.goto("./#pachete");
  const section = page.locator("#pachete");
  await section.getByRole("checkbox", { name: /Tratament hidrofob/ }).check();
  await section.getByRole("button", { name: "Alege Nivel 4" }).click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("checkbox", { name: /Tratament hidrofob/ }),
  ).toBeDisabled();
  await expect(dialog.locator(".price-summary")).toContainText("3.018");
  await dialog
    .getByRole("checkbox", { name: /Protecție ceramică jante/ })
    .check();
  await expect(dialog.locator(".price-summary")).toContainText("4.268");
  await dialog
    .getByLabel("Ce îți dorești pentru mașina ta?")
    .selectOption("interior");
  await expect(dialog.getByLabel("Pachetul dorit")).toHaveValue("");
  await expect(dialog.getByRole("checkbox")).toHaveCount(0);
  await expect(dialog.locator(".price-summary")).toContainText("810");
});

test("training formats can be requested without entering an unrelated car", async ({
  page,
}) => {
  await page.goto("./#pachete");
  const section = page.locator("#pachete");
  await section
    .getByRole("group", { name: "Tipul pachetelor" })
    .getByRole("button", { name: "Cursuri 02" })
    .click();
  await expect(section.locator(".package-card")).toHaveCount(2);
  await expect(section.getByRole("radio")).toHaveCount(0);
  await section.getByRole("button", { name: "Alege Curs individual" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("Pachetul dorit")).toHaveValue(
    "cursuri-individual",
  );
  await expect(dialog.locator(".price-summary")).toContainText("7.000");
  await expect(dialog.getByLabel("Marca și modelul")).toHaveCount(0);
  await dialog.getByRole("button", { name: "Continuă" }).click();
  await dialog.getByLabel("Numele tău").fill("Alex");
  await dialog.getByRole("button", { name: "Pregătește mesajul" }).click();
  const message = new URL(
    (await dialog
      .getByRole("link", { name: "Deschide WhatsApp" })
      .getAttribute("href"))!,
  ).searchParams.get("text")!;
  expect(message).toContain("Pachet: Curs individual");
  expect(message).not.toContain("Mașină:");
  expect(message).not.toContain("Categorie:");
});
