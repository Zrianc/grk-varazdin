# GRK Varaždin – službena web stranica

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Lucide ikone · SVG grafika

Struktura i funkcionalnosti po uzoru na rknexe.hr, vizualni identitet prema službenom grbu (dabar), crveno-bijelim dresovima i motivu varaždinskog Starog grada.

## Pokretanje

```bash
npm install
cp .env.example .env.local   # postavite ADMIN_PASSWORD i ADMIN_SECRET
npm run dev                  # http://localhost:3000
```

Produkcija (vlastiti Node poslužitelj / VPS):

```bash
npm run build
npm start
```

## Administracija – `/admin`

Prijava lozinkom iz `ADMIN_PASSWORD`. Moguće je uređivati:

| Odjeljak | Sadržaj |
|---|---|
| Vijesti | naslov, kategorija, datum, naslovna fotografija, opis, tekst, istaknuta vijest |
| Igrači | ime, prezime, broj, pozicija, momčad, portret, biografija, statistika |
| Momčadi | prva i druga momčad, mlađe kategorije |
| Uprava i stožer | uprava kluba, stručni stožer, treneri škole rukometa |
| Utakmice i rezultati | datum, natjecanje, klubovi, grbovi, lokacija, rezultat (prazno = nije odigrana) |
| Ljestvice | redovi ljestvice po natjecanju |
| Fotografije i video | galerije (više fotografija), YouTube/Facebook videozapisi |
| Sponzori | 4 kategorije, logotip, poveznica |
| Klupski dokumenti | statut i ostali PDF dokumenti |
| Povijest kluba | uvod, kronologija, uspjesi, značajni igrači (JSON) |
| Postavke | kontakt, društvene mreže, slogan, naslovna fotografija/video, škola rukometa, uključivanje trgovine/ulaznica/TV-a, izvor ljestvice (JSON) |

Fotografije i PDF-ovi učitavaju se izravno iz obrasca („Učitaj”) i spremaju u `data/uploads/`.
Spremanje odmah osvježava javne stranice.

## Privremeni podaci

Sve što nije provjereno označeno je kao **privremeno** – na stranici se prikazuje oznaka „Privremeno”, a nazivi su u uglatim zagradama (`[Ime]`, `[Protivnik 1]`, `[Klub A]`). Zamijenite ih službenim podacima i isključite kvačicu „Privremeni podatak”.

Provjereni podaci koji su već uneseni (s izvorom u Povijesti kluba):

- naziv: Gradski rukometni klub Varaždin 1930, natjecanje 2026./27.: 1. HRL Sjever, glavni trener: Ilija Puljević (Sofascore)
- dvorana: Arena Varaždin, Šetalište Franje Tuđmana 1
- 29. 5. 1930. – prva službena rukometna utakmica u Varaždinu (bilten Grada Varaždina)
- 2021./22. – 5. mjesto u Premijer ligi (Wikipedia)

Nedostaje i treba unijeti: adresa sjedišta, e-mail, telefon, Instagram, igrači, raspored i rezultati, ljestvica, sponzori, uprava, podaci škole rukometa, pravila privatnosti i kolačića.

## Vizualni identitet

- `public/images/grb.png` – službeni grb s uklonjenom vanjskom crvenom pozadinom (favicon: `public/favicon-32.png`, `apple-touch-icon.png`).
- `public/images/igraci-grk-varazdin-*.jpg` – fotografije igrača u klupskim dresovima (naslovnica).
- `src/components/StariGrad.tsx` – vektorska silueta Starog grada (ulazna kula, glavna kula, okrugle kule, krila palače, bedemi).
- `src/components/Townscape.tsx` – panorama Varaždina u stilu donjeg dijela dresa (barokne kuće, toranj katedrale, Gradska vijećnica, Stari grad).
- Crveno-bijele okomite pruge: klase `stripes`, `stripes-thin`, `stripes-v` u `globals.css`.
- Paleta (`tailwind.config.ts`): `#D71918`, `#BA1010`, `#850C0C`, `#FFFFFF`, `#141414`.
- Maskota: polje `mascot` u Postavkama. Trenutno se koristi cijeli grb; kad bude dostupan zaseban crtež dabra na prozirnoj podlozi, postavite njegovu putanju.

Ako postoji izvorna vektorska datoteka motiva s dresa, zamijenite geometriju u `StariGrad.tsx` / `Townscape.tsx` – komponente zadržavaju isto sučelje.

## Integracije

- **Ljestvica – Sofascore**: u Postavkama postavite `standings.provider` na `"sofascore"` i za natjecanje upišite `sofascoreWidgetUrl` (URL ugradnje iz Sofascore widget alata). Za drugi API dohvatite retke u obliku `StandingRow` (`src/lib/types.ts`).
- **Facebook**: sekcija „Prati nas” prikazuje objave službenim Facebook Page Pluginom.
- **Instagram**: upišite adresu profila; za prikaz objava na stranici potreban je Instagram Graph API (pristupni token).
- **Ulaznice i fan shop**: stranice `/ulaznice` i `/fan-shop` su pripremljene, ali skrivene (404) dok se u Postavkama ne uključi `features.tickets` / `features.shop`. Tada se ugrađuje sustav za prodaju.
- **GRK Varaždin TV**: uključite `features.tv` i upišite `youtube` kad klub ima službeni kanal.

## Arhitektura (spremno za CMS)

- `src/lib/types.ts` – tipovi sadržaja
- `src/lib/content.ts` – jedini sloj pristupa podacima (`read`/`write` + upiti). Trenutno JSON datoteke u `data/`; za headless CMS (Sanity, Strapi, Payload, Directus) zamijenite samo ovaj modul.
- `src/lib/admin-schema.ts` – opis polja administracije
- `src/app/(site)` – javne stranice, `src/app/admin` – administracija, `src/middleware.ts` – zaštita administracije

**Napomena o hostingu:** administracija zapisuje u `data/` na disku, pa je za ovu verziju potreban poslužitelj s trajnim diskom (VPS, Docker, Node hosting). Za serverless hosting (npr. Vercel) prebacite `content.ts` na bazu/CMS, a prijenos datoteka na S3/R2/Cloudinary.

## SEO i pristupačnost

Metapodaci i Open Graph po stranici, `NewsArticle` JSON-LD za vijesti, `sitemap.xml`, `robots.txt`, kanonske adrese, filtriranje vijesti preko indeksabilnih poveznica, optimizirane slike (`next/image`, AVIF/WebP), poveznica „Preskoči na sadržaj”, ARIA oznake za izbornik, karusel i galeriju, upravljanje tipkovnicom u galeriji (Esc, strelice).
