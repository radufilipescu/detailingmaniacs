# Asset and content notes

## Original business content

The user requested this concept while with the owner of Detailing Maniacs. Brand content and workshop media were taken from the business's own website for that redesign. They remain the property of their respective owners.

Contact, address and legal name: https://www.detailingmaniacs.ro/contact/

Service descriptions, complete package tables and prices, checked 26 September 2026:

- Exterior: https://www.detailingmaniacs.ro/polish-auto-profesional-bucuresti/
- Interior: https://www.detailingmaniacs.ro/detailing-interior-auto-bucuresti/
- PPF: https://www.detailingmaniacs.ro/infoliere-ppf-bucuresti/
- Wrapping: https://www.detailingmaniacs.ro/colantari-auto-bucuresti/
- Headlights: https://www.detailingmaniacs.ro/polish-faruri-bucuresti/
- Engine: https://www.detailingmaniacs.ro/detailing-motor-bucuresti/
- Training: https://www.detailingmaniacs.ro/curs-detailing-auto-bucuresti/
- Other services: https://www.detailingmaniacs.ro/servicii/

Package inclusions were extracted from the original pages' `tableData` arrays and checked against their rendered comparison tables. All 17 exterior feature rows, 22 interior rows and 5 PPF rows are preserved, with spelling and diacritics normalized. The four identical wrapping rows were consolidated into one row, with the actual film brands retained as package names. "Avery Denisson" on the source was corrected to "Avery Dennison".

Prices were checked in a browser because the original site applies discounts with JavaScript: 15% on exterior levels 2–4, no discount on exterior level 1, and 10% on all three interior levels. The redesign displays both original and discounted prices, using the same rounding to whole lei. All three vehicle categories are included. The source snapshot is saved in `tests/fixtures/original-packages.json` and tested against the catalog.

The exterior extras are hydrophobic glass treatment (450 lei), Gyeon Infinite Top Coat (1,350 lei) and ceramic wheel protection including disassembly, cleaning and polishing (1,250 lei). The glass treatment is already included in exterior level 4 and is not added to its total again. Group and individual courses retain the published 5,000 / 7,000 lei prices and the original training outline.

All displayed prices exclude VAT and are estimates subject to evaluation. Promotions require confirmation by the studio. PPF 1 is headlight film only; the separate polish-and-film service costs 750 lei. No aggregate Google rating, review count, guaranteed turnaround, or live availability has been invented.

Customer quotations are short excerpts from the reviews displayed on the original homepage, linked to the same review URLs. The five stars belong to each displayed individual review, not an asserted aggregate score.

## Photography and video

Downloaded to the repository and optimized as WebP without changing the photographed content:

| Local asset                                            | Original                                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `public/images/exterior.webp`                          | https://www.detailingmaniacs.ro/wp-content/uploads/2025/11/detailing-exterior.png                                              |
| `public/images/interior.webp`                          | https://www.detailingmaniacs.ro/wp-content/uploads/2025/11/detailing-interior.png                                              |
| `public/images/ppf.webp`                               | https://www.detailingmaniacs.ro/wp-content/uploads/2025/11/infoliere-ppf.png                                                   |
| `public/images/workshop.webp`                          | https://www.detailingmaniacs.ro/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-19-at-10.00.22-1024x576.jpeg                 |
| `public/images/audi.webp`                              | https://www.detailingmaniacs.ro/wp-content/uploads/2026/09/audi-rs6-detailing-exterior.png                                     |
| `public/images/porsche.webp`, `public/images/bmw.webp` | Cached project photographs from the original homepage's Instagram feed, https://www.instagram.com/detailing_maniacs_bucharest/ |
| `public/atelier.mp4`                                   | https://www.detailingmaniacs.ro/wp-content/uploads/2025/12/video-detailing-auto.mp4                                            |

## Generated hero

Files: `public/images/hero.webp` and the smaller responsive version `public/images/hero-mobile.webp`.

Created with the built-in image generation tool, then encoded as WebP. This is a conceptual campaign image, not documentary photography of the studio or a claimed client project. It is used only as the opening hero and social sharing artwork. The project gallery uses the business's existing imagery.

Final generation prompt:

> Use case: ads-marketing. Asset type: cinematic full-bleed hero photograph for a premium Romanian automotive detailing website. Create one ultra-wide 16:9 landscape photograph, 2048x1152 or larger. Subject: an immaculate graphite metallic Porsche 911 GT3, full vehicle visible, viewed from low front three-quarter angle, front nose points toward the lower left, car occupies the RIGHT 65 percent of the composition, its rear reaches near the right edge. LEFT 36 percent is very dark seamless black negative space for a large headline that will be overlaid in HTML. Scene: sophisticated dark automotive detailing studio, charcoal concrete floor with a subtly damp reflective surface, dark background, a few thin white overhead light strips reflected precisely along the polished hood and roof. Lighting: dramatic architectural overhead softbox lighting creates silver contour highlights, small subtle chartreuse yellow ambient glow in the far right background, restrained neutral colors, blacks lifted just enough to preserve real texture, crisp white headlights illuminated. Camera: professional automotive advertising photography, 35mm lens, realistic wheels, real body shape and proportions, no people, car low in frame with upper negative space. Moody, expensive, editorial, photographic not illustration. Avoid text, typography, watermarks, borders, extra cars, strong neon, exaggerated smoke, oversized logos. This is a background photo only, not a webpage mockup.

## Fonts and icons

- Barlow Condensed and Manrope are self-hosted Google Fonts. Their SIL Open Font License files are included in `public/fonts/`.
- Interface icons use Lucide React (ISC license).
- The typographic wordmark and slash motif are part of this redesign concept.
