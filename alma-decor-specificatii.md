# Alma Decor — Specificații Complete de Proiect

## Transformare din One-Page SPA în Magazin Online Multipage

---

## 1. Situația actuală

| Element | Detalii |
|---------|---------|
| **Domeniu** | almadecor.ro |
| **Stack** | React + TypeScript + Vite + Tailwind CSS |
| **Hosting** | cPanel (build local → dist/ → server) |
| **Tip site** | Single Page Application (one-page scroll) |
| **Componente** | 17 componente React (Header, Hero, Showroom, AboutUs, Process, Products, Portfolio, WhyChooseUs, Collaborate, Testimonials, Partners, FAQ, Contact, Footer, FloatingButtons, CookieConsent, ThemeToggleButton) |
| **Design** | Font Inter, culori: #FFCC00 (brand-yellow), #2C3E50 (brand-dark), dark mode funcțional |
| **Contact** | Formular via Web3Forms (API extern) |

---

## 2. Obiective transformare

Transformarea site-ului din one-page static într-un **magazin online multipage** complet funcțional, cu:

- Navigare multipage (React Router)
- Magazin online cu catalog, filtre, coș, comenzi
- Secțiune blog cu articole și categorii
- Import produse din feeduri furnizori
- SEO on-page complet
- Panou admin pentru gestionare completă
- Integrare pixeli marketing (GA, Facebook, Google Ads, etc.)

---

## 3. Structura noului site

### 3.1 Pagini publice

| Pagina | URL | Conținut |
|--------|-----|----------|
| **Acasă** | `/` | Hero + secțiuni cheie (Showroom, AboutUs, WhyChooseUs, Process, Testimonials, Partners, FAQ — selectiv) |
| **Magazin** | `/magazin` | Catalog produse cu categorii, filtre, sortare, paginare |
| **Categorie** | `/magazin/:categorie` | Produse filtrate pe categorie |
| **Produs** | `/produs/:slug` | Pagina individuală de produs (detalii complete) |
| **Coș** | `/cos` | Coș de cumpărături cu sumar și cantități |
| **Finalizare comandă** | `/comanda` | Formular comandă (date livrare, metodă plată) |
| **Confirmare** | `/comanda/confirmare/:id` | Confirmare comandă plasată |
| **Blog** | `/blog` | Lista articolelor cu categorii și paginare |
| **Articol** | `/blog/:slug` | Articol individual complet |
| **Despre noi** | `/despre-noi` | Conținut AboutUs + Portofoliu + Colaborare |
| **Contact** | `/contact` | Formular contact + hartă + date |
| **Pagini legale** | `/termeni`, `/confidentialitate`, `/cookies` | Pagini legale (existente deja ca modale) |
| **Înregistrare** | `/inregistrare` | Formular creare cont client |
| **Login** | `/login` | Autentificare client |
| **Contul meu** | `/contul-meu` | Dashboard client (istoric comenzi, adrese, wishlist, date personale) |
| **Resetare parolă** | `/resetare-parola` | Solicitare + formular resetare parolă |

### 3.2 Panou admin

| Pagina | URL | Funcționalitate |
|--------|-----|-----------------|
| **Login** | `/admin/login` | Autentificare admin |
| **Dashboard** | `/admin` | Sumar comenzi, produse, articole |
| **Produse** | `/admin/produse` | CRUD produse (adăugare, editare, ștergere) |
| **Import feed** | `/admin/import` | Upload feed furnizor (CSV/XML/JSON) |
| **Categorii** | `/admin/categorii` | Gestionare categorii și subcategorii |
| **Comenzi** | `/admin/comenzi` | Vizualizare și gestionare comenzi |
| **Blog** | `/admin/blog` | CRUD articole blog |
| **SEO** | `/admin/seo` | Meta tags, slug-uri per pagină |
| **Pixeli & Cod** | `/admin/pixeli` | Gestiune coduri tracking (GA, FB, Ads, etc.) |
| **Email Templates** | `/admin/emailuri` | Editare template-uri email (subiect, conținut HTML, variabile) |
| **Setări** | `/admin/setari` | Date firmă, email notificări, SMTP, monedă, taxe |

---

## 4. Funcționalități detaliate

### 4.1 Magazin online — Catalog

- Afișare produse cu grid responsive (2-4 coloane)
- Categorii și subcategorii (sidebar sau dropdown)
- **Filtre**: categorie, preț (range slider), culoare, disponibilitate, brand/furnizor
- **Sortare**: preț crescător/descrescător, cele mai noi, cele mai populare, alfabet
- **Paginare** (sau infinite scroll)
- **Căutare** produse (search bar cu autocomplete)
- Afișare badge-uri pe card produse (Promoție, Produsul zilei, Nou, etc.)

### 4.2 Pagina de produs — Detalii

#### Galerie imagini
- Galerie cu mai multe imagini (thumbnail-uri jos/stânga)
- **Zoom la hover** (lens zoom sau full-screen lightbox)
- **Suport video** (embed YouTube/Vimeo sau video uploadat)

#### Informații produs
- Nume produs, descriere scurtă, descriere completă (HTML/rich text)
- **Preț**: preț normal + preț redus (cu afișare discount %)
- **Variații**: culoare, mărime, material — fiecare cu stoc și preț propriu
- **Câmpuri personalizabile** (definite din admin): ex. „Grosime", „Clasa trafic", „Colecție"
- **Rating**: stele (medie calculată din review-uri)
- **Review-uri clienți**: formular cu nume, rating, text + afișare review-uri aprobate

#### Badge-uri și mesaje dinamice
- Badge-uri configurabile din admin: `Promoție`, `Produsul zilei`, `Nou`, `Best Seller`, `Exclusiv`
- Mesaje dinamice bazate pe stoc: „Ultimele X bucăți!", „În stoc", „La comandă", „Stoc epuizat"
- Mesaj „Transport gratuit" (configurabil din admin, ex: peste 500 lei)
- Countdown timer pentru promoții (opțional)

#### Acțiuni
- Selector cantitate
- Buton „Adaugă în coș"
- Buton „Adaugă la favorite" (wishlist)
- Produse similare / complementare (secțiune jos)

### 4.3 Coș de cumpărături

- Persistent (localStorage) — nu se pierde la refresh
- Afișare produse cu imagine, cantitate editabilă, preț
- Subtotal, discount (dacă e cazul), total
- Buton „Continuă cumpărăturile" + „Finalizează comanda"
- Mini-cart în header (icon cu număr produse)

### 4.4 Finalizare comandă

- **Formular date livrare**: nume, email, telefon, adresă completă, județ, localitate
- **Metodă plată**: Ramburs la livrare / Transfer bancar
- **Note comandă** (câmp opțional)
- **Sumar comandă** (produse, cantități, total)
- **Acceptare T&C** (checkbox obligatoriu)
- **Email confirmare** (trimis automat la client și admin)

### 4.5 Gestionare stoc

- Stoc real per produs și per variație
- Mesaje custom pe baza stocului:
  - Stoc > 10: „În stoc"
  - Stoc 1-10: „Ultimele X bucăți!"
  - Stoc = 0: „Stoc epuizat" sau „Disponibil la comandă" (configurabil)
- Scădere automată stoc la plasare comandă
- Alertă admin când stocul scade sub un prag (configurabil)

### 4.6 Import feeduri furnizori

- **Upload manual** din admin (fișier CSV, XML sau JSON)
- **Mapare câmpuri**: interfață unde asociezi coloanele din feed cu câmpurile din baza de date (nume, preț, descriere, categorie, imagine, SKU, etc.)
- **Reguli preț**: 
  - Preț furnizor + adaos procentual (configurabil per categorie sau global)
  - Preț manual per produs (override)
