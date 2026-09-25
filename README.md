# Detailing Maniacs

A Romanian-language redesign concept for the Detailing Maniacs automotive studio in Bucharest.

**Live site:** https://congruentvisions.com/detailingmaniacs/

GitHub Pages inherits the account's existing custom domain. The standard URL, https://radufilipescu.github.io/detailingmaniacs/, redirects to the HTTPS address above.

Built with React, TypeScript and Vite. The site is static and deploys to GitHub Pages automatically after its build and browser checks pass.

## Experience

- Responsive automotive art direction, locally hosted fonts and optimized WebP photography.
- Service details with reference prices, vehicle categories and a two-step enquiry builder.
- A WhatsApp message preview that preserves the selected service and vehicle information. The visitor explicitly opens WhatsApp and sends the message; the site does not silently submit enquiries or claim to confirm bookings.
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

The browser suite checks desktop and mobile layouts, loading assets, navigation, form validation, price selection, generated WhatsApp content, modal dismissal, gallery interactions, FAQ controls, video availability and automated WCAG 2.2 AA checks with axe. Automated accessibility checks do not replace a full manual audit.

To use an existing Chrome installation, set `CHROME_PATH` to its executable. Set `SITE_URL` to run the suite against the deployed site instead of the local preview server.

## Deployment

GitHub Pages uses **GitHub Actions** as its publishing source. Pushing to `main` runs `.github/workflows/deploy.yml`: install, production build, desktop/mobile browser checks, then deploy `dist/`. No backend, API keys or deployment secrets are needed.

The project base is configured in `vite.config.ts`. Update it, the social sharing metadata and the test base URL if the repository path changes.

## Content

The site's real contact details, service descriptions, reference prices and workshop imagery come from the existing business website. See [ASSETS.md](ASSETS.md) for exact sources and the generated hero prompt. Change services and prices in `src/data.ts`.

This is a separately published redesign demo. It is marked `noindex` and does not modify the original domain. Prices are indicative, exclude VAT and require confirmation by the studio. Preferred dates are requests, not live calendar availability. No personal data is stored by this frontend, and no analytics or tracking scripts are included.
