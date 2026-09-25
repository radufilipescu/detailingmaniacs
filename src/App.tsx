import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Crosshair,
  Diamond,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  asset,
  carSizes,
  contact,
  faqs,
  projects,
  services,
  type Service,
  type ServiceId,
} from "./data";
import PackageExplorer from "./PackageExplorer";
import {
  includedFeatures,
  packageCatalog,
  packagePrice,
  type BookingSelection,
} from "./packages";

const money = (value: number) => new Intl.NumberFormat("ro-RO").format(value);
const whatsAppLink = (text: string) =>
  `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href="#acasa"
      aria-label="Detailing Maniacs — Acasă"
    >
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
      </span>
      <span className="brand-name">
        DETAILING<span>MANIACS</span>
      </span>
    </a>
  );
}

function SectionLabel({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`section-label ${light ? "label-dark" : ""}`}>
      <span />
      {children}
    </p>
  );
}

function Modal({
  children,
  title,
  onClose,
  className = "",
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = oldOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={title}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === ref.current) {
          const bounds = ref.current.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="icon-button modal-close"
        aria-label="Închide"
        onClick={onClose}
      >
        <X size={22} />
      </button>
      {children}
    </dialog>
  );
}

function Booking({
  initialSelection,
  onClose,
}: {
  initialSelection: BookingSelection;
  onClose: () => void;
}) {
  const [serviceId, setServiceId] = useState<ServiceId>(
    initialSelection.serviceId,
  );
  const [size, setSize] = useState(initialSelection.size ?? 1);
  const [packageId, setPackageId] = useState(initialSelection.packageId ?? "");
  const [addonIds, setAddonIds] = useState(initialSelection.addonIds ?? []);
  const [step, setStep] = useState(1);
  const [model, setModel] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [prepared, setPrepared] = useState(false);
  const stepTitle = useRef<HTMLHeadingElement>(null);
  const service = services.find((item) => item.id === serviceId)!;
  const catalog = packageCatalog[serviceId];
  const selectedPackage = catalog?.packages.find(
    (item) => item.id === packageId,
  );
  const hasVehicle = catalog?.vehicleSized !== false;
  const extras = (catalog?.addons ?? []).filter(
    (addon) =>
      addonIds.includes(addon.id) && !addon.includedIn?.includes(packageId),
  );
  const price = selectedPackage
    ? packagePrice(selectedPackage, size)
    : service.prices?.[size];
  const total =
    price === undefined
      ? undefined
      : price + extras.reduce((sum, addon) => sum + addon.price, 0);
  const now = new Date();
  const minDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const displayDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("ro-RO")
    : "De stabilit împreună";
  const message = [
    `Bună! Sunt ${name.trim()} și aș dori ${hasVehicle ? "o programare" : "o înscriere la curs"} la Detailing Maniacs.`,
    "",
    `Serviciu: ${service.name}`,
    selectedPackage
      ? `Pachet: ${selectedPackage.name}`
      : catalog
        ? "Pachet: aș dori recomandarea echipei"
        : null,
    hasVehicle ? `Mașină: ${model.trim()}` : null,
    hasVehicle ? `Categorie: ${carSizes[size].name}` : null,
    price !== undefined
      ? `${selectedPackage ? "Tarif pachet" : "Tarif de pornire"}: ${money(price)} lei + TVA`
      : null,
    ...extras.map(
      (addon) =>
        `Opțiune suplimentară: ${addon.name} — ${money(addon.price)} lei + TVA`,
    ),
    extras.length && total !== undefined
      ? `Total orientativ: ${money(total)} lei + TVA`
      : null,
    `Data preferată: ${displayDate}`,
    notes.trim() ? `Detalii: ${notes.trim()}` : null,
    "",
    "Îmi puteți confirma disponibilitatea și oferta? Mulțumesc!",
  ]
    .filter((line) => line !== null)
    .join("\n");

  useEffect(() => {
    stepTitle.current?.focus({ preventScroll: true });
  }, [step, prepared]);

  return (
    <Modal
      title="Solicită o programare"
      onClose={onClose}
      className="booking-modal"
    >
      <div className="booking-intro">
        <SectionLabel>
          {hasVehicle
            ? "HAI SĂ VORBIM DESPRE MAȘINA TA"
            : "PASIUNEA SE ÎNVAȚĂ ÎN ATELIER"}
        </SectionLabel>
        <h2 ref={stepTitle} tabIndex={-1}>
          {prepared ? (
            "TOTUL ÎNCEPE\nCU UN MESAJ."
          ) : (
            <>
              URMĂTORUL PAS?
              <br />
              <span className="text-accent">
                {hasVehicle
                  ? "O MAȘINĂ IMPECABILĂ."
                  : "PASIUNEA TA, O MESERIE."}
              </span>
            </>
          )}
        </h2>
        <p>
          {prepared
            ? "Cererea ta este pregătită. Trimite-o echipei pe WhatsApp pentru confirmare."
            : "Câteva detalii. O recomandare potrivită. Fără obligații."}
        </p>
      </div>
      {!prepared ? (
        <>
          <div className="booking-progress" aria-label={`Pasul ${step} din 2`}>
            <span className="active">
              <b>01</b> {hasVehicle ? "Pachet & mașină" : "Alege cursul"}
            </span>
            <span className={step === 2 ? "active" : ""}>
              <b>02</b> Detaliile tale
            </span>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (step === 1) setStep(2);
              else setPrepared(true);
            }}
          >
            {step === 1 ? (
              <div className="form-step">
                <label className="field-label" htmlFor="service">
                  {hasVehicle
                    ? "Ce îți dorești pentru mașina ta?"
                    : "Ce serviciu te interesează?"}
                </label>
                <div className="select-wrap">
                  <select
                    id="service"
                    value={serviceId}
                    onChange={(event) => {
                      setServiceId(event.target.value as ServiceId);
                      setPackageId("");
                      setAddonIds([]);
                    }}
                  >
                    {services.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={17} />
                </div>
                {hasVehicle && (
                  <fieldset className="car-fieldset">
                    <legend>Dimensiunea mașinii</legend>
                    <div className="car-options">
                      {carSizes.map((car, index) => (
                        <label
                          key={car.name}
                          className={size === index ? "selected" : ""}
                        >
                          <input
                            type="radio"
                            name="size"
                            checked={size === index}
                            onChange={() => setSize(index)}
                          />
                          <span>{car.name}</span>
                          <small>{car.example}</small>
                          {size === index && <Check size={14} />}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
                {catalog && (
                  <div className="booking-package-picker">
                    <label className="field-label" htmlFor="package">
                      Pachetul dorit
                    </label>
                    <div className="select-wrap">
                      <select
                        id="package"
                        value={packageId}
                        onChange={(event) => setPackageId(event.target.value)}
                      >
                        <option value="">Aș dori recomandarea echipei</option>
                        {catalog.packages.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} — {money(packagePrice(item, size))} lei
                            + TVA
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={17} />
                    </div>
                    {selectedPackage && (
                      <details
                        className="booking-package-details"
                        key={selectedPackage.id}
                      >
                        <summary>
                          Ce include {selectedPackage.name}
                          <ChevronDown size={15} />
                        </summary>
                        <ul>
                          {includedFeatures(catalog, selectedPackage.id).map(
                            (feature) => (
                              <li key={feature.label}>
                                <Check size={13} />
                                {feature.label}
                              </li>
                            ),
                          )}
                        </ul>
                      </details>
                    )}
                    {catalog.addons && (
                      <fieldset className="booking-addons">
                        <legend>
                          Opțiuni suplimentare <span>(opțional)</span>
                        </legend>
                        {catalog.addons.map((addon) => (
                          <label key={addon.id}>
                            <input
                              type="checkbox"
                              disabled={addon.includedIn?.includes(packageId)}
                              checked={
                                addonIds.includes(addon.id) ||
                                Boolean(addon.includedIn?.includes(packageId))
                              }
                              onChange={(event) =>
                                setAddonIds(
                                  event.target.checked
                                    ? [...addonIds, addon.id]
                                    : addonIds.filter((id) => id !== addon.id),
                                )
                              }
                            />
                            <span>
                              {addon.name}
                              <small>
                                {addon.includedIn?.includes(packageId)
                                  ? "Inclus în pachet"
                                  : `+${money(addon.price)} lei + TVA`}
                              </small>
                            </span>
                          </label>
                        ))}
                      </fieldset>
                    )}
                  </div>
                )}
                {hasVehicle && (
                  <>
                    <label className="field-label" htmlFor="model">
                      Marca și modelul <span>*</span>
                    </label>
                    <input
                      id="model"
                      required
                      maxLength={80}
                      pattern=".*\S.*"
                      value={model}
                      onChange={(event) => setModel(event.target.value)}
                      placeholder="ex. BMW Seria 3, 2021"
                      autoComplete="off"
                    />
                  </>
                )}
                <div className="price-summary">
                  <div>
                    <span>
                      {selectedPackage
                        ? extras.length
                          ? "TOTAL ORIENTATIV"
                          : "TARIF PACHET"
                        : "ESTIMARE DE PORNIRE"}
                    </span>
                    <strong>
                      {total !== undefined ? (
                        <>
                          {!selectedPackage && "de la "}
                          {money(total)} <small>lei + TVA</small>
                        </>
                      ) : (
                        "Ofertă personalizată"
                      )}
                    </strong>
                  </div>
                  <ShieldCheck size={25} />
                </div>
                <p className="form-note">
                  {serviceId === "ppf" &&
                  (!selectedPackage || selectedPackage.id === "ppf-1")
                    ? "Tariful de pornire este pentru protecție parțială. "
                    : ""}
                  Preț orientativ. Pachetul, promoțiile și oferta finală se
                  confirmă cu echipa.
                </p>
                <button
                  className="button button-accent full-width"
                  type="submit"
                >
                  Continuă <ArrowRight size={19} />
                </button>
              </div>
            ) : (
              <div className="form-step">
                <div className="selected-summary">
                  <CircleCheck size={20} />
                  <div>
                    <strong>{service.name}</strong>
                    {selectedPackage && (
                      <span className="selected-package-name">
                        {selectedPackage.name} · {money(total!)} lei + TVA
                      </span>
                    )}
                    <span>
                      {hasVehicle
                        ? `${model} · ${carSizes[size].name}`
                        : "Înscriere la curs"}
                    </span>
                    {extras.length > 0 && (
                      <span>
                        {extras.map((addon) => addon.name).join(" · ")}
                      </span>
                    )}
                  </div>
                  <button type="button" onClick={() => setStep(1)}>
                    Modifică
                  </button>
                </div>
                <div className="form-row">
                  <div>
                    <label className="field-label" htmlFor="name">
                      Numele tău <span>*</span>
                    </label>
                    <input
                      id="name"
                      required
                      pattern=".*\S.*"
                      maxLength={80}
                      autoComplete="given-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Cum te numești?"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="date">
                      Data preferată <small>(opțional)</small>
                    </label>
                    <input
                      type="date"
                      id="date"
                      min={minDate}
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                    />
                  </div>
                </div>
                <label className="field-label" htmlFor="notes">
                  Ce ar trebui să știm? <small>(opțional)</small>
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  maxLength={600}
                  placeholder="Starea mașinii, zone care au nevoie de atenție, întrebări…"
                  rows={3}
                />
                <p className="form-note">
                  <MessageCircle size={17} /> Pregătim mesajul pentru WhatsApp.
                  Programarea devine confirmată doar după răspunsul echipei.
                </p>
                <div className="form-actions">
                  <button
                    className="button button-back"
                    type="button"
                    onClick={() => setStep(1)}
                    aria-label="Înapoi la serviciu"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button className="button button-accent" type="submit">
                    Pregătește mesajul <ArrowRight size={19} />
                  </button>
                </div>
              </div>
            )}
          </form>
        </>
      ) : (
        <div className="prepared-message">
          <div className="message-preview">{message}</div>
          <a
            className="button button-accent full-width"
            href={whatsAppLink(message)}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={20} /> Deschide WhatsApp{" "}
            <ArrowUpRight size={20} />
          </a>
          <p className="form-note">
            Vei deschide WhatsApp, unde poți verifica și trimite mesajul. Nimic
            nu a fost trimis încă.
          </p>
          <button className="text-link" onClick={() => setPrepared(false)}>
            Editează detaliile <ArrowLeft size={15} />
          </button>
        </div>
      )}
      <div className="booking-help">
        Preferi să ne auzim?{" "}
        <a href={`tel:${contact.phone}`}>
          <Phone size={14} />
          {contact.displayPhone}
        </a>
      </div>
    </Modal>
  );
}

function ServiceModal({
  service,
  onClose,
  onBook,
  onPackages,
}: {
  service: Service;
  onClose: () => void;
  onBook: (id: ServiceId) => void;
  onPackages: (id: ServiceId) => void;
}) {
  return (
    <Modal title={service.name} onClose={onClose} className="service-modal">
      <img
        src={asset(service.image)}
        alt={service.name}
        className="service-modal-image"
      />
      <div className="service-modal-content">
        <SectionLabel>{service.label}</SectionLabel>
        <h2>{service.name}</h2>
        <p>{service.details}</p>
        <ul className="feature-list">
          {service.features.map((feature) => (
            <li key={feature}>
              <Check size={17} />
              {feature}
            </li>
          ))}
        </ul>
        {packageCatalog[service.id] && (
          <div className="service-package-invitation">
            <div>
              <strong>
                {packageCatalog[service.id]!.packages.length} pachete, toate
                detaliile.
              </strong>
              <p>
                Compară ce include fiecare variantă și prețul pentru clasa ta.
              </p>
            </div>
            <button
              className="button button-accent"
              onClick={() => onPackages(service.id)}
            >
              Vezi pachetele <ArrowRight size={18} />
            </button>
          </div>
        )}
        <div className="service-modal-bottom">
          <div className="service-price">
            {service.prices ? (
              <>
                de la <strong>{money(service.prices[0])}</strong> lei + TVA
              </>
            ) : (
              "Ofertă personalizată"
            )}
          </div>
          <button
            className={`button ${packageCatalog[service.id] ? "button-outline" : "button-accent"}`}
            onClick={() => onBook(service.id)}
          >
            Solicită o programare <ArrowUpRight size={18} />
          </button>
        </div>
        <p className="form-note">
          Tarif orientativ. Oferta finală depinde de mașină și de pachetul ales.
        </p>
      </div>
    </Modal>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [booking, setBooking] = useState<BookingSelection | null>(null);
  const [packageService, setPackageService] = useState<ServiceId>("exterior");
  const [service, setService] = useState<Service | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [filter, setFilter] = useState("Toate");
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [review, setReview] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const reviews = [
    {
      text: "Am luat o masina cu totul noua.",
      name: "Daniel Sarpe",
      initials: "DS",
      service: "Detailing exterior",
      link: "https://share.google/DsD0rPxCGSxFt4fgG",
    },
    {
      text: "Recomand cu încredere!",
      name: "Tudor Lotrea",
      initials: "TL",
      service: "Protecție faruri",
      link: "https://share.google/45hyoohNetkAJ7Iut",
    },
    {
      text: "Totul a fost profesionist și bine organizat.",
      name: "Vlad Barbu",
      initials: "VB",
      service: "Experiență în atelier",
      link: "https://share.google/YOA3NIwYBIdceQ47a",
    },
  ];
  const navItems = [
    { id: "servicii", name: "Servicii" },
    { id: "pachete", name: "Pachete" },
    { id: "despre", name: "De ce noi" },
    { id: "proiecte", name: "Proiecte" },
    { id: "contact", name: "Contact" },
  ];
  const filteredProjects = projects
    .map((project, index) => ({ ...project, index }))
    .filter((project) => filter === "Toate" || project.category === filter);
  const visibleProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, 3);

  const openBooking = (
    id: ServiceId = "exterior",
    selection: Partial<BookingSelection> = {},
  ) => {
    setService(null);
    setMenuOpen(false);
    setBooking({ ...selection, serviceId: id });
  };

  const openPackages = (id: ServiceId) => {
    setService(null);
    setPackageService(id);
    requestAnimationFrame(() => {
      document.getElementById("pachete")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
      document
        .getElementById("packages-heading")
        ?.focus({ preventScroll: true });
      window.history.replaceState(null, "", "#pachete");
    });
  };

  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;
    let cancelled = false;
    // React mounts after the browser's initial fragment lookup. Wait for fonts
    // so shared section links land in the right place with the final layout.
    void document.fonts.ready.then(() => {
      if (cancelled || window.location.hash.slice(1) !== targetId) return;
      document
        .getElementById(targetId)
        ?.scrollIntoView({ behavior: "instant" });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((section) => sectionObserver.observe(section));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (galleryIndex === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight")
        setGalleryIndex((index) => ((index ?? 0) + 1) % projects.length);
      if (event.key === "ArrowLeft")
        setGalleryIndex(
          (index) => ((index ?? 0) - 1 + projects.length) % projects.length,
        );
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [galleryIndex]);

  return (
    <>
      <a className="skip-link" href="#main">
        Sari la conținut
      </a>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Navigare principală">
            {navItems.map((item) => (
              <a
                className={activeSection === item.id ? "active" : ""}
                href={`#${item.id}`}
                key={item.id}
              >
                {item.name}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="header-phone" href={`tel:${contact.phone}`}>
              <Phone size={15} />
              {contact.displayPhone}
            </a>
            <button
              className="button button-accent header-book"
              onClick={() => openBooking()}
            >
              Programează-te <ArrowUpRight size={18} />
            </button>
            <button
              className="icon-button menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Deschide meniul"
              aria-expanded={menuOpen}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="acasa" aria-labelledby="hero-heading">
          <picture className="hero-image">
            <source
              media="(max-width: 640px)"
              srcSet={asset("hero-mobile.webp")}
            />
            <img
              src={asset("hero.webp")}
              alt="Porsche 911 cu finisaj impecabil, într-un studio întunecat"
              fetchPriority="high"
              width="2048"
              height="1152"
            />
          </picture>
          <div className="hero-shade" />
          <div className="container hero-container">
            <div className="hero-copy">
              <div className="hero-eyebrow">
                <span className="status-dot" /> ATELIER DE DETAILING AUTO{" "}
                <span className="eyebrow-divider" /> BUCUREȘTI
              </div>
              <h1 id="hero-heading">
                OBSESIA
                <br />
                PENTRU
                <br />
                <span>PERFECȚIUNE.</span>
              </h1>
              <p>
                Mașina ta. În cea mai bună formă.
                <br />
                <span>Detailing, protecție și o atenție care se vede.</span>
              </p>
              <div className="hero-actions">
                <a href="#servicii" className="button button-accent">
                  Descoperă serviciile <ArrowUpRight size={21} />
                </a>
                <button
                  className="video-button"
                  onClick={() => setVideoOpen(true)}
                >
                  <span>
                    <Play size={14} fill="currentColor" />
                  </span>
                  Intră în atelier
                </button>
              </div>
            </div>
            <div className="hero-bottom">
              <a className="scroll-link" href="#servicii">
                <span>
                  <ArrowDown size={17} />
                </span>
                DETALIILE FAC DIFERENȚA
              </a>
              <div className="hero-coordinates">
                <Crosshair size={18} />
                <span>
                  44°25′41.7″N 26°00′32.1″E
                  <br />
                  <b>BUCUREȘTI, SECTOR 6</b>
                </span>
              </div>
              <div className="hero-counter">
                <span>EST.</span>
                <i />
                2023<span className="counter-caption">DRIVEN BY DETAIL.</span>
              </div>
            </div>
          </div>
        </section>

        <div className="promise-strip">
          <div className="container promise-inner">
            <span>
              <Crosshair /> PRECIZIE ÎN FIECARE DETALIU
            </span>
            <span>
              <ShieldCheck /> PRODUSE PROFESIONALE
            </span>
            <span>
              <Diamond /> FINISAJE FĂRĂ COMPROMIS
            </span>
            <span>
              <Sparkles /> PASIUNE PENTRU MAȘINI
            </span>
          </div>
        </div>

        <section className="services section-space" id="servicii">
          <div className="container">
            <div className="section-heading reveal">
              <div>
                <SectionLabel>01 / CE FACEM</SectionLabel>
                <h2>
                  UN NOU STANDARD.
                  <br />
                  <span className="text-muted">PENTRU MAȘINA TA.</span>
                </h2>
              </div>
              <p>
                De la primul contact cu vopseaua până la
                <br className="desktop-break" /> ultimul detaliu din interior.
                Totul contează.
              </p>
            </div>
            <div className="service-grid">
              {services.slice(0, 3).map((item) => (
                <button
                  className="service-card reveal"
                  key={item.id}
                  onClick={() => setService(item)}
                  aria-label={`Descoperă ${item.name}`}
                >
                  <div className="service-image">
                    <img
                      src={asset(item.image)}
                      alt={
                        item.name === "Protecție PPF"
                          ? "Aplicare atentă a foliei PPF pe caroserie"
                          : `Specialist Detailing Maniacs — ${item.name.toLowerCase()}`
                      }
                      width="976"
                      height="549"
                      loading="lazy"
                    />
                    <span className="service-number">/{item.number}</span>
                    <span className="service-round-arrow">
                      <ArrowUpRight size={21} />
                    </span>
                  </div>
                  <div className="service-content">
                    <span className="small-label">{item.label}</span>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="service-card-bottom">
                      <span>
                        {packageCatalog[item.id]!.packages.length} pachete ·
                        vezi detaliile
                      </span>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="more-services reveal">
              <span>ȘI MAI MULT PENTRU MAȘINA TA</span>
              <div>
                {services.slice(3).map((item) => (
                  <button key={item.id} onClick={() => setService(item)}>
                    {item.name}
                    <Plus size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <PackageExplorer
          serviceId={packageService}
          onServiceChange={setPackageService}
          onBook={({ serviceId, ...selection }) =>
            openBooking(serviceId, selection)
          }
        />

        <section className="about section-space" id="despre">
          <div className="container about-grid">
            <div className="about-visual reveal">
              <img
                src={asset("workshop.webp")}
                alt="Specialist Detailing Maniacs lucrează la polishul unui Porsche, în atelierul din București"
                loading="lazy"
                width="1024"
                height="576"
              />
              <div className="image-corner top-left" />
              <div className="image-corner bottom-right" />
              <div className="workshop-tag">
                <span className="status-dot" /> DIN ATELIERUL NOSTRU{" "}
                <ArrowUpRight size={15} />
              </div>
              <div className="obsession-stamp">
                <Crosshair size={28} />
                <span>
                  100%<small>PASIUNE</small>
                </span>
              </div>
            </div>
            <div className="about-copy reveal">
              <SectionLabel>03 / ADN-UL NOSTRU</SectionLabel>
              <h2>
                UNII ÎI SPUN
                <br />
                ATENȚIE LA DETALII.
                <br />
                <span className="text-accent">
                  NOI ÎI SPUNEM
                  <br />
                  OBSESIE.
                </span>
              </h2>
              <p>
                Ne plac mașinile. Dar mai mult ne place momentul în care îți
                revezi mașina și zâmbești.
              </p>
              <p>
                De aceea, fiecare suprafață primește timp, fiecare produs are un
                scop, iar fiecare lucrare trece prin mâinile unor oameni cărora
                chiar le pasă.
              </p>
              <div className="about-principles">
                <span>
                  <Check size={15} /> Evaluare înainte de lucrare
                </span>
                <span>
                  <Check size={15} /> Recomandări pentru mașina ta
                </span>
                <span>
                  <Check size={15} /> Deviz explicat, fără surprize
                </span>
              </div>
              <button className="text-link" onClick={() => setVideoOpen(true)}>
                Cunoaște atelierul <ArrowUpRight size={19} />
              </button>
            </div>
          </div>
        </section>

        <section className="projects section-space" id="proiecte">
          <div className="container">
            <div className="section-heading reveal">
              <div>
                <SectionLabel>04 / FAPTE, NU DOAR CUVINTE</SectionLabel>
                <h2>
                  REZULTATUL?
                  <br />
                  <span className="text-muted">ÎL VEZI. ÎL SIMȚI.</span>
                </h2>
              </div>
              <a
                className="text-link"
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Mai multe pe Instagram <ArrowUpRight size={19} />
              </a>
            </div>
            <div className="project-toolbar">
              <div
                className="filter-tabs"
                role="group"
                aria-label="Filtrează proiectele"
              >
                {["Toate", "Exterior", "Interior", "PPF"].map((tab) => (
                  <button
                    key={tab}
                    aria-pressed={filter === tab}
                    className={filter === tab ? "selected" : ""}
                    onClick={() => {
                      setFilter(tab);
                      setShowAll(false);
                    }}
                  >
                    {tab}
                    {tab === "Toate" && (
                      <span>{projects.length.toString().padStart(2, "0")}</span>
                    )}
                  </button>
                ))}
              </div>
              <span className="project-count" aria-live="polite">
                {filteredProjects.length.toString().padStart(2, "0")} PROIECTE
                DIN ATELIER
              </span>
            </div>
            <div className="project-grid">
              {visibleProjects.map((project) => (
                <button
                  className="project-card"
                  key={project.name}
                  onClick={() => setGalleryIndex(project.index)}
                  aria-label={`Vezi proiectul ${project.name}`}
                >
                  <div className="project-image">
                    <img
                      src={asset(project.image)}
                      alt={project.name}
                      loading="lazy"
                      width="640"
                      height="720"
                    />
                    <span className="project-category">{project.category}</span>
                    <span className="project-zoom">
                      <Plus size={23} />
                    </span>
                  </div>
                  <div className="project-caption">
                    <div>
                      <span>{project.type}</span>
                      <h3>{project.name}</h3>
                    </div>
                    <ArrowUpRight size={23} />
                  </div>
                </button>
              ))}
            </div>
            {filteredProjects.length > 3 && (
              <div className="project-more">
                <button
                  className="button button-outline"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Arată mai puține" : "Vezi toate proiectele"}{" "}
                  {showAll ? <ArrowUpRight size={18} /> : <Plus size={18} />}
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="process section-space">
          <div className="container">
            <div className="section-heading reveal">
              <div>
                <SectionLabel>SIMPLU. CLAR. FĂRĂ GRIJI.</SectionLabel>
                <h2>
                  TU ADUCI MAȘINA.
                  <br />
                  <span className="text-muted">NOI NE OCUPĂM DE RESTUL.</span>
                </h2>
              </div>
            </div>
            <div className="process-grid">
              {[
                {
                  title: "Vorbim",
                  text: "Ne spui ce îți dorești. Îți ascultăm așteptările și găsim o dată potrivită.",
                  icon: MessageCircle,
                },
                {
                  title: "Evaluăm",
                  text: "Vedem mașina, alegem serviciile și îți explicăm devizul înainte să începem.",
                  icon: Crosshair,
                },
                {
                  title: "Transformăm",
                  text: "Lucrăm metodic, cu produse profesionale și răbdare pentru fiecare detaliu.",
                  icon: Sparkles,
                },
                {
                  title: "Te bucuri",
                  text: "Îți arătăm rezultatul și cum să păstrezi mașina în cea mai bună formă.",
                  icon: Diamond,
                },
              ].map((item, index) => (
                <div className="process-step reveal" key={item.title}>
                  <div className="process-step-top">
                    <span>0{index + 1}</span>
                    <item.icon size={25} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="reviews">
          <div className="container review-layout">
            <div className="review-intro">
              <SectionLabel light>VORBELE LOR. MOTIVAȚIA NOASTRĂ.</SectionLabel>
              <h2>
                SE VEDE ÎN MAȘINĂ.
                <br />
                SE CITEȘTE ÎN RECENZII.
              </h2>
              <a
                href={contact.maps}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Vezi recenziile pe Google <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="review-content" aria-live="polite">
              <div className="review-stars" aria-label="5 din 5 stele">
                ★★★★★<span>RECENZIE GOOGLE</span>
              </div>
              <blockquote key={review}>„{reviews[review].text}”</blockquote>
              <div className="review-bottom">
                <a
                  className="review-person"
                  href={reviews[review].link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="review-avatar">
                    {reviews[review].initials}
                  </span>
                  <span>
                    <strong>{reviews[review].name}</strong>
                    <small>{reviews[review].service}</small>
                  </span>
                  <ArrowUpRight size={15} />
                </a>
                <div className="review-controls">
                  <button
                    className="icon-button"
                    onClick={() => setReview((review + 2) % 3)}
                    aria-label="Recenzia anterioară"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span>0{review + 1} / 03</span>
                  <button
                    className="icon-button"
                    onClick={() => setReview((review + 1) % 3)}
                    aria-label="Recenzia următoare"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="faq section-space">
          <div className="container faq-grid">
            <div className="faq-heading reveal">
              <SectionLabel>BINE DE ȘTIUT</SectionLabel>
              <h2>
                FĂRĂ SEMNE
                <br />
                <span className="text-muted">DE ÎNTREBARE.</span>
              </h2>
              <p>
                Fiecare mașină e diferită.
                <br />
                Suntem aici să găsim varianta ta.
              </p>
              <a
                href={whatsAppLink(
                  "Bună! Am o întrebare despre serviciile Detailing Maniacs.",
                )}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Întreabă-ne pe WhatsApp <ArrowUpRight size={19} />
              </a>
            </div>
            <div className="faq-list reveal">
              {faqs.map(([question, answer], index) => (
                <div
                  className={`faq-item ${openFaq === index ? "open" : ""}`}
                  key={question}
                >
                  <h3>
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                      aria-expanded={openFaq === index}
                      aria-controls={`faq-answer-${index}`}
                      id={`faq-question-${index}`}
                    >
                      <span>{question}</span>
                      <Plus size={19} />
                    </button>
                  </h3>
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    hidden={openFaq !== index}
                  >
                    <p>{answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container">
            <div className="contact-top">
              <SectionLabel light>
                URMĂTOAREA TRANSFORMARE POATE FI A TA.
              </SectionLabel>
              <span className="contact-location">
                <MapPin size={16} /> BUCUREȘTI, SECTOR 6
              </span>
            </div>
            <div className="contact-main">
              <h2>
                HAI SĂ-I REDĂM
                <br />
                <span>EFECTUL WOW.</span>
              </h2>
              <button
                className="contact-circle"
                onClick={() => openBooking()}
                aria-label="Programează o vizită"
              >
                <ArrowUpRight size={53} />
                <span>
                  PROGRAMEAZĂ
                  <br />O VIZITĂ
                </span>
              </button>
            </div>
            <div className="contact-bottom">
              <a href={`tel:${contact.phone}`}>
                <Phone size={20} />
                {contact.displayPhone}
              </a>
              <a href={`mailto:${contact.email}`} className="contact-email">
                {contact.email}
                <ArrowUpRight size={19} />
              </a>
              <a
                href={contact.maps}
                target="_blank"
                rel="noreferrer"
                className="contact-address"
              >
                Strada Violetelor, Sector 6, București{" "}
                <ArrowUpRight size={19} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <Brand footer />
              <p>
                Pasiune pentru mașini.
                <br />
                Obsesie pentru detalii.
              </p>
            </div>
            <div className="footer-links">
              <span>EXPLOREAZĂ</span>
              {navItems.map((item) => (
                <a href={`#${item.id}`} key={item.id}>
                  {item.name}
                </a>
              ))}
            </div>
            <div className="footer-links">
              <span>NE GĂSEȘTI ȘI AICI</span>
              <a href={contact.instagram} target="_blank" rel="noreferrer">
                Instagram <ArrowUpRight size={14} />
              </a>
              <a
                href="https://www.facebook.com/DetailingManiacs/"
                target="_blank"
                rel="noreferrer"
              >
                Facebook <ArrowUpRight size={14} />
              </a>
              <a href={contact.maps} target="_blank" rel="noreferrer">
                Google Maps <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="footer-note">
              <Clock3 size={21} />
              <p>
                O lucrare bună începe
                <br />
                cu o discuție bună.
              </p>
              <button className="text-link" onClick={() => openBooking()}>
                Hai să vorbim <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
          <div className="footer-wordmark" aria-hidden="true">
            DETAILING MANIACS<span>↗</span>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} Detailing Maniacs Experts SRL
            </span>
            <span className="concept-note">
              Concept de redesign · Site demonstrativ
            </span>
            <a
              href="https://www.detailingmaniacs.ro/politica-de-confidentialitate-gdpr/"
              target="_blank"
              rel="noreferrer"
            >
              Confidențialitate <ArrowUpRight size={12} />
            </a>
            <a href="#acasa" className="back-top">
              Înapoi sus <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </footer>

      <a
        className="floating-whatsapp"
        href={whatsAppLink(
          "Bună! Aș dori mai multe detalii despre serviciile Detailing Maniacs.",
        )}
        target="_blank"
        rel="noreferrer"
        aria-label="Discută cu noi pe WhatsApp"
      >
        <MessageCircle size={25} />
        <span>Hai să vorbim</span>
      </a>

      {menuOpen && (
        <Modal
          title="Navigare"
          onClose={() => setMenuOpen(false)}
          className="mobile-menu"
        >
          <Brand />
          <nav aria-label="Navigare mobilă">
            {navItems.map((item, index) => (
              <a
                href={`#${item.id}`}
                key={item.id}
                onClick={() => setMenuOpen(false)}
              >
                <span>0{index + 1}</span>
                {item.name}
                <ArrowUpRight size={25} />
              </a>
            ))}
          </nav>
          <button
            className="button button-accent full-width"
            onClick={() => openBooking()}
          >
            Programează-te <ArrowUpRight size={18} />
          </button>
          <a className="mobile-phone" href={`tel:${contact.phone}`}>
            <Phone size={17} />
            {contact.displayPhone}
          </a>
        </Modal>
      )}
      {booking && (
        <Booking initialSelection={booking} onClose={() => setBooking(null)} />
      )}
      {service && (
        <ServiceModal
          service={service}
          onClose={() => setService(null)}
          onBook={openBooking}
          onPackages={openPackages}
        />
      )}
      {videoOpen && (
        <Modal
          title="În atelierul Detailing Maniacs"
          className="video-modal"
          onClose={() => setVideoOpen(false)}
        >
          <div className="video-modal-title">
            <SectionLabel>DIN ATELIERUL NOSTRU</SectionLabel>
            <h2>PASIUNEA, ÎN ACȚIUNE.</h2>
          </div>
          <video
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={asset("workshop.webp")}
          >
            <source
              src={`${import.meta.env.BASE_URL}atelier.mp4`}
              type="video/mp4"
            />
            Browserul tău nu poate reda acest video.
          </video>
          <p>Imagini din atelierul Detailing Maniacs, București.</p>
        </Modal>
      )}
      {galleryIndex !== null && (
        <Modal
          title={`Proiect: ${projects[galleryIndex].name}`}
          className="gallery-modal"
          onClose={() => setGalleryIndex(null)}
        >
          <div className="gallery-stage">
            <img
              src={asset(projects[galleryIndex].image)}
              alt={projects[galleryIndex].name}
            />
            <button
              className="gallery-prev icon-button"
              onClick={() =>
                setGalleryIndex(
                  (galleryIndex - 1 + projects.length) % projects.length,
                )
              }
              aria-label="Proiectul anterior"
            >
              <ChevronLeft />
            </button>
            <button
              className="gallery-next icon-button"
              onClick={() =>
                setGalleryIndex((galleryIndex + 1) % projects.length)
              }
              aria-label="Proiectul următor"
            >
              <ChevronRight />
            </button>
          </div>
          <div className="gallery-info" aria-live="polite">
            <div>
              <span className="small-label">{projects[galleryIndex].type}</span>
              <h2>{projects[galleryIndex].name}</h2>
              <p>{projects[galleryIndex].description}</p>
            </div>
            <span className="gallery-count">
              0{galleryIndex + 1} / 0{projects.length}
            </span>
          </div>
        </Modal>
      )}
    </>
  );
}

export default App;