- **Opțiuni import**: 
  - Adaugă produse noi
  - Actualizează existente (match pe SKU)
  - Dezactivează produse care nu mai sunt în feed
- **Auto-generare SKU**: Dacă produsul nu are cod (nici din feed, nici manual), sistemul generează automat unul în format `AD-XXXX-00001` unde `XXXX` e prefix categorie (ex: `AD-PARC-00001` pentru parchet, `AD-TAPE-00023` pentru tapet). Numărul se incrementează automat.
- **Preview** înainte de import (primele 10 rânduri)
- **Log import** (câte produse adăugate/actualizate/erori)

### 4.7 Blog

- Lista articole cu imagine, titlu, excerpt, dată, categorie
- Pagina articol cu conținut HTML/rich text
- Categorii blog
- Articole recente (sidebar sau secțiune)
- Share pe social media
- SEO complet per articol (meta, schema Article, slug personalizat)

### 4.8 Conturi clienți (opțional la comandă)

Clienții pot plasa comenzi ca vizitatori (guest) SAU își pot crea cont pentru funcționalități extra.

#### Înregistrare / Login
- Formular înregistrare: nume, email, telefon, parolă
- Login cu email + parolă
- Resetare parolă via email
- Opțiune „Creează-ți cont" în pagina de checkout (checkbox, nu obligatoriu)

#### Panoul clientului (`/contul-meu`)
- **Istoric comenzi**: lista tuturor comenzilor cu status, dată, total + detalii per comandă
- **Urmărire status comandă**: status vizual (Nouă → Confirmată → În livrare → Livrată)
- **Adrese salvate**: adrese de livrare salvate, cu posibilitate de a seta una implicită
- **Wishlist / Favorite**: lista produselor salvate, cu buton „Adaugă în coș"
- **Datele mele**: editare nume, email, telefon, parolă
- **Delogare**

#### Integrare cu checkout
- Dacă clientul e logat, datele de livrare se precompletează din contul său
- Comanda se asociază automat cu contul
- Dacă e guest, primește opțiunea de a-și crea cont după plasarea comenzii

### 4.9 Sistem de emailuri automate

#### Emailuri trimise

| Email | Destinatar | Declanșator |
|-------|-----------|-------------|
| **Confirmare comandă** | Client | La plasarea comenzii |
| **Notificare comandă nouă** | Admin | La plasarea comenzii |
| **Schimbare status comandă** | Client | Când adminul schimbă statusul (confirmată, în livrare, livrată, anulată) |
| **Review nou primit** | Admin | Când un client lasă un review |
| **Mesaj contact nou** | Admin | Când cineva completează formularul de contact |
| **Bun venit** | Client | La crearea contului |
| **Resetare parolă** | Client | Când solicită reset parolă |

#### Template-uri HTML editabile din admin

Fiecare tip de email are un template HTML branded (cu logo Alma Decor, culorile brand-ului, footer cu date contact). Adminul poate edita din panou:

- **Subiectul** emailului
- **Conținutul** (editor HTML simplu)
- **Variabile dinamice** disponibile per template (ex: `{{nume_client}}`, `{{numar_comanda}}`, `{{status_comanda}}`, `{{lista_produse}}`, `{{total}}`, `{{link_comanda}}`)

Tabelul `email_templates` stochează template-urile cu un `template_key` fix (ex: `order_confirmation`, `order_status_change`, `welcome`, etc.) și conținutul HTML editabil.

#### Recomandare trimitere email

**SMTP prin cPanel** este cea mai bună opțiune:
- Pe cPanel, creezi un cont de email (ex: `comenzi@almadecor.ro`) din secțiunea „Email Accounts"
- PHP-ul trimite prin SMTP autentificat cu acel cont
- Emailurile ajung în Inbox (nu în Spam), pentru că vin de pe domeniul propriu cu autentificare
- Configurezi SPF, DKIM și DMARC din cPanel pentru deliverability maximă
- Alternativa `mail()` nativă funcționează dar are risc mare de spam

---

## 5. SEO On-Page

### 5.1 Meta tags per pagină

Fiecare pagină (produs, articol, categorie, pagină statică) va avea câmpuri editabile din admin:

- `<title>` — Meta title
- `<meta name="description">` — Meta description
- `<link rel="canonical">` — URL canonic
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags

### 5.2 URL-uri personalizate (slug-uri)

- Produse: `/produs/parchet-stejar-natur-120mm`
- Categorii: `/magazin/parchet`
- Articole: `/blog/cum-alegi-parchetul-potrivit`
- Slug generat automat din titlu, editabil manual din admin

### 5.3 Schema.org (JSON-LD)

| Tip pagină | Schema |
|-----------|--------|
| Acasă | `HomeAndConstructionBusiness` (existent, extins) |
| Produs | `Product` (name, image, price, availability, review, aggregateRating, brand, sku) |
| Articol blog | `Article` / `BlogPosting` (headline, author, datePublished, image) |
| Categorie | `CollectionPage` + `ItemList` |
| FAQ | `FAQPage` (existent) |
| Contact | `ContactPage` |
| Breadcrumbs | `BreadcrumbList` (pe toate paginile) |

### 5.4 Sitemap.xml

- Generat automat (script PHP care include toate paginile, produsele și articolele active)
- Actualizat la fiecare adăugare/modificare de produs sau articol
- Include `<lastmod>`, `<changefreq>`, `<priority>`

### 5.5 Alte elemente SEO

- Breadcrumbs vizuale pe toate paginile
- Tag-uri H1-H6 corecte
- Alt text obligatoriu pe imagini
- URL-uri curate (fără parametri query unde posibil)
- Robots.txt actualizat
- Hreflang (dacă va fi necesar pe viitor)

---

## 6. Pixeli și tracking

### Recomandare: Panou admin cu „Script Manager"

Un câmp simplu în admin unde adaugi snippet-uri de cod care se injectează automat în `<head>` sau `<body>`. Avantaje:

- Nu trebuie să modifici codul pentru fiecare pixel nou
- Poți adăuga/elimina trackere fără deploy
- Suporți orice platformă (GA4, Facebook Pixel, Google Ads, TikTok, Pinterest, Hotjar, etc.)

#### Implementare

Tabel `scripts` în baza de date:

| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT | ID unic |
| name | VARCHAR | Numele scriptului (ex: „Google Analytics 4") |
| code | TEXT | Codul complet `<script>...</script>` |
| position | ENUM | `head` sau `body_end` |
| is_active | BOOLEAN | Activ/inactiv |
| pages | VARCHAR | Pe ce pagini se încarcă: `all`, `home`, `product`, `checkout`, etc. |

Din admin: un simplu formular cu câmp de text și dropdown pentru poziție. Toggle on/off per script.

---

## 7. Arhitectură tehnică — PHP Hybrid (SEO-first)

### 7.1 Principiul de funcționare

**Problema**: Un SPA React clasic trimite un `<div id="root"></div>` gol. Crawlerele (Google, Bing, Facebook, etc.) văd o pagină goală → SEO inexistent.

**Soluția PHP Hybrid**: PHP-ul este „prima linie" — generează HTML complet cu tot conținutul, meta tags, Schema.org, pentru fiecare pagină. React se încarcă apoi în browser și preia controlul pentru interactivitate (hydration).

**Fluxul unei cereri:**

1. Vizitatorul/crawlerul accesează `/produs/parchet-stejar-natur`
2. Apache (`.htaccess`) trimite cererea la `index.php` (router PHP)
3. PHP-ul:
   - Detectează ruta (`/produs/:slug`)
   - Citește produsul din MySQL
   - Generează HTML complet: `<head>` cu meta tags + Schema.org + pixeli tracking, `<body>` cu tot conținutul vizibil (titlu, descriere, preț, imagini, review-uri)
   - Include la final `<script>` cu bundle-ul React + datele inițiale ca JSON
4. **Crawlerul**: primește HTML complet, indexează tot, pleacă fericit
5. **Vizitatorul**: browserul încarcă React, care face „hydration" — se atașează la HTML-ul existent și adaugă interactivitate (coș, filtre, galerie zoom, dark mode)

### 7.2 Structura fișiere pe server

```
public_html/
├── index.php                 # Router principal PHP (primește TOATE cererile)
├── .htaccess                 # Redirecționare totul spre index.php
│
├── app/                      # Logica PHP (nu accesibil direct din web)
│   ├── config.php            # Conexiune DB, constante, SMTP
│   ├── router.php            # Mapare URL → controller
│   ├── controllers/          # Logica per pagină
│   │   ├── HomeController.php
│   │   ├── ShopController.php
│   │   ├── ProductController.php
│   │   ├── CartController.php
│   │   ├── CheckoutController.php
│   │   ├── BlogController.php
│   │   ├── ArticleController.php
│   │   ├── AboutController.php
│   │   ├── ContactController.php
│   │   ├── AccountController.php
│   │   └── AuthController.php
│   ├── models/               # Acces baza de date
│   │   ├── Product.php
│   │   ├── Category.php
│   │   ├── Order.php
│   │   ├── Article.php
│   │   ├── Review.php
│   │   ├── Client.php
│   │   └── Settings.php
│   ├── views/                # Template-uri PHP (generează HTML)
│   │   ├── layout.php        # Layout comun: <head>, header, footer, scripts
│   │   ├── home.php
│   │   ├── shop.php
│   │   ├── product.php
│   │   ├── cart.php
│   │   ├── checkout.php
│   │   ├── blog.php
│   │   ├── article.php
│   │   ├── about.php
│   │   ├── contact.php
│   │   ├── account/
│   │   └── partials/         # Fragmente reutilizabile
│   │       ├── seo-head.php      # Meta tags, OG, Schema.org
│   │       ├── tracking-scripts.php  # Pixeli din DB
│   │       ├── breadcrumbs.php
│   │       ├── product-card.php
│   │       └── article-card.php
│   └── helpers/              # Funcții utilitare
│       ├── seo.php           # Generare meta tags + Schema.org
│       ├── mailer.php        # PHPMailer wrapper
│       └── utils.php         # Slug, formatare preț, etc.
│
├── api/                      # Endpoint-uri JSON (pentru React interactiv)
│   ├── config.php            # Conexiune DB (include din app/config.php)
│   ├── auth.php              # Autentificare admin (JWT)
│   ├── client-auth.php       # Login, register, reset parolă clienți
│   ├── client-account.php    # Profil, adrese, wishlist, istoric
│   ├── produse.php           # CRUD produse
│   ├── categorii.php         # CRUD categorii
│   ├── comenzi.php           # Plasare și gestionare comenzi
│   ├── blog.php              # CRUD articole
│   ├── reviews.php           # Review-uri produse
│   ├── import.php            # Import feeduri
│   ├── seo.php               # Meta tags per pagină
│   ├── scripts.php           # Gestiune pixeli/trackere
│   ├── email-templates.php   # CRUD template-uri email
│   ├── mailer.php            # Trimitere email via SMTP
│   ├── upload.php            # Upload imagini/video
│   ├── sitemap-generate.php  # Regenerare sitemap.xml
│   └── settings.php          # Setări generale
│
├── admin/                    # Panoul admin (SPA React separat)
│   ├── index.html            # React admin app
│   └── assets/               # JS/CSS admin
│
├── assets/                   # JS/CSS pentru site-ul public (din Vite build)
│   ├── app.js                # Bundle React (hydration)
│   ├── app.css               # Stiluri Tailwind compilate
│   └── ...
│
├── uploads/                  # Imagini uploadate
│   ├── products/
│   ├── blog/
│   └── feeds/
│
├── sitemap.xml               # Generat automat de PHP
└── robots.txt
```

### 7.3 Cum funcționează rutarea

**`.htaccess`** — totul trece prin `index.php`, cu excepția API-ului, admin-ului și fișierelor statice:

```apache
RewriteEngine On
RewriteBase /

# Exclude din routing: fișiere statice, api, admin, uploads
RewriteRule ^api/ - [L]
RewriteRule ^admin/ - [L]
RewriteRule ^uploads/ - [L]
RewriteRule ^assets/ - [L]
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Tot restul merge la index.php (router PHP)
RewriteRule ^(.*)$ index.php [QSA,L]
```

**`index.php`** — router simplu:

```php
// Detectează ruta
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Rutele publice
match(true) {
    $uri === '/'                    => (new HomeController)->render(),
    $uri === '/magazin'             => (new ShopController)->render(),
    str_starts_with($uri, '/magazin/') => (new ShopController)->renderCategory($slug),
    str_starts_with($uri, '/produs/')  => (new ProductController)->render($slug),
    $uri === '/cos'                 => (new CartController)->render(),
    $uri === '/comanda'             => (new CheckoutController)->render(),
    $uri === '/blog'                => (new BlogController)->render(),
    str_starts_with($uri, '/blog/')    => (new ArticleController)->render($slug),
    $uri === '/despre-noi'          => (new AboutController)->render(),
    $uri === '/contact'             => (new ContactController)->render(),
    // ... conturi, legal, etc.
    default                         => (new NotFoundController)->render(),
};
```

### 7.4 Exemplu: Ce servește PHP-ul pentru o pagină de produs

Când crawlerul accesează `/produs/parchet-stejar-natur-120mm`, PHP returnează:

```html
<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <title>Parchet Stejar Natur 120mm — Alma Decor</title>
    <meta name="description" content="Parchet din stejar natural, 120mm lățime...">
    <link rel="canonical" href="https://almadecor.ro/produs/parchet-stejar-natur-120mm">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Parchet Stejar Natur 120mm">
    <meta property="og:image" content="https://almadecor.ro/uploads/products/parchet-stejar.jpg">
    <meta property="og:type" content="product">
    
    <!-- Schema.org Product -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Parchet Stejar Natur 120mm",
        "image": "https://almadecor.ro/uploads/products/parchet-stejar.jpg",
        "description": "Parchet din stejar natural...",
        "sku": "AD-PARCH-00042",
        "brand": { "@type": "Brand", "name": "Alma Decor" },
        "offers": {
            "@type": "Offer",
            "price": "189.00",
            "priceCurrency": "RON",
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "23"
        }
    }
    </script>
    
    <!-- Pixeli tracking (din DB) -->
    <!-- Google Analytics -->
    <script>...</script>
    <!-- Facebook Pixel -->
    <script>...</script>
    
    <!-- CSS -->
    <link rel="stylesheet" href="/assets/app.css">
</head>
<body>
    <!-- CONȚINUT COMPLET HTML — vizibil pentru crawlere -->
    <header>
        <nav>
            <a href="/">Acasă</a> / <a href="/magazin">Magazin</a> / 
            <a href="/magazin/parchet">Parchet</a> / Parchet Stejar Natur 120mm
        </nav>
    </header>
    
    <main id="app">
        <h1>Parchet Stejar Natur 120mm</h1>
        <img src="/uploads/products/parchet-stejar.jpg" alt="Parchet Stejar Natur 120mm">
        <p class="price">189,00 RON</p>
        <p class="description">Parchet din stejar natural, 120mm lățime...</p>
        <div class="reviews">
            <p>Rating: 4.8/5 (23 recenzii)</p>
            <!-- Review-urile complete -->
        </div>
        <!-- Tot conținutul vizibil, complet, netrunchiat -->
    </main>
    
    <!-- Datele inițiale pentru React (evită re-fetch) -->
    <script>
        window.__INITIAL_DATA__ = {
            product: { id: 42, name: "Parchet Stejar Natur 120mm", ... },
            reviews: [...],
            relatedProducts: [...]
        };
    </script>
    
    <!-- React bundle — face hydration pe HTML-ul existent -->
    <script src="/assets/app.js" defer></script>
</body>
</html>
```

**Crawlerul** vede tot: titlu, descriere, preț, imagini, review-uri, schema, breadcrumbs.
**Vizitatorul** primește același HTML, apoi React adaugă: galerie cu zoom, coș, filtre, dark mode, animații.

### 7.5 Frontend (React — pentru interactivitate)

React nu mai renderizează toată pagina de la zero. În schimb:

- **Hydration**: se atașează la HTML-ul generat de PHP și îl face interactiv
- **Componente interactive**: galerie zoom, coș, filtre catalog, formular checkout, dark mode toggle
- **Navigare client-side**: după prima încărcare (PHP), navigarea între pagini poate fi client-side (fetch JSON de la API + render React) pentru viteză
- **Admin panel**: rămâne SPA React pur (nu are nevoie de SEO)

**Structura fișiere React (development):**

```
src/
├── components/          # Componente reutilizabile (existente + noi)
│   ├── layout/          # Header, Footer, Breadcrumbs (interactive)
│   ├── shop/            # ProductGallery, Filters, Cart, Checkout, VariationPicker
│   ├── blog/            # ShareButtons, CommentForm
│   ├── account/         # AccountNav, OrderStatus, AddressForm
│   ├── ui/              # Icon, AccordionItem, Modal, Rating, Badge, Gallery, ZoomImage
│   └── common/          # ThemeToggle, CookieConsent, FloatingButtons
├── contexts/            # ThemeContext, CartContext, CustomerAuthContext
├── hooks/               # useCart, useWishlist, useAuth
├── utils/               # api.ts, formatters.ts
├── hydrate.tsx          # Entry point — face hydration pe HTML-ul PHP
└── admin/               # SPA React separat pentru admin
    ├── App.tsx
    ├── pages/
    └── components/
```

**Workflow development:**
1. Lucrezi la componentele React local
2. `npm run build` → generează `assets/app.js` + `assets/app.css`
3. Urci `assets/` pe server (ca și înainte cu `dist/`)
4. Fișierele PHP le editezi direct pe server sau le urci separat

### 7.6 Admin Panel

Panoul admin rămâne un **SPA React complet** (nu are nevoie de SEO). Rulează din `/admin/index.html` și comunică cu `/api/` pentru toate operațiunile CRUD.

Paginile admin:

| Pagina | Funcționalitate |
|--------|-----------------|
| Dashboard | Sumar: comenzi noi, venituri, produse low stock, review-uri de aprobat |
| Produse | CRUD complet: imagini, variații, câmpuri custom, badge-uri, stoc, SEO |
| Import feed | Upload CSV/XML/JSON, mapare câmpuri, preview, reguli preț |
| Categorii | Arbore categorii cu subcategorii, reordonare drag-and-drop |
| Comenzi | Lista + detalii, schimbare status (cu email automat), export |
| Blog | CRUD articole, editor rich text, categorii, SEO per articol |
| Review-uri | Aprobare/respingere review-uri, răspuns admin |
| Clienți | Lista clienți, detalii cont, istoric comenzi |
| SEO | Meta tags per pagină statică, sitemap regenerate |
| Email Templates | Editare subiect + conținut HTML per tip email, preview |
| Pixeli & Scripts | Adăugare/editare/toggle snippet-uri tracking |
| Setări | Date firmă, email SMTP, prag transport gratuit, monedă |

### 7.3 Baza de date — Schema MySQL

#### Tabele principale:

**`categorii`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| parent_id | INT NULL | FK → categorii.id (subcategorii) |
| name | VARCHAR(255) | Nume categorie |
| slug | VARCHAR(255) UNIQUE | URL-friendly |
| description | TEXT | Descriere categorie |
| image | VARCHAR(500) | URL imagine |
| meta_title | VARCHAR(255) | SEO title |
| meta_description | TEXT | SEO description |
| sort_order | INT | Ordine afișare |
| is_active | BOOLEAN DEFAULT 1 | Activ/inactiv |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**`produse`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| category_id | INT | FK → categorii.id |
| sku | VARCHAR(100) UNIQUE | Cod intern/furnizor (auto-generat dacă lipsește, format: AD-CATEG-00001) |
| name | VARCHAR(255) | Nume produs |
| slug | VARCHAR(255) UNIQUE | URL slug |
| short_description | TEXT | Descriere scurtă |
| description | LONGTEXT | Descriere completă (HTML) |
| price | DECIMAL(10,2) | Preț normal |
| sale_price | DECIMAL(10,2) NULL | Preț redus |
| cost_price | DECIMAL(10,2) NULL | Preț furnizor (intern) |
| markup_percent | DECIMAL(5,2) NULL | Adaos procentual |
| stock | INT DEFAULT 0 | Cantitate stoc |
| stock_status | ENUM('in_stock','low_stock','out_of_stock','on_order') | Status stoc |
| low_stock_threshold | INT DEFAULT 5 | Prag alertă stoc |
| stock_message_custom | VARCHAR(255) NULL | Mesaj custom stoc |
| brand | VARCHAR(255) | Brand/furnizor |
| badge | VARCHAR(100) NULL | Badge: promo, nou, best_seller, produsul_zilei, exclusiv |
| badge_text | VARCHAR(100) NULL | Text custom badge |
| free_shipping | BOOLEAN DEFAULT 0 | Transport gratuit |
| free_shipping_note | VARCHAR(255) NULL | Mesaj transport |
| is_featured | BOOLEAN DEFAULT 0 | Produs recomandat |
| is_active | BOOLEAN DEFAULT 1 | Publicat/nepublicat |
| meta_title | VARCHAR(255) | SEO |
| meta_description | TEXT | SEO |
| schema_data | JSON NULL | Date extra Schema.org |
| views | INT DEFAULT 0 | Nr. vizualizări |
| sort_order | INT DEFAULT 0 | Ordine |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**`produs_imagini`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| product_id | INT | FK → produse.id |
| url | VARCHAR(500) | Cale imagine |
| alt_text | VARCHAR(255) | Alt text SEO |
| is_primary | BOOLEAN DEFAULT 0 | Imagine principală |
| is_video | BOOLEAN DEFAULT 0 | E video? |
| video_url | VARCHAR(500) NULL | URL embed video |
| sort_order | INT | Ordine |

**`produs_variatii`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| product_id | INT | FK → produse.id |
| name | VARCHAR(255) | Ex: „Stejar Natur", „120x20cm" |
| type | VARCHAR(100) | Ex: „culoare", „marime", „material" |
| price_modifier | DECIMAL(10,2) DEFAULT 0 | +/- față de preț bază |
| stock | INT DEFAULT 0 | Stoc per variație |
| sku_suffix | VARCHAR(50) | Ex: „-OAK", „-120" |
| color_code | VARCHAR(7) NULL | Hex culoare (pt. swatch vizual) |
| image_id | INT NULL | FK → produs_imagini.id |
| is_active | BOOLEAN DEFAULT 1 | |
| sort_order | INT | |

**`produs_campuri_custom`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| product_id | INT | FK → produse.id |
| field_name | VARCHAR(255) | Ex: „Grosime", „Clasa trafic" |
| field_value | VARCHAR(500) | Ex: „14mm", „AC5" |
| sort_order | INT | |

**`reviews`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| product_id | INT | FK → produse.id |
| name | VARCHAR(255) | Nume client |
| email | VARCHAR(255) | Email (nu se afișează) |
| rating | TINYINT | 1-5 stele |
| comment | TEXT | Text review |
| is_approved | BOOLEAN DEFAULT 0 | Aprobat de admin |
| created_at | TIMESTAMP | |

**`comenzi`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| client_id | INT NULL | FK → clienti.id (NULL dacă guest) |
| order_number | VARCHAR(20) UNIQUE | Nr. comandă (ex: AD-20260001) |
| status | ENUM('noua','confirmata','in_livrare','livrata','anulata') | Status |
| customer_name | VARCHAR(255) | |
| customer_email | VARCHAR(255) | |
| customer_phone | VARCHAR(20) | |
| shipping_address | TEXT | Adresă livrare |
| shipping_city | VARCHAR(255) | Localitate |
| shipping_county | VARCHAR(255) | Județ |
| shipping_postal_code | VARCHAR(10) | Cod poștal |
| payment_method | ENUM('ramburs','transfer') | |
| notes | TEXT NULL | Note client |
| subtotal | DECIMAL(10,2) | |
| shipping_cost | DECIMAL(10,2) DEFAULT 0 | |
| total | DECIMAL(10,2) | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**`comanda_produse`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| order_id | INT | FK → comenzi.id |
| product_id | INT | FK → produse.id |
| variation_id | INT NULL | FK → produs_variatii.id |
| product_name | VARCHAR(255) | Snapshot (nu se schimbă la edit produs) |
| quantity | INT | |
| price | DECIMAL(10,2) | Preț la momentul comenzii |

**`articole_blog`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| category_blog_id | INT NULL | FK → categorii_blog.id |
| title | VARCHAR(255) | |
| slug | VARCHAR(255) UNIQUE | |
| excerpt | TEXT | Rezumat scurt |
| content | LONGTEXT | Conținut complet (HTML) |
| featured_image | VARCHAR(500) | Imagine principală |
| author | VARCHAR(255) | |
| is_published | BOOLEAN DEFAULT 0 | |
| meta_title | VARCHAR(255) | |
| meta_description | TEXT | |
| published_at | TIMESTAMP NULL | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**`categorii_blog`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| name | VARCHAR(255) | |
| slug | VARCHAR(255) UNIQUE | |

**`seo_pages`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| page_key | VARCHAR(100) UNIQUE | Ex: „home", „shop", „about", „contact" |
| meta_title | VARCHAR(255) | |
| meta_description | TEXT | |
| og_image | VARCHAR(500) | |

**`scripts_tracking`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| name | VARCHAR(255) | Ex: „Google Analytics 4" |
| code | TEXT | Snippet complet |
| position | ENUM('head','body_end') | Unde se inserează |
| category | ENUM('necessary','statistics','marketing') DEFAULT 'marketing' | Categoria cookie (controlat de cookie bar) |
| pages | VARCHAR(255) DEFAULT 'all' | Pe ce pagini: all, home, product, checkout |
| is_active | BOOLEAN DEFAULT 1 | |

**`import_log`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| filename | VARCHAR(255) | Numele fișierului importat |
| products_added | INT | |
| products_updated | INT | |
| products_errors | INT | |
| error_details | TEXT NULL | |
| imported_at | TIMESTAMP | |

**`admin_users`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| username | VARCHAR(100) UNIQUE | |
| password_hash | VARCHAR(255) | bcrypt |
| email | VARCHAR(255) | |
| created_at | TIMESTAMP | |

**`clienti`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| name | VARCHAR(255) | Nume complet |
| email | VARCHAR(255) UNIQUE | Email (login) |
| phone | VARCHAR(20) | Telefon |
| password_hash | VARCHAR(255) | bcrypt |
| is_active | BOOLEAN DEFAULT 1 | Cont activ |
| marketing_consent | BOOLEAN DEFAULT 0 | Acceptă emailuri marketing |
| deleted_at | TIMESTAMP NULL | Data anonimizării (GDPR soft-delete) |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**`client_adrese`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| client_id | INT | FK → clienti.id |
| label | VARCHAR(100) | Ex: „Acasă", „Birou" |
| address | TEXT | Adresă completă |
| city | VARCHAR(255) | Localitate |
| county | VARCHAR(255) | Județ |
| postal_code | VARCHAR(10) | Cod poștal |
| is_default | BOOLEAN DEFAULT 0 | Adresă implicită |

**`wishlist`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| client_id | INT | FK → clienti.id |
| product_id | INT | FK → produse.id |
| created_at | TIMESTAMP | |

**`password_resets`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| client_id | INT | FK → clienti.id |
| token | VARCHAR(255) UNIQUE | Token unic de resetare |
| expires_at | TIMESTAMP | Expirare (ex: 1 oră) |
| used | BOOLEAN DEFAULT 0 | Folosit sau nu |
| created_at | TIMESTAMP | |

**`email_templates`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| template_key | VARCHAR(100) UNIQUE | Ex: `order_confirmation`, `order_status_change`, `welcome`, `password_reset`, `new_review_admin`, `new_contact_admin`, `new_order_admin` |
| name | VARCHAR(255) | Nume afișat în admin (ex: „Confirmare comandă") |
| subject | VARCHAR(255) | Subiect email (suportă variabile: `{{numar_comanda}}`) |
| body_html | LONGTEXT | Conținut HTML complet (suportă variabile) |
| available_variables | TEXT | Lista variabilelor disponibile (JSON) |
| is_active | BOOLEAN DEFAULT 1 | Activ/inactiv |
| updated_at | TIMESTAMP | |

**`settings`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| setting_key | VARCHAR(100) UNIQUE | Ex: „free_shipping_threshold", „company_email" |
| setting_value | TEXT | Valoare |

**`rate_limits`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| ip_address | VARCHAR(45) | IP (IPv4 sau IPv6) |
| endpoint | VARCHAR(100) | Ex: „login", „contact", „review" |
| attempts | INT DEFAULT 1 | Nr. încercări |
| first_attempt_at | TIMESTAMP | Prima încercare |
| blocked_until | TIMESTAMP NULL | Blocat până la |

**`admin_login_log`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| admin_id | INT NULL | FK → admin_users.id (NULL dacă user invalid) |
| ip_address | VARCHAR(45) | |
| user_agent | VARCHAR(500) | Browser |
| success | BOOLEAN | Login reușit sau eșuat |
| created_at | TIMESTAMP | |

**`client_login_log`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| client_id | INT NULL | FK → clienti.id |
| ip_address | VARCHAR(45) | |
| success | BOOLEAN | |
| created_at | TIMESTAMP | |

**`refresh_tokens`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| user_type | ENUM('admin','client') | |
| user_id | INT | ID admin sau client |
| token_hash | VARCHAR(255) | Hash-ul refresh token-ului |
| expires_at | TIMESTAMP | |
| is_revoked | BOOLEAN DEFAULT 0 | Revocat la logout |
| created_at | TIMESTAMP | |

**`consimtaminte_gdpr`**
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| client_id | INT NULL | FK → clienti.id (NULL dacă guest) |
| email | VARCHAR(255) | |
| consent_type | ENUM('account','checkout','marketing','cookies_statistics','cookies_marketing') | |
| is_granted | BOOLEAN | |
| ip_address | VARCHAR(45) | |
| policy_version | VARCHAR(20) | Versiunea politicii la momentul consimțământului |
| created_at | TIMESTAMP | |

---

## 8. Design — Păstrat din site actual

| Element | Valoare |
|---------|---------|
| **Font principal** | Inter (400, 500, 600, 700, 800, 900) |
| **Culoare brand** | #FFCC00 (brand-yellow) |
| **Culoare brand hover** | #E6B300 (brand-yellow-dark) |
| **Culoare text dark** | #2C3E50 (brand-dark) |
| **Dark mode** | Da, cu toggle (ThemeContext existent) |
| **Framework CSS** | Tailwind CSS |
| **Stil butoane** | `bg-brand-yellow text-gray-900 font-bold rounded-lg` |
| **Stil carduri** | `bg-white dark:bg-gray-900 rounded-lg shadow-lg` |
| **Backgrounds** | Alternare white/gray-50 + dark:gray-900/gray-800 |

Toate componentele noi vor respecta exact aceste convenții de design.

---

## 9. Plan de implementare — Etape

### Etapa 1: Fundația (Backend)
1. Creare bază de date MySQL din cPanel
2. Script SQL cu toate tabelele
3. Fișier `config.php` (conexiune DB)
4. API PHP: autentificare, CRUD produse, categorii

### Etapa 2: Admin Panel
5. Pagini admin: login, dashboard
6. CRUD produse cu upload imagini, variații, câmpuri custom
7. CRUD categorii cu subcategorii
8. Import feeduri (CSV/XML/JSON) cu mapare câmpuri

### Etapa 3: Frontend — Magazin
9. React Router + structura multipage
10. Pagina catalog (grid, filtre, sortare, paginare)
11. Pagina produs (galerie zoom, variații, badge-uri, rating)
12. Coș de cumpărături (Context + localStorage)
13. Checkout + plasare comandă + email confirmare

### Etapa 4: Blog + SEO
14. CRUD articole blog (admin)
15. Pagini blog publice (listă + articol)
16. SEO: meta tags editabile, Schema.org, sitemap.xml
17. Breadcrumbs, URL-uri curate

### Etapa 5: Finisare
18. Review-uri produse (frontend + aprobare admin)
19. Script Manager (pixeli tracking)
20. Wishlist
21. Optimizare performanță (lazy loading, code splitting)
22. Testare completă și deploy

---

## 10. Securitate & GDPR

### 10.1 Securitate — Prezentare generală

Securitatea este tratată pe **5 niveluri**: transport, autentificare, date, aplicație și infrastructură.

### 10.2 Transport (HTTPS)

- **SSL/TLS obligatoriu** pe tot site-ul (deja activ pe almadecor.ro)
- **Force HTTPS** via `.htaccess` — orice cerere HTTP e redirecționată la HTTPS:
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```
- **HSTS header** — browserul refuză conexiuni HTTP pentru 1 an:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```
- **Secure cookies** — toate cookie-urile au flagurile `Secure`, `HttpOnly`, `SameSite=Strict`

### 10.3 Autentificare & Autorizare

#### Parole
- Stocate **exclusiv** cu `password_hash()` PHP (bcrypt, cost factor 12)
- Nu se stochează niciodată parole plain text, nici măcar în loguri
- **Cerințe parolă**: minim 8 caractere, cel puțin o literă mare, o cifră
- **Reset parolă**: token unic cu expirare la 1 oră, single-use, trimis pe email

#### JWT (JSON Web Tokens)
- **Două sisteme separate**: JWT admin + JWT client (chei secrete diferite)
- Token-urile sunt semnate cu `HS256` și o cheie secretă din `config.php` (nu hardcodat, citit din variabilă de mediu sau fișier protejat)
- **Expirare scurtă**: 
  - Access token: 15 minute
  - Refresh token: 7 zile (stocat în httpOnly cookie)
- Token-urile de refresh pot fi revocate (invalidate în DB)
- La logout, refresh token-ul se invalidează server-side

#### Rate limiting
- **Login**: maxim 5 încercări pe 15 minute per IP → apoi blocare temporară 30 min
- **Reset parolă**: maxim 3 cereri pe oră per email
- **Contact form**: maxim 5 mesaje pe oră per IP
- **Review**: maxim 3 review-uri pe zi per IP/email
- **API general**: maxim 100 cereri pe minut per IP
- Implementat cu tabel `rate_limits` în DB (IP, endpoint, counter, timestamp)

#### Sesiuni admin
- Sesiune expiră după 30 minute de inactivitate
- La schimbarea parolei, toate sesiunile existente sunt invalidate
- Log de autentificări (IP, timestamp, succes/eșec) — tabel `admin_login_log`

### 10.4 Protecția datelor

#### Baza de date
- **Prepared statements** (PDO) pe TOATE query-urile — zero concatenare de stringuri în SQL
- **Principiul privilegiului minim**: utilizatorul MySQL al aplicației are doar `SELECT, INSERT, UPDATE, DELETE` — nu `DROP, ALTER, CREATE` (un utilizator separat pentru migrări)
- **Backup automat**: configurabil din cPanel (zilnic, săptămânal)
- **Credențiale DB**: în `config.php` care nu e accesibil public (în afara `public_html/` sau protejat cu `.htaccess`)

#### Date sensibile — ce se stochează și cum
| Dată | Stocată? | Cum |
|------|----------|-----|
| Parole | Da | bcrypt hash (ireversibil) |
| Email clienți | Da | Plain text (necesar pt. email-uri) — acces restricționat |
| Telefoane | Da | Plain text — acces restricționat |
| Adrese livrare | Da | Plain text — necesare pentru comenzi |
| Date card | **NU** | Nu procesăm plăți cu cardul |
| IP-uri | Temporar | Doar în rate_limits, șterse automat după 30 zile |
| Cookies marketing | Cu consimțământ | Doar după accept cookie banner |

#### Chei API și secrete
- **Web3Forms API key** (existent): mutat din frontend în backend PHP — nu mai e vizibil în codul sursă al clientului
- **JWT secret keys**: stocate în fișier `env.php` în afara `public_html/` sau cu acces restricționat
- **SMTP credentials**: la fel, în `env.php` protejat
- **Nicio cheie secretă** nu apare vreodată în codul JavaScript trimis la browser
- **`.htaccess` protejează fișierele sensibile**:
```apache
<FilesMatch "^(env|config)\.php$">
    Order Allow,Deny
    Deny from all
</FilesMatch>
```

### 10.5 Securitate aplicație

#### Protecție input
- **XSS (Cross-Site Scripting)**: tot output-ul e escaped cu `htmlspecialchars()` sau funcție echivalentă în template-uri PHP. React face escaping automat.
- **SQL Injection**: exclusiv prepared statements (PDO) — zero excepții
- **CSRF (Cross-Site Request Forgery)**: token CSRF generat per sesiune, verificat pe toate formularele POST (contact, checkout, login, review)
- **File Upload**: 
  - Validare MIME type real (nu doar extensia)
  - Dimensiune maximă: 5MB per imagine, 20MB per feed
  - Rename cu hash unic (`uniqid() + hash`)
  - Stocare în `/uploads/` cu `.htaccess` care blochează execuția PHP:
  ```apache
  php_flag engine off
  <FilesMatch "\.php$">
      Deny from all
  </FilesMatch>
  ```

#### Security headers (adăugate via `.htaccess` sau PHP)
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

#### Protecție directoare
- `/app/` — `.htaccess` cu `Deny from all` (logica PHP nu trebuie accesată direct)
- `/uploads/` — execuție PHP dezactivată
- `/admin/` — opțional: restricție pe IP sau autentificare HTTP suplimentară
- Fișierele `.env`, `.git`, `.gitignore`, `composer.json` — blocate de `.htaccess`

#### Logging & monitorizare
- **Log autentificări** (admin și clienți): IP, timestamp, succes/eșec
- **Log comenzi**: toate acțiunile (creare, schimbare status, anulare)
- **Log import feed**: fișier, rezultate, erori
- **Log erori PHP**: `error_log` configurat, nu se afișează erori pe site (`display_errors = Off`)
- **Alertă admin**: email automat la 5+ login-uri eșuate consecutive

### 10.6 GDPR — Conformitate completă

Site-ul procesează date personale ale cetățenilor UE (nume, email, telefon, adrese, comenzi) și trebuie să fie conform cu Regulamentul General privind Protecția Datelor.

#### Consimțământ (Consent)

##### Cookie Bar — Design & UX

**Aspect**: Banner fix în partea de jos a ecranului, design în stilul site-ului (Tailwind, culorile brand).

**Prima vizită** — banner-ul apare cu 3 butoane:
- **„Acceptă toate"** (buton principal, brand-yellow) — activează toate categoriile
- **„Doar necesare"** (buton secundar, gri) — refuză statistice + marketing
- **„Personalizează"** (link text) — deschide panoul de setări

**Panou „Personalizează"** — expandabil sub banner sau ca modal:
- Toggle per categorie cu descriere:
  - **Necesare** (mereu activ, toggle dezactivat, gri) — „Cookie-uri esențiale pentru funcționarea site-ului: sesiune, coș de cumpărături, preferințe."
  - **Statistice** (toggle on/off) — „Ne ajută să înțelegem cum folosiți site-ul. Google Analytics."
  - **Marketing** (toggle on/off) — „Folosite pentru reclame personalizate. Facebook Pixel, Google Ads."
- Buton **„Salvează preferințele"**

**După accept** — banner-ul dispare, apare un **buton persistent** (icon cookie/shield, 40x40px) în colțul **stânga-jos** al ecranului. La click, redeschide panoul de setări cookies unde poate schimba preferințele oricând.

**Link în footer**: „Setări Cookies" — deschide același panou.

##### Mecanismul tehnic — Cum controlează cookie bar-ul scripturile

Aceasta este partea critică. Cookie bar-ul **controlează efectiv** ce scripturi se încarcă. Scripturile de tracking (GA, Facebook Pixel, Google Ads, etc.) **nu se încarcă deloc** până când vizitatorul nu acceptă categoria respectivă.

**Cum funcționează:**

1. **PHP generează pagina** cu scripturile de tracking din baza de date (tabel `scripts_tracking`)
2. **Dar NU le pune ca `<script>` normal** — le pune cu `type="text/plain"` și un atribut `data-category`:

```html
<!-- Script blocat — NU se execută până la consimțământ -->
<script type="text/plain" data-category="statistics" data-src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script type="text/plain" data-category="statistics">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>

<!-- Facebook Pixel — blocat la fel -->
<script type="text/plain" data-category="marketing">
  !function(f,b,e,v,n,t,s){...}
  fbq('init', 'XXXXXXXXX');
  fbq('track', 'PageView');
</script>
```

3. **La accept**, cookie bar-ul JavaScript:
   - Salvează preferințele în cookie `cookie_consent` (JSON: `{"necessary":true,"statistics":true,"marketing":false}`)
   - Găsește toate `<script type="text/plain">` cu `data-category` acceptate
   - Le transformă în `<script type="text/javascript">` → browserul le execută
   - Scripturile externe (`data-src`) se încarcă dinamic

4. **La refuz** (sau fără acțiune):
   - Scripturile rămân `type="text/plain"` → browserul le ignoră complet
   - Zero erori în consolă (nu se încearcă încărcarea lor)
   - Zero cookies de tracking create
   - Zero date trimise la Google/Facebook

5. **La schimbarea preferințelor** (din butonul persistent):
   - Dacă dezactivează o categorie → pagina se reîncarcă fără acele scripturi
   - Dacă activează una nouă → scripturile se activează dinamic

**Cod simplificat al mecanismului:**

```javascript
// La accept sau la încărcare (dacă are deja preferințe)
function activateScripts(acceptedCategories) {
    document.querySelectorAll('script[type="text/plain"][data-category]')
        .forEach(script => {
            if (acceptedCategories.includes(script.dataset.category)) {
                // Creează script nou executabil
                const newScript = document.createElement('script');
                newScript.type = 'text/javascript';
                
                if (script.dataset.src) {
                    // Script extern
                    newScript.src = script.dataset.src;
                } else {
                    // Script inline
                    newScript.textContent = script.textContent;
                }
                
                script.parentNode.replaceChild(newScript, script);
            }
        });
}
```

##### Integrarea cu Script Manager din admin

Tabelul `scripts_tracking` primește o coloană nouă `category`:

| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT | PK |
| name | VARCHAR(255) | Ex: „Google Analytics 4" |
| code | TEXT | Snippet complet |
| position | ENUM('head','body_end') | |
| category | ENUM('necessary','statistics','marketing') DEFAULT 'marketing' | Categoria cookie |
| pages | VARCHAR(255) DEFAULT 'all' | |
| is_active | BOOLEAN DEFAULT 1 | |

Când adminul adaugă un pixel nou din panou, selectează categoria (necesar / statistice / marketing). PHP-ul generează automat scriptul cu `type="text/plain"` și `data-category` corespunzător.

##### De ce NU dă erori

Abordarea cu `type="text/plain"` este cheia:
- Browserul **ignoră complet** scripturile cu type diferit de `text/javascript`
- Nu încearcă să descarce resurse externe (`data-src` în loc de `src`)
- Nu execută nicio linie de cod
- Nu creează variabile globale (`fbq`, `gtag`, etc.)
- **Zero erori în consolă**, zero network requests, zero cookies

Când alt cod de pe pagină încearcă să apeleze `gtag()` sau `fbq()` înainte de accept, folosim wrapper-uri safe:

```javascript
// Wrapper-uri globale — previn erorile dacă scriptul nu e încărcat
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){dataLayer.push(arguments);};
window.fbq = window.fbq || function(){};
```

Acestea se pun mereu (sunt „necesare") și pur și simplu colectează apelurile fără să le trimită nicăieri. Când scriptul real se activează, preia controlul și trimite datele.

- **Consimțământ la crearea contului**: checkbox explicit „Sunt de acord cu Politica de Confidențialitate"
- **Consimțământ la checkout**: checkbox explicit pentru T&C + Politica de Confidențialitate
- **Consimțământ marketing**: checkbox opțional separat „Vreau să primesc oferte și noutăți pe email"
- **Dovada consimțământului**: stocat în DB (ce a acceptat, când, IP, versiunea politicii)

#### Tabel `consimtaminte_gdpr`
| Câmp | Tip | Descriere |
|------|-----|-----------|
| id | INT AUTO_INCREMENT | PK |
| client_id | INT NULL | FK → clienti.id (sau NULL dacă guest) |
| email | VARCHAR(255) | Email-ul persoanei |
| consent_type | ENUM('account','checkout','marketing','cookies_statistics','cookies_marketing') | Tip consimțământ |
| is_granted | BOOLEAN | Acceptat sau refuzat |
| ip_address | VARCHAR(45) | IP la momentul consimțământului |
| policy_version | VARCHAR(20) | Versiunea politicii (ex: „2.1") |
| created_at | TIMESTAMP | Momentul consimțământului |

#### Drepturile persoanelor vizate

| Drept GDPR | Implementare |
|-------------|-------------|
| **Dreptul de acces** (Art. 15) | Clientul poate descărca toate datele sale din „Contul meu" → „Datele mele" (export JSON/PDF) |
| **Dreptul la rectificare** (Art. 16) | Clientul poate edita datele personale din „Contul meu" |
| **Dreptul la ștergere** (Art. 17) | Buton „Șterge contul" — anonimizează datele personale, păstrează comenzile anonimizate pentru contabilitate |
| **Dreptul la portabilitate** (Art. 20) | Export date în format JSON/CSV din „Contul meu" |
| **Dreptul la restricționare** (Art. 18) | Adminul poate dezactiva un cont fără a-l șterge |
| **Dreptul de opoziție** (Art. 21) | Dezabonare din emailurile de marketing cu un click (link în fiecare email) |

#### Ștergerea contului — procedura
1. Clientul apasă „Șterge contul" → confirmare cu parolă
2. Datele personale se **anonimizează** (nu se șterg complet, pentru facturare):
   - Nume → „Client anonim #ID"
   - Email → `anonimXXXX@deleted.local`
   - Telefon → `0000000000`
   - Adrese → șterse complet
   - Wishlist → șters complet
   - Review-uri → păstrate dar cu „Client anonim"
3. Comenzile rămân cu date anonimizate (obligatoriu fiscal)
4. Contul se marchează `is_active = 0`, `deleted_at = NOW()`
5. Email de confirmare: „Contul tău a fost șters"

#### Politici legale (pagini pe site)
- **Politica de confidențialitate** — actualizată cu: ce date colectăm, de ce, cât le păstrăm, cui le transmitem (procesatori: hosting, email, analytics), drepturile persoanei, datele de contact DPO
- **Termeni și condiții** — actualizați cu secțiuni magazin online, comenzi, returnări
- **Politica de cookies** — cu lista exactă a cookie-urilor, scopul fiecăruia, durata

#### Retenția datelor
| Dată | Perioadă retenție | După expirare |
|------|-------------------|---------------|
| Conturi active | Nelimitat (cât contul e activ) | — |
| Conturi inactive | 2 ani fără login | Email avertisment → ștergere |
| Comenzi | 10 ani (obligație fiscală) | Anonimizare date personale |
| Log-uri autentificare | 90 zile | Ștergere automată |
| IP-uri rate limiting | 30 zile | Ștergere automată |
| Consimțăminte | 5 ani de la acordare | Ștergere |
| Emailuri marketing | Până la dezabonare | Ștergere email din lista de marketing |

#### Cookie-uri utilizate
| Cookie | Categorie | Scop | Durată |
|--------|-----------|------|--------|
| `session_id` | Necesar | Sesiune utilizator | Sesiune browser |
| `cart` | Necesar | Conținut coș | 30 zile |
| `jwt_token` | Necesar | Autentificare client | 7 zile |
| `theme` | Necesar | Preferință dark/light mode | 1 an |
| `cookie_consent` | Necesar | Stocarea alegerilor de cookie | 1 an |
| `_ga`, `_gid` | Statistice | Google Analytics | 2 ani / 24h |
| `_fbp` | Marketing | Facebook Pixel | 90 zile |

#### Breșă de securitate (Data Breach)
- Procedură documentată: detectare → evaluare → notificare
- Notificare ANSPDCP (Autoritatea Națională) în 72 ore dacă breșa afectează drepturi și libertăți
- Notificare persoanelor afectate dacă riscul e ridicat
- Log-ul de securitate ajută la investigare

---

## 11. Considerații tehnice

### Rutare — PHP Hybrid
- Apache `.htaccess` trimite toate cererile la `index.php` (cu excepția `/api/`, `/admin/`, `/uploads/`, `/assets/`)
- PHP-ul face routing pe server → generează HTML complet cu conținut + meta tags + Schema.org
- React face hydration în browser → adaugă interactivitate
- Navigarea client-side (după prima pagină) folosește fetch JSON de la API → React renderizează → History API actualizează URL-ul
- La refresh sau acces direct, PHP servește din nou HTML complet (crawlere și vizitatori primesc mereu conținut complet)

### SEO garantat
- **Fiecare pagină** servește HTML complet la primul request (nu depinde de JavaScript)
- **Meta tags** (title, description, canonical, OG, Twitter) — generate de PHP din baza de date
- **Schema.org** — JSON-LD injectat în `<head>` per tip de pagină (Product, Article, FAQPage, BreadcrumbList, etc.)
- **Sitemap.xml** — generat dinamic, include toate produsele, categoriile și articolele active
- **Breadcrumbs** — HTML semantic în pagină + Schema.org BreadcrumbList
- **Conținut complet** — titluri, descrieri, prețuri, imagini cu alt text, review-uri — tot vizibil fără JS

### Securitate API
- Autentificare admin via JWT token (stocat în httpOnly cookie)
- Autentificare clienți via JWT separat
- Validare și sanitizare input pe toate endpoint-urile PHP (prepared statements, htmlspecialchars)
- CORS configurat doar pentru domeniul almadecor.ro
- Rate limiting pe endpoint-uri sensibile (login, contact, review, reset parolă)
- Upload imagini: validare tip MIME, dimensiune maximă, rename random, stocare în afara webroot dacă posibil
- CSRF protection pe formularele PHP
- Parole stocate cu `password_hash()` (bcrypt)

### Email
- **Metodă recomandată**: SMTP prin cPanel
  - Creezi cont email pe cPanel (ex: `comenzi@almadecor.ro`)
  - Configurezi SPF, DKIM, DMARC din cPanel → deliverability maximă
  - PHP trimite via SMTP autentificat (librărie PHPMailer)
- **7 tipuri de emailuri automate** (vezi secțiunea 4.9)
- **Template-uri HTML editabile din admin** cu variabile dinamice
- **Fallback**: `mail()` PHP nativ dacă SMTP nu e disponibil

### Performanță
- **Cache PHP**: rezultatele query-urilor frecvente (categorii, setări, produse populare) cache-uite în fișiere JSON cu TTL
- **Lazy loading imagini**: atribut `loading="lazy"` pe toate imaginile (existent deja în componentele actuale)
- **Code splitting React**: bundle-uri separate pentru admin vs public
- **Compresie**: gzip activat din `.htaccess`
- **Imagini optimizate**: resize la upload (thumbnails, medium, large)

### Workflow development și deploy
1. **Componentele React** — dezvoltate local, `npm run build` → `assets/app.js` + `assets/app.css`
2. **Fișierele PHP** — dezvoltate local sau direct pe server
3. **Deploy**: urci `assets/` (React build) + `app/` + `api/` pe server via FTP/cPanel File Manager
4. **Baza de date**: creată o singură dată din cPanel → phpMyAdmin, migrările ulterioare prin scripturi SQL

---

*Document generat pe baza cerințelor discutate. Versiune 1.4 — actualizat cu cookie bar integrat cu tracking scripts + GDPR complet*
