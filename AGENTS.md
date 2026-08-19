# rakuhn – Projektübersicht

Webseite für **rakuhn by Ina Kuhn** – handgemachte Babymode und Geburtsgeschenke aus Kaiserslautern.

## Tech-Stack

- **Static Site Generator:** [Eleventy (11ty)](https://www.11ty.dev/) v3.1.2
- **Templating:** Nunjucks (`.njk`)
- **CSS:** Eigenes Stylesheet (`src/assets/css/style.css`)
- **JavaScript:** Vanilla JS (`src/assets/js/main.js`)
- **Schriftarten:** DM Sans + Fraunces (lokal eingebunden als `.woff2`)
- **Kontaktformular:** [Static Forms](https://www.staticforms.xyz/) (API-Key in `contact.njk`)
- **Bildoptimierung:** `sharp` (devDependency) – Skript `scripts/optimize-images.js`

## Befehle

```bash
npm start               # Dev-Server starten (mit Live-Reload)
npm run build           # Produktions-Build erstellen → _site/
npm run optimize-images # Alle JPEG/PNG → WebP konvertieren (einmalig bei neuen Bildern)
```

## Projektstruktur

```
src/
├── index.njk                  # Homepage (alle Sections eingebunden)
├── impressum.njk              # Impressum-Seite (/impressum/)
├── agb.njk                    # AGB-Seite (/agb/)
├── versand.njk                # Versand & Rückgabe (/versand/)
├── faq.njk                    # FAQ-Seite (/faq/)
├── datenschutz.njk            # Datenschutzerklärung (/datenschutz/)
├── ueber-mich.njk             # Erweiterte Über-mich-Seite (/ueber-mich/)
├── products/                  # Produktdetailseiten (Markdown)
│   ├── halstuecher.md         # order: 1
│   ├── hosen.md               # order: 2 (Pumphosen)
│   ├── haarbaender.md         # order: 3
│   ├── stickerei.md           # order: 4
│   └── windeltaschen.md       # order: 5
├── gifts/                     # Geschenkset-Detailseiten (Markdown)
│   ├── geschenkset-geburt.md  # order: 1
│   ├── geschenkset-weihnachten.md # order: 2
│   └── gutschein.md           # order: 3 (enthält Gutscheinbedingungen)
├── testimonials/              # Kundenbewertungen (Markdown, Tag: testimonial)
├── _data/
│   ├── products.js            # Liest Bilder aus assets/img/products/ automatisch ein
│   └── gifts.js               # Liest Bilder aus assets/img/gifts/ automatisch ein
├── _includes/
│   ├── layouts/
│   │   ├── base.njk           # Basis-Layout (HTML-Rahmen, Header, Footer)
│   │   ├── product-detail.njk # Layout für Produktseiten (FAB-Button, Galerie)
│   │   └── gift-detail.njk    # Layout für Geschenkset-Seiten
│   └── sections/
│       ├── header.njk         # Navigation mit intelligentem Zurück-Pfeil
│       ├── hero.njk
│       ├── about.njk          # Redesignt: Foto + Features + Schritte
│       ├── products.njk       # Produktkacheln (collections.products)
│       ├── gifts.njk          # Geschenkset-Kacheln (collections.gifts)
│       ├── testimonials.njk
│       ├── contact.njk        # Kontaktformular (Static Forms)
│       └── footer.njk         # Social-Links mit Icons, alle Footer-Links aktiv
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── fonts/                 # DM Sans + Fraunces (.woff2)
    └── img/
        ├── ina-kuhn.webp      # Foto von Ina Kuhn (About-Section)
        ├── products/          # Unterordner = Slug der Produktseite (alles .webp)
        └── gifts/             # Unterordner = Slug der Geschenksetseite (alles .webp)
scripts/
└── optimize-images.js         # Bildoptimierungs-Skript (JPEG/PNG → WebP)
_site/                         # Build-Output (gitignored)
```

## Datenmodell: Collections

Eleventy-Collections werden in `.eleventy.js` definiert und nach `order` sortiert:

| Collection | Tag | Quelle |
|---|---|---|
| `products` | `product` | `src/products/*.md` |
| `gifts` | `gift` | `src/gifts/*.md` |
| `testimonials` | `testimonial` | `src/testimonials/*.md` |

Jedes Produkt/Gift-Markdown hat folgende Frontmatter-Felder:
- `name` – Anzeigename
- `layout` – z. B. `layouts/product-detail.njk`
- `price` – Preis als String (z. B. `10,00 €`)
- `icon` – Pfad zum Vorschaubild (.webp) für die Kachelansicht
- `order` – Sortierreihenfolge (Pflichtfeld!)
- `tags` – `[product]` oder `[gift]`

## Bildgalerien auf Detailseiten

- `_data/products.js` liest alle Bilder aus `src/assets/img/products/<slug>/` ein → `products[fileSlug]`
- `_data/gifts.js` liest analog aus `src/assets/img/gifts/<slug>/` → `gifts[fileSlug]`
- Neue Bilder einfach als `.webp` in den Unterordner legen – kein weiterer Code nötig
- Akzeptierte Formate im Filter: `.jpg|jpeg|png|webp|JPG` (case-insensitive)

## Bilder im Beschreibungstext

In den `.md`-Dateien können Bilder per HTML eingebunden werden (funktioniert wegen `{{ content | safe }}`):

```html
<div class="description-img-row">
  <img class="description-img" src="/assets/img/products/slug/bild.webp" alt="...">
  <img class="description-img" src="/assets/img/products/slug/bild2.webp" alt="...">
</div>
```

`.description-img-row` = Flex-Container (2 Bilder nebeneinander, auf Mobil untereinander).

## Bildoptimierung

- Alle Bilder liegen als `.webp` vor (JPEG/PNG wurden konvertiert)
- Skript: `npm run optimize-images` → konvertiert neue JPEG/PNG zu WebP, aktualisiert Referenzen, löscht Originale
- `.rotate()` ist aktiv: EXIF-Ausrichtung von Smartphone-Fotos wird korrekt angewendet
- Kompression: max. 1600 px Breite, Qualität 82 → typische Ersparnis 90–97 %

## Navigation & Zurück-Button

Der Zurück-Pfeil im Header (`header.njk`) ist kontextabhängig:

| Unterseite | Ziel |
|---|---|
| `/products/...` | `/#kategorien` |
| `/gifts/...` | `/#geschenke` |
| `/ueber-mich/` | `/#ueber-mich` |
| Alle anderen | `/` |

## Floating Action Button (Produktseiten)

`product-detail.njk` enthält einen runden grünen FAB-Button (Warenkorb-Icon) rechts an der Seite. Klick → speichert Produktname + Preis in `sessionStorage` → navigiert zu `/#kontakt-formular` → `main.js` liest SessionStorage beim Laden und füllt das Formular automatisch vor.

## Kontaktformular

- Formular-Submit → Fetch an `https://api.staticforms.xyz/submit`
- Bei Erfolg: Modal anzeigen, Formular leeren
- `onClickProduct(name, price)` in `main.js` – füllt Betreff/Nachricht vor, scrollt zum Formular
- SessionStorage-Prefill: wird gesetzt von Produkt-Unterseiten, ausgelesen in DOMContentLoaded

## JavaScript (main.js)

- Burger-Menü (öffnen/schließen)
- IntersectionObserver für Scroll-Animationen auf Karten
- `onClickProduct(name, price)` – Formular vorausfüllen + scrollen
- SessionStorage-Handler für Produktseiten-Navigation
- Kontaktformular-Submit (async)
- Modal schließen

## CSS-Klassen (wichtige eigene)

| Klasse | Verwendung |
|---|---|
| `.legal-block` | Inhaltskarten auf allen Rechtsseiten (grüner linker Rand) |
| `.legal-wrapper` | Max-width-Container für Rechtsseiten |
| `.legal-faq-q` | Fett gedruckte FAQ-Frage |
| `.description-img` / `.description-img-row` | Bilder im Produktbeschreibungstext |
| `.about-full` | Element in about-section, das beide Grid-Spalten überspannt |
| `.about-photo` | Foto-Container in About-Section |
| `.about-features` | 3-spaltige Feature-Card-Grid |
| `.about-steps` | Nummerierte Schritte-Grid (01–05) |
| `.nav-left` | Wrapper für Logo + Zurück-Pfeil |
| `.nav-back-arrow` | Runder Zurück-Pfeil neben Logo |
| `.product-fab` / `.product-fab__order` | Runder FAB-Button auf Produktseiten |
| `.footer-social-link` | Icon + Text nebeneinander im Footer |

## Unterseiten (Rechtliches)

Alle Rechtsseiten nutzen `layout: layouts/base.njk` mit `.legal-wrapper` und `.legal-block`-Klassen:

| URL | Datei | Inhalt |
|---|---|---|
| `/impressum/` | `src/impressum.njk` | § 5 TMG, Kontakt, Haftung |
| `/agb/` | `src/agb.njk` | 9 Paragraphen, inkl. § 312g Widerrufsausschluss |
| `/versand/` | `src/versand.njk` | Deutsche Post/DHL, Lieferzeiten, Widerrufsbelehrung |
| `/faq/` | `src/faq.njk` | Bestellung, Größen, Zahlung, Stickerei |
| `/datenschutz/` | `src/datenschutz.njk` | DSGVO-konform, Static Forms, sessionStorage, Aufsichtsbehörde RLP |
| `/ueber-mich/` | `src/ueber-mich.njk` | Näh-Geschichte + rakuhn-Namensgeschichte |

## Bekannte Details

- Ausgabe-Ordner `_site/` ist gitignored
- Alle Bilder als `.webp` (konvertiert mit sharp + `.rotate()`)
- Sprache: Deutsch (`lang="de"`)
- Inhaberin: Ina Kuhn, Kaiserslautern
- Kontakt: ina-kuhn@outlook.de, +49 159 05 31 52 61
- Social: instagram.com/rakuhn.by.ina.kuhn, facebook.com/rakuhn.by.ina.kuhn
- Gutschein: Gutscheinbedingungen sind in `gutschein.md` direkt eingebettet
- Neue `.eleventy.js`-Regel nötig, wenn neue Dev-Server-Seiten nicht erkannt werden: Neustart
