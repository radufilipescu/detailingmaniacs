import type { ServiceId } from "./data";

export type ServicePackage = {
  id: string;
  name: string;
  subtitle: string;
  prices: [number, number, number];
  discountPercent?: number;
  highlights: string[];
};

export type PackageFeature = { label: string; levels: number[] };
export type PackageAddon = {
  id: string;
  name: string;
  details?: string;
  price: number;
  includedIn?: string[];
};
export type PackageCatalog = {
  title: string;
  source: string;
  packages: ServicePackage[];
  features: PackageFeature[];
  addons?: PackageAddon[];
  note?: string;
  vehicleSized?: boolean;
};

export type BookingSelection = {
  serviceId: ServiceId;
  packageId?: string;
  size?: number;
  addonIds?: string[];
};

export const packagePrice = (item: ServicePackage, size: number) =>
  Math.round(item.prices[size] * (1 - (item.discountPercent ?? 0) / 100));

export const includedFeatures = (
  catalog: PackageCatalog,
  packageId: string,
) => {
  const level = catalog.packages.findIndex((item) => item.id === packageId) + 1;
  return catalog.features.filter((feature) => feature.levels.includes(level));
};

// Package membership, prices and active discounts were checked against the
// original site's rendered tables on 26 September 2026. See ASSETS.md.
export const packageCatalog: Partial<Record<ServiceId, PackageCatalog>> = {
  exterior: {
    title: "Exterior",
    source:
      "https://www.detailingmaniacs.ro/polish-auto-profesional-bucuresti/",
    packages: [
      {
        id: "exterior-1",
        name: "Nivel 1",
        subtitle: "Luciu & întreținere",
        prices: [1650, 1850, 2350],
        highlights: [
          "Polish într-un pas, pentru redarea luciului",
          "Spălare și decontaminare",
          "Sealant ceramic — 3 luni",
        ],
      },
      {
        id: "exterior-2",
        name: "Nivel 2",
        subtitle: "Corecție & protecție",
        prices: [2600, 2800, 3350],
        discountPercent: 15,
        highlights: [
          "Polish în 2 pași",
          "Corecția zgârieturilor medii",
          "Ceramică 2 ani — în 2 straturi",
        ],
      },
      {
        id: "exterior-3",
        name: "Nivel 3",
        subtitle: "Profunzime & durabilitate",
        prices: [2800, 3000, 3550],
        discountPercent: 15,
        highlights: [
          "Polish în 3 pași și trimuri lucioase",
          "Ceramică 4 ani — în 2 straturi",
          "Protecție trimuri, crom și piano black",
        ],
      },
      {
        id: "exterior-4",
        name: "Nivel 4",
        subtitle: "Finisajul complet",
        prices: [3550, 3750, 4250],
        discountPercent: 15,
        highlights: [
          "Polish în 4 pași și tipsuri evacuare",
          "Ceramică peste 5 ani — în 2 straturi",
          "Tratament hidrofob și prosop microfibră",
        ],
      },
    ],
    features: [
      { label: "Spălare profesională", levels: [1, 2, 3, 4] },
      { label: "Decontaminare chimică și mecanică", levels: [1, 2, 3, 4] },
      { label: "Dressing anvelope", levels: [1, 2, 3, 4] },
      {
        label: "Polish 1 pas — redare luciu / lustruire",
        levels: [1, 2, 3, 4],
      },
      {
        label: "Polish 2 pași — corecția zgârieturilor medii și lustruire",
        levels: [2, 3, 4],
      },
      {
        label:
          "Polish 3 pași — corecția zgârieturilor adânci, medii și lustruire",
        levels: [3, 4],
      },
      {
        label:
          "Polish 4 pași — corecția zgârieturilor adânci, medii și lustruire",
        levels: [4],
      },
      { label: "Polish trimuri lucioase", levels: [3, 4] },
      { label: "Dressing plastice exterioare", levels: [3, 4] },
      { label: "Polish tipsuri evacuare", levels: [4] },
      {
        label: "Tratament hidrofob pentru parbriz, lunetă, geamuri și oglinzi",
        levels: [4],
      },
      { label: "Sealant ceramic — 3 luni", levels: [1] },
      { label: "Protecție ceramică 2 ani — în 2 straturi", levels: [2] },
      { label: "Protecție ceramică 4 ani — în 2 straturi", levels: [3] },
      { label: "Protecție ceramică peste 5 ani — în 2 straturi", levels: [4] },
      {
        label: "Protecție ceramică pentru trimuri, crom și piano black",
        levels: [3, 4],
      },
      { label: "Prosop microfibră pentru uscarea mașinii", levels: [4] },
    ],
    addons: [
      {
        id: "hidrofob",
        name: "Tratament hidrofob suprafețe vitrate",
        details:
          "Parbriz, geamuri laterale, lunetă și oglinzi. Deja inclus în Nivel 4.",
        price: 450,
        includedIn: ["exterior-4"],
      },
      { id: "top-coat", name: "Top Coat Gyeon Infinite", price: 1350 },
      {
        id: "jante",
        name: "Protecție ceramică jante",
        details: "Demontare, curățare și polish jante",
        price: 1250,
      },
    ],
    note: "Durata protecției depinde de întreținere. Opțiunile suplimentare se confirmă cu echipa, pentru a evita suprapunerea cu serviciile deja incluse.",
  },
  interior: {
    title: "Interior",
    source:
      "https://www.detailingmaniacs.ro/detailing-interior-auto-bucuresti/",
    packages: [
      {
        id: "interior-1",
        name: "Nivel 1",
        subtitle: "Curățare în profunzime",
        prices: [900, 1000, 1100],
        discountPercent: 10,
        highlights: [
          "Aspirare și injecție-extracție",
          "Scaune, bord, plafon și portbagaj",
          "Piele, volan, geamuri și detalii",
        ],
      },
      {
        id: "interior-2",
        name: "Nivel 2",
        subtitle: "Curățare & îngrijire",
        prices: [1200, 1300, 1400],
        discountPercent: 10,
        highlights: [
          "Toate serviciile din Nivel 1",
          "Igienizare cu ozon a habitaclului și climatizării",
          "Dressing plastice și hidratare piele",
        ],
      },
      {
        id: "interior-3",
        name: "Nivel 3",
        subtitle: "Protecție completă",
        prices: [1600, 1700, 1800],
        discountPercent: 10,
        highlights: [
          "Toate serviciile din Nivel 2",
          "Tratament hidrofob",
          "Ceramică pentru piele și plastice interioare",
        ],
      },
    ],
    features: [
      { label: "Spălare profesională exterioară", levels: [1, 2, 3] },
      { label: "Aspirare profesională", levels: [1, 2, 3] },
      { label: "Injecție-extracție scaune și mochetă", levels: [1, 2, 3] },
      { label: "Eliminare mirosuri", levels: [1, 2, 3] },
      { label: "Curățare scaune și banchetă", levels: [1, 2, 3] },
      { label: "Curățare bord", levels: [1, 2, 3] },
      { label: "Curățare plafon și stâlpi", levels: [1, 2, 3] },
      { label: "Curățare piele și volan", levels: [1, 2, 3] },
      { label: "Curățare chedere", levels: [1, 2, 3] },
      { label: "Curățare fețe de uși", levels: [1, 2, 3] },
      { label: "Curățare covorașe — 1 set", levels: [1, 2, 3] },
      { label: "Curățare portbagaj", levels: [1, 2, 3] },
      { label: "Curățare mochetă și capitonaje portbagaj", levels: [1, 2, 3] },
      { label: "Curățare compartiment roată de rezervă", levels: [1, 2, 3] },
      { label: "Curățare geamuri și suprafețe vitrate", levels: [1, 2, 3] },
      { label: "Curățare tetiere", levels: [1, 2, 3] },
      {
        label: "Igienizare cu ozon — habitaclu și climatizare",
        levels: [2, 3],
      },
      { label: "Dressing pentru plastice", levels: [2, 3] },
      { label: "Hidratare elemente de piele", levels: [2, 3] },
      { label: "Tratament hidrofob", levels: [3] },
      {
        label: "Protecție ceramică — scaune față, banchetă și cotieră",
        levels: [3],
      },
      { label: "Protecție ceramică plastice interioare", levels: [3] },
    ],
  },
  ppf: {
    title: "PPF",
    source: "https://www.detailingmaniacs.ro/infoliere-ppf-bucuresti/",
    packages: [
      {
        id: "ppf-1",
        name: "PPF 1",
        subtitle: "Protecție faruri",
        prices: [500, 500, 500],
        highlights: ["Înfoliere PPF faruri", "Acoperire dedicată farurilor"],
      },
      {
        id: "ppf-2",
        name: "PPF 2",
        subtitle: "Zone expuse",
        prices: [1100, 1100, 1100],
        highlights: [
          "Înfoliere PPF faruri",
          "Zona de încărcare a portbagajului",
          "Zona pragurilor ușilor",
        ],
      },
      {
        id: "ppf-3",
        name: "PPF 3",
        subtitle: "Pachet frontal",
        prices: [6500, 7000, 7500],
        highlights: [
          "Toate zonele din PPF 2",
          "Bară față, capotă și aripi față",
          "Oglinzi",
        ],
      },
      {
        id: "ppf-4",
        name: "PPF 4",
        subtitle: "Protecție integrală",
        prices: [14500, 15000, 17000],
        highlights: [
          "Înfoliere completă PPF",
          "Toate zonele din PPF 3",
          "Acoperire pentru întreaga caroserie",
        ],
      },
    ],
    features: [
      { label: "Înfoliere PPF faruri", levels: [1, 2, 3, 4] },
      {
        label: "Înfoliere PPF — zona de încărcare a portbagajului",
        levels: [2, 3, 4],
      },
      { label: "Înfoliere PPF — zona pragurilor ușilor", levels: [2, 3, 4] },
      {
        label: "Pachet frontal PPF — bară față, capotă, aripi față și oglinzi",
        levels: [3, 4],
      },
      { label: "Înfoliere completă PPF", levels: [4] },
    ],
    note: "PPF 1 include folia pentru faruri. Recondiționarea prin polish + folie este un serviciu separat, de 750 lei + TVA.",
  },
  colantare: {
    title: "Colantare",
    source: "https://www.detailingmaniacs.ro/colantari-auto-bucuresti/",
    packages: [
      {
        id: "colantare-1",
        name: "Avery Dennison",
        subtitle: "Colantare integrală",
        prices: [7000, 8000, 9000],
        highlights: [
          "Colantare integrală cu folie Avery Dennison",
          "Culoarea și finisajul se aleg împreună",
        ],
      },
      {
        id: "colantare-2",
        name: "3M",
        subtitle: "Colantare integrală",
        prices: [7500, 8500, 9500],
        highlights: [
          "Colantare integrală cu folie 3M",
          "Culoarea și finisajul se aleg împreună",
        ],
      },
      {
        id: "colantare-3",
        name: "KPMF",
        subtitle: "Colantare integrală",
        prices: [8000, 9000, 10000],
        highlights: [
          "Colantare integrală cu folie KPMF",
          "Culoarea și finisajul se aleg împreună",
        ],
      },
      {
        id: "colantare-4",
        name: "Oracal Premium 970",
        subtitle: "Colantare integrală",
        prices: [8500, 9500, 10500],
        highlights: [
          "Colantare integrală cu folie Oracal Premium 970",
          "Culoarea și finisajul se aleg împreună",
        ],
      },
    ],
    features: [
      {
        label: "Colantare integrală cu marca de folie aleasă",
        levels: [1, 2, 3, 4],
      },
    ],
    note: "Toate cele patru variante includ colantare integrală. Diferența dintre pachete este marca foliei; culoarea și finisajul se stabilesc cu echipa.",
  },
  cursuri: {
    title: "Cursuri",
    source: "https://www.detailingmaniacs.ro/curs-detailing-auto-bucuresti/",
    vehicleSized: false,
    packages: [
      {
        id: "cursuri-grup",
        name: "Curs de grup",
        subtitle: "Înveți și lucrezi în echipă",
        prices: [5000, 5000, 5000],
        highlights: [
          "Grupă mică, practică în atelier",
          "Consumabile și echipamente incluse",
          "Certificat de participare și suport post-curs",
        ],
      },
      {
        id: "cursuri-individual",
        name: "Curs individual",
        subtitle: "Format 1 la 1",
        prices: [7000, 7000, 7000],
        highlights: [
          "Pregătire personalizată pe nivelul tău",
          "Consumabile și echipamente incluse",
          "Certificat de participare și suport post-curs",
        ],
      },
    ],
    features: [
      {
        label: "Evaluarea vehiculului și organizarea atelierului",
        levels: [1, 2],
      },
      { label: "Produse, echipamente și consumabile incluse", levels: [1, 2] },
      { label: "Spălare și decontaminare chimică și mecanică", levels: [1, 2] },
      { label: "Tehnici de corecție și polish", levels: [1, 2] },
      { label: "Protecția și întreținerea suprafețelor", levels: [1, 2] },
      { label: "Detailing interior", levels: [1, 2] },
      { label: "Noțiuni pentru începerea propriei afaceri", levels: [1, 2] },
      { label: "Examen practic și feedback individual", levels: [1, 2] },
      {
        label: "Certificat de participare și suport post-curs",
        levels: [1, 2],
      },
      { label: "Format în grupă mică", levels: [1] },
      { label: "Pregătire individuală, 1 la 1", levels: [2] },
    ],
    note: "Structura prezentată pe site: 7 zile, aproximativ 90% practică și 10% teorie. Durata, nivelul și modulele opționale se confirmă la înscriere.",
  },
};
