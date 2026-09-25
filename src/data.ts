export const asset = (file: string) =>
  `${import.meta.env.BASE_URL}images/${file}`;

export const contact = {
  phone: "+40738368842",
  displayPhone: "0738 368 842",
  whatsapp: "40738368842",
  email: "contact@detailingmaniacs.ro",
  maps: "https://www.google.com/maps?cid=17659579207144528973",
  instagram: "https://www.instagram.com/detailing_maniacs_bucharest/",
};

export type ServiceId =
  | "exterior"
  | "interior"
  | "ppf"
  | "colantare"
  | "retapitare"
  | "faruri"
  | "motor"
  | "insonorizare"
  | "cursuri";

export type Service = {
  id: ServiceId;
  number: string;
  name: string;
  label: string;
  image: string;
  description: string;
  details: string;
  features: string[];
  prices?: [number, number, number];
};

export const services: Service[] = [
  {
    id: "exterior",
    number: "01",
    name: "Detailing exterior",
    label: "STRĂLUCIRE FĂRĂ COMPROMIS",
    image: "exterior.webp",
    description:
      "Redescoperă culoarea. Corecție de lac, polish de precizie și protecție pentru fiecare drum.",
    details:
      "Pornim de la starea reală a vopselei. Curățăm și decontaminăm suprafața, apoi alegem împreună nivelul de corecție și protecția potrivită mașinii tale.",
    features: [
      "Spălare și decontaminare în profunzime",
      "Polish și corecție profesională a lacului",
      "Opțiuni de protecție ceramică",
      "Recomandări pentru întreținerea finisajului",
    ],
    prices: [1650, 1850, 2350],
  },
  {
    id: "interior",
    number: "02",
    name: "Detailing interior",
    label: "SENZAȚIA ACEEA DE NOU",
    image: "interior.webp",
    description:
      "Un interior în care îți face plăcere să revii. Curățare în profunzime, până la ultimul detaliu.",
    details:
      "De la suprafețele pe care le atingi zilnic până la colțurile greu accesibile, tratăm fiecare material cu produsele și tehnica potrivite.",
    features: [
      "Curățarea tapițeriei, mochetei și plafonului",
      "Îngrijirea pielii și a suprafețelor delicate",
      "Curățarea bordului, consolei și portbagajului",
      "Opțiuni de igienizare și protecție",
    ],
    prices: [810, 900, 990],
  },
  {
    id: "ppf",
    number: "03",
    name: "Protecție PPF",
    label: "INVIZIBILĂ. INDISPENSABILĂ.",
    image: "ppf.webp",
    description:
      "Bucură-te de drum. Folia transparentă preia uzura de zi cu zi, păstrând frumusețea vopselei.",
    details:
      "Alegem zonele expuse și acoperirea de care ai nevoie, de la elemente individuale până la caroseria completă. Aplicăm folia cu atenție la muchii și finisaj.",
    features: [
      "Folie transparentă pentru protecția vopselei",
      "Acoperire parțială sau integrală",
      "Protecție împotriva pietricelelor și zgârieturilor fine",
      "Finisaj atent și instrucțiuni de întreținere",
    ],
    prices: [500, 500, 500],
  },
  {
    id: "colantare",
    number: "04",
    name: "Colantare auto",
    label: "STILUL TĂU, FĂRĂ LIMITE",
    image: "ppf.webp",
    description: "O culoare nouă. Aceeași mașină pe care o iubești.",
    details:
      "Schimbăm culoarea sau adăugăm accente cu folie profesională. Alegem împreună finisajul, de la lucios și satinat până la mat.",
    features: [
      "Colantare integrală sau accente",
      "Finisaje lucioase, mate și satinate",
      "Chrome delete, plafon și oglinzi",
      "Pregătire și aplicare profesională",
    ],
    prices: [7000, 8000, 9000],
  },
  {
    id: "retapitare",
    number: "05",
    name: "Retapițare",
    label: "CONFORT REDEFINIT",
    image: "interior.webp",
    description: "Texturi, cusături și materiale care fac diferența.",
    details:
      "Recondiționăm sau înlocuim tapițeria volanului, scaunelor și plafonului, în funcție de uzură și de finisajul dorit.",
    features: [
      "Retapițare și recondiționare volan",
      "Retapițare scaune",
      "Refacerea plafonului",
      "Materiale și cusături alese împreună",
    ],
  },
  {
    id: "faruri",
    number: "06",
    name: "Polish faruri",
    label: "CLARITATE LA FIECARE DRUM",
    image: "exterior.webp",
    description: "Redăm claritatea farurilor și protejăm rezultatul.",
    details:
      "Recondiționăm suprafața farurilor mătuite sau îngălbenite, apoi aplicăm folie de protecție. Evaluăm starea lor înainte de intervenție.",
    features: [
      "Evaluarea suprafeței farurilor",
      "Corecție și polish profesional",
      "Aplicare folie de protecție",
      "Finisaj clar și uniform",
    ],
    prices: [750, 750, 750],
  },
  {
    id: "motor",
    number: "07",
    name: "Detailing motor",
    label: "GRIJĂ DINCOLO DE APARENȚE",
    image: "exterior.webp",
    description: "Curățare atentă, inclusiv sub capotă.",
    details:
      "Curățăm compartimentul motor cu atenție la componentele sensibile, folosind proceduri adaptate fiecărui automobil.",
    features: [
      "Evaluarea și protejarea componentelor sensibile",
      "Degresare și curățare controlată",
      "Uscare atentă",
      "Îngrijirea suprafețelor din plastic și cauciuc",
    ],
  },
  {
    id: "insonorizare",
    number: "08",
    name: "Insonorizare auto",
    label: "MAI MULT CONFORT LA DRUM",
    image: "interior.webp",
    description: "Un habitaclu mai liniștit, pentru drumurile tale.",
    details:
      "Tratăm zonele alese ale caroseriei cu materiale profesionale pentru reducerea vibrațiilor și zgomotului de rulare.",
    features: [
      "Evaluarea zonelor de intervenție",
      "Materiale pentru amortizarea vibrațiilor",
      "Tratament pentru uși, podea sau portbagaj",
      "Montaj atent și verificarea finisajelor",
    ],
  },
  {
    id: "cursuri",
    number: "09",
    name: "Cursuri detailing",
    label: "PASIUNEA SE ÎNVAȚĂ",
    image: "workshop.webp",
    description: "Din pasiune pentru mașini, spre o meserie.",
    details:
      "Învață în atelier, prin teorie și exerciții practice: pregătirea mașinii, alegerea produselor, polish și îngrijirea interiorului.",
    features: [
      "Evaluarea mașinii și planul de lucru",
      "Produse, echipamente și pregătirea suprafețelor",
      "Tehnici de polish și protecție",
      "Practică în atelier",
    ],
  },
];

