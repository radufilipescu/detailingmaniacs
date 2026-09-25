import { useEffect, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  Minus,
  Plus,
} from "lucide-react";
import { carSizes, services, type ServiceId } from "./data";
import {
  includedFeatures,
  packageCatalog,
  packagePrice,
  type BookingSelection,
} from "./packages";

const money = (value: number) => new Intl.NumberFormat("ro-RO").format(value);
const packageServices = services.filter(
  (service) => packageCatalog[service.id],
);

export default function PackageExplorer({
  serviceId,
  onServiceChange,
  onBook,
}: {
  serviceId: ServiceId;
  onServiceChange: (id: ServiceId) => void;
  onBook: (selection: BookingSelection) => void;
}) {
  const [size, setSize] = useState(0);
  const [compare, setCompare] = useState(false);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const service = services.find((item) => item.id === serviceId)!;
  const catalog = packageCatalog[serviceId]!;
  const extras = (catalog.addons ?? []).filter((addon) =>
    addonIds.includes(addon.id),
  );

  useEffect(() => {
    setCompare(false);
    setAddonIds([]);
  }, [serviceId]);

  return (
    <section
      className="packages section-space"
      id="pachete"
      aria-labelledby="packages-heading"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="section-label">
              <span />
              02 / PACHETE & TARIFE
            </p>
            <h2 id="packages-heading" tabIndex={-1}>
              PACHETUL TĂU.
              <br />
              <span className="text-muted">TOATE DETALIILE.</span>
            </h2>
          </div>
          <p>
            Compară serviciile incluse și prețurile pentru mașina ta. Apoi alege
            pachetul potrivit.
          </p>
        </div>
        <div
          className="package-service-tabs"
          role="group"
          aria-label="Tipul pachetelor"
        >
          {packageServices.map((item) => (
            <button
              key={item.id}
              aria-pressed={serviceId === item.id}
              className={serviceId === item.id ? "selected" : ""}
              onClick={() => onServiceChange(item.id)}
            >
              {packageCatalog[item.id]!.title}
              <span>
                {packageCatalog[item.id]!.packages.length.toString().padStart(
                  2,
                  "0",
                )}
              </span>
            </button>
          ))}
        </div>
        <div className="package-context">
          <div className="package-context-copy">
            <h3>{service.name}</h3>
            <p>{service.details}</p>
          </div>
          {catalog.vehicleSized !== false ? (
            <fieldset className="car-fieldset package-size-selector">
              <legend>Clasa autoturismului</legend>
              <div className="car-options">
                {carSizes.map((car, index) => (
                  <label
                    key={car.name}
                    className={size === index ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name="package-size"
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
          ) : (
            <p className="course-format-note">
              Două formate de pregătire.
              <br />
              <strong>Același accent pe practică.</strong>
            </p>
          )}
        </div>
        <div
          className="package-grid"
          style={
            { "--package-count": catalog.packages.length } as CSSProperties
          }
        >
          {catalog.packages.map((item, index) => {
            const features = includedFeatures(catalog, item.id);
            const price = packagePrice(item, size);
            const packageExtras = extras.filter(
              (addon) => !addon.includedIn?.includes(item.id),
            );
            const extrasPrice = packageExtras.reduce(
              (total, addon) => total + addon.price,
              0,
            );
            return (
              <article
                className="package-card"
                key={item.id}
                aria-labelledby={`${item.id}-heading`}
              >
                <div className="package-card-top">
                  <span className="package-level">
                    /{(index + 1).toString().padStart(2, "0")}
                  </span>
                  {item.discountPercent ? (
                    <span className="package-discount">
                      −{item.discountPercent}%
                    </span>
                  ) : (
                    <span className="package-class">
                      {catalog.vehicleSized === false
                        ? "PRACTICĂ ÎN ATELIER"
                        : carSizes[size].name}
                    </span>
                  )}
                </div>
                <h3 id={`${item.id}-heading`}>{item.name}</h3>
                <p className="package-subtitle">{item.subtitle}</p>
                <div className="package-price" aria-live="polite">
                  {item.discountPercent ? (
                    <del aria-label="Preț înainte de reducere">
                      {money(item.prices[size])} lei
                    </del>
                  ) : (
                    <span className="package-price-label">TARIF PACHET</span>
                  )}
                  <strong>
                    {money(price)}
                    <span>lei + TVA</span>
                  </strong>
                </div>
                <ul className="package-highlights">
                  {item.highlights.map((feature) => (
                    <li key={feature}>
                      <Check size={15} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <details className="package-details">
                  <summary>
                    Toate serviciile incluse{" "}
                    <span>{features.length.toString().padStart(2, "0")}</span>
                    <ChevronDown size={15} />
                  </summary>
                  <ul>
                    {features.map((feature) => (
                      <li key={feature.label}>
                        <Check size={13} />
                        {feature.label}
                      </li>
                    ))}
                  </ul>
                </details>
                <button
                  className="button package-choose"
                  aria-label={`Alege ${item.name}`}
                  onClick={() =>
                    onBook({
                      serviceId,
                      packageId: item.id,
                      size,
                      addonIds: packageExtras.map((addon) => addon.id),
                    })
                  }
                >
                  Alege pachetul
                  <ArrowUpRight size={17} />
                </button>
                {extrasPrice > 0 && (
                  <p className="package-extras-total">
                    Cu opțiunile selectate:{" "}
                    <strong>{money(price + extrasPrice)} lei + TVA</strong>
                  </p>
                )}
              </article>
            );
          })}
        </div>
        <div className="package-comparison-bar">
          <button
            className="text-link"
            aria-expanded={compare}
            aria-controls="package-comparison"
            onClick={() => setCompare(!compare)}
          >
            {compare ? "Ascunde comparația" : "Compară toate serviciile"}
            {compare ? <Minus size={18} /> : <Plus size={18} />}
          </button>
          <p>Toate prețurile sunt în lei, fără TVA.</p>
        </div>
        {compare && (
          <div
            id="package-comparison"
            className="package-comparison"
            role="region"
            aria-label={`Comparație pachete ${service.name}`}
            tabIndex={0}
          >
            <p className="comparison-scroll-hint">
              <ArrowDown size={14} /> Pe mobil, glisează tabelul pentru a vedea
              toate pachetele.
            </p>
            <table>
              <caption className="sr-only">
                Servicii incluse în pachetele {service.name}
                {catalog.vehicleSized !== false
                  ? `, clasa ${carSizes[size].name}`
                  : ""}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Servicii incluse</th>
                  {catalog.packages.map((item) => (
                    <th scope="col" key={item.id}>
                      {item.name}
                      <small>{money(packagePrice(item, size))} lei + TVA</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {catalog.features.map((feature) => (
                  <tr key={feature.label}>
                    <th scope="row">{feature.label}</th>
                    {catalog.packages.map((item, index) => (
                      <td key={item.id}>
                        {feature.levels.includes(index + 1) ? (
                          <>
                            <Check size={17} aria-hidden="true" />
                            <span className="sr-only">Inclus</span>
                          </>
                        ) : (
                          <>
                            <Minus size={15} aria-hidden="true" />
                            <span className="sr-only">Nu este inclus</span>
                          </>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {catalog.addons && (
          <div className="package-addons">
            <div>
              <span className="section-label">
                <span />
                COMPLETEAZĂ PACHETUL
              </span>
              <h3>Opțiuni suplimentare</h3>
              <p>Adaugă ce îți dorești în cererea de programare.</p>
            </div>
            <div className="addon-grid">
              {catalog.addons.map((addon) => (
                <label
                  key={addon.id}
                  className={addonIds.includes(addon.id) ? "selected" : ""}
                >
                  <input
                    type="checkbox"
                    checked={addonIds.includes(addon.id)}
                    onChange={(event) =>
                      setAddonIds(
                        event.target.checked
                          ? [...addonIds, addon.id]
                          : addonIds.filter((id) => id !== addon.id),
                      )
                    }
                  />
                  <span>
                    <strong>{addon.name}</strong>
                    {addon.details && <small>{addon.details}</small>}
                    <b>+{money(addon.price)} lei + TVA</b>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
        <div className="package-source-note">
          <p>
            {catalog.note && (
              <>
                {catalog.note}
                <br />
              </>
            )}
            Oferta finală și promoțiile se confirmă la programare, după
            evaluare.
          </p>
          <a href={catalog.source} target="_blank" rel="noreferrer">
            Detalii pe site-ul original <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
