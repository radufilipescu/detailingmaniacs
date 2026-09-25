# Detailing Maniacs

A Romanian-language redesign concept for the Detailing Maniacs automotive studio in Bucharest.

**Live site:** https://congruentvisions.com/detailingmaniacs/

GitHub Pages inherits the account's existing custom domain. The standard URL, https://radufilipescu.github.io/detailingmaniacs/, redirects to the HTTPS address above.

Built with React, TypeScript and Vite. The site is static and deploys to GitHub Pages automatically after its build and browser checks pass.

## Experience

- Responsive automotive art direction, locally hosted fonts and optimized WebP photography.
- A dedicated [Packages section](https://congruentvisions.com/detailingmaniacs/#pachete) with four exterior levels, three interior levels, four PPF levels, four wrapping film brands, and group/individual training formats.
- Complete inclusion lists, a comparison table, prices for three vehicle categories, original and promotional prices, and selectable extras.
- A two-step WhatsApp enquiry builder that preserves the selected package, vehicle class, extras and quoted amounts. It avoids charging again for a treatment already included in the selected package. Training enquiries do not require unrelated vehicle details.
- Visitors review the prepared WhatsApp message before sending it themselves; the site does not silently submit enquiries or claim to confirm bookings.
- Filterable project gallery, keyboard-controlled lightbox and video from the actual workshop.
- Accessible native dialogs, keyboard navigation, FAQ disclosure controls, reduced-motion support, and direct phone, email and map links.

## Develop

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Vite prints the local URL, including the `/detailingmaniacs/` base path. To build and preview:

```sh
npm run build
npm run preview
```

## Validate

```sh
npx playwright install chromium
npm test
```

The browser suite checks desktop and mobile layouts, loading assets, navigation, form validation, package selection and comparison, extras, generated WhatsApp content, modal dismissal, gallery interactions, FAQ controls, video availability and automated WCAG 2.2 AA checks with axe. Package prices and inclusion matrices are checked against a snapshot of the original published tables in `tests/fixtures/original-packages.json`. Automated accessibility checks do not replace a full manual audit.

To use an existing Chrome installation, set `CHROME_PATH` to its executable. Set `SITE_URL` to run the suite against the deployed site instead of the local preview server.

## Deployment

GitHub Pages uses **GitHub Actions** as its publishing source. Pushing to `main` runs `.github/workflows/deploy.yml`: install, production build, desktop/mobile browser checks, then deploy `dist/`. No backend, API keys or deployment secrets are needed.

The project base is configured in `vite.config.ts`. Update it, the social sharing metadata and the test base URL if the repository path changes.

## Content

The site's real contact details, service descriptions, packages, prices and workshop imagery come from the existing business website. See [ASSETS.md](ASSETS.md) for exact sources and the generated hero prompt. Change general services in `src/data.ts`; change package inclusions, prices, discounts and extras in `src/packages.ts`. When updating package prices, also update the corresponding service's starting prices and the source fixtures after checking the original site.

This is a separately published redesign demo. It is marked `noindex` and does not modify the original domain. Prices are indicative, exclude VAT and require confirmation by the studio. Preferred dates are requests, not live calendar availability. No personal data is stored by this frontend, and no analytics or tracking scripts are included.