export const carSizes = [
  { name: "Compactă", example: "Polo, Golf, Clio" },
  { name: "Medie", example: "Seria 3, Passat, A4" },
  { name: "Mare / SUV", example: "X5, Q7, GLE" },
];

export const projects = [
  {
    name: "Audi RS6 Avant",
    type: "Detailing exterior",
    category: "Exterior",
    image: "audi.webp",
    description:
      "Finisajul caroseriei și reflexiile din atelier, după îngrijirea exteriorului.",
  },
  {
    name: "Porsche 911",
    type: "Din atelierul nostru",
    category: "Exterior",
    image: "porsche.webp",
    description: "Un Porsche 911 surprins în atelierul Detailing Maniacs.",
  },
  {
    name: "BMW",
    type: "Din atelierul nostru",
    category: "Exterior",
    image: "bmw.webp",
    description: "Detaliile unei caroserii albastre, sub luminile atelierului.",
  },
  {
    name: "Atenție la fiecare suprafață",
    type: "Detailing interior",
    category: "Interior",
    image: "interior.webp",
    description:
      "Îngrijirea interiorului, cu instrumente și produse potrivite materialelor.",
  },
  {
    name: "Precizie la fiecare muchie",
    type: "Aplicare folie PPF",
    category: "PPF",
    image: "ppf.webp",
    description:
      "Aplicarea foliei de protecție, un proces care cere răbdare și precizie.",
  },
  {
    name: "Porsche, în lucru",
    type: "Polish profesional",
    category: "Exterior",
    image: "workshop.webp",
    description: "Corecția lacului în atelier, pentru un finisaj uniform.",
  },
];

export const faqs = [
  [
    "Ce serviciu se potrivește mașinii mele?",
    "Depinde de starea mașinii și de ce îți dorești să îmbunătățești. Trimite-ne modelul și câteva fotografii pe WhatsApp sau vino la atelier. Îți explicăm opțiunile și stabilim împreună ce merită făcut.",
  ],
  [
    "Cât costă un detailing?",
    "Prețul depinde de dimensiunea mașinii, starea suprafețelor și pachetul ales. În formular poți vedea tarifele orientative de pornire, fără TVA. Devizul final se confirmă cu echipa, după evaluare, înainte de începerea lucrării.",
  ],
  [
    "Cât timp rămâne mașina în atelier?",
    "Durata variază în funcție de serviciu, de starea mașinii și de timpul necesar produselor aplicate. La confirmarea programării îți comunicăm intervalul de lucru și momentul în care poți ridica mașina.",
  ],
  [
    "Care este diferența dintre ceramică și PPF?",
    "Protecția ceramică ajută la întreținere și adaugă hidrofobie suprafeței. PPF este o folie care oferă și o barieră fizică împotriva pietricelelor și zgârieturilor ușoare. Putem discuta o combinație potrivită modului în care folosești mașina.",
  ],
  [
    "Cum fac o programare?",
    "Alege un serviciu și completează detaliile mașinii. Formularul pregătește un mesaj pe care îl trimiți tu prin WhatsApp. Echipa îți confirmă disponibilitatea, oferta și data. Ne poți suna și direct la 0738 368 842.",
  ],
];
