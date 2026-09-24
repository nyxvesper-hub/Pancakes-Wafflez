# Pancakes & Wafflez — Swap Guide

A complete reference for everything you need to replace before pitching this site to a real café/bakery client. Every value below is a **placeholder** that should be swapped for the client's real data.

---

## 🚀 Where to do most edits (no code needed)

### The Admin Menu CMS

1. Open the live site.
2. **Two ways to open the admin panel:**
   - Click the visible **"Admin"** link in the footer (next to "Fait avec ❤ à Casablanca"), OR
   - Press **Shift + A** anywhere on the page (keyboard shortcut — much faster than scrolling).
3. Enter the admin token. **Default token for dev: `demo`**.
4. The Sheet slides in from the right with **two sections**:
   - **Catégories** (top): full CRUD on menu categories — add "Smoothies", "Salades", etc.
   - **Items per category** (below): each existing category has its own block listing items.

### Categories (NEW)

The "Catégories" section lets the owner:
- **Add a new category** via "+ Nouvelle catégorie" — fill in:
  - `Clé` (key): a slug like `smoothies`, `salads`, `cold-drinks` (lowercase, hyphens only)
  - `Nom (FR)` / `Name (EN)`: the display label in both languages
  - `Ordre d'affichage`: where it shows on the page (1, 2, 3…)
- **Modify a category** — rename it, change its display order
- **Delete a category** — confirm modal warns that items are NOT auto-deleted (they become orphaned; re-categorize or delete them separately)

When a new category is added, it appears instantly on the live page AND in the downloadable PDF menu — both the website and `/api/menu/pdf` fetch categories dynamically from the DB.

### Items

Per category, the owner can:
- **Add a new dish** via "+ Nouveau plat" — name (FR/EN), description (FR/EN), price (MAD), photo URL, photo size, category (dropdown), order
- **Edit any dish** — click "Modifier" to expand the form
- **Delete any dish** — confirm modal

### Photo Size (NEW)

Each menu item has a `photoSize` field with 4 options:
- **Petite (small)** — small thumbnail in the menu row (default)
- **Moyenne (medium)** — slightly bigger thumbnail
- **Grande (large)** — large thumbnail
- **Vedette (feature)** — same as large in the menu row, but in the gallery it spans a 2×2 block (the "hero" tile)

The Gallery section automatically prioritizes items by photoSize (`feature` → `large` → `medium` → `small`) and gives larger sizes bigger tile spans. So setting a dish to `feature` makes it the gallery hero.

**For production:** set the `ADMIN_TOKEN` environment variable on your server to a real secret (long random string). Then the Sheet will reject edits unless the owner enters that token.

---

## 📝 Top-level placeholders to swap (in `src/app/page.tsx`)

| Placeholder | Current value | Where to find it | Replace with |
|---|---|---|---|
| `WHATSAPP_NUMBER` | `"212612345678"` | Top of `page.tsx` | Client's WhatsApp number with country code, no `+` |
| `WHATSAPP_MSG_FR` | `"Bonjour Pancakes & Wafflez, je souhaite passer une commande :"` | Top of `page.tsx` | Pre-filled WhatsApp message in French |
| `WHATSAPP_MSG_AR` | Arabic equivalent | Top of `page.tsx` | Pre-filled WhatsApp message in Arabic |
| `INSTAGRAM_URL` | `https://www.instagram.com/pancakesandwafflez/` | Top of `page.tsx` | Client's Instagram URL |
| `MAPS_QUERY` | `Casablanca, Morocco` | Top of `page.tsx` | Client's real address (will be URL-encoded automatically) |
| `HERO_PHOTO_URL` | Pancake photo on ZAI CDN | Top of `page.tsx` | Any image URL — best if square aspect ratio |
| `STORY_PHOTO_URL` | Bakery interior on ZAI CDN | Top of `page.tsx` | Any image URL — best if 4:5 portrait aspect ratio |

---

## 🌍 Bilingual content (`src/components/bakery/strings.ts`)

All on-page copy (hero title, story paragraphs, section labels, hours, footer text) lives here, in two top-level objects: `fr` (French) and `en` (English). When you change the brand name, address, or hours in one language, update both. (Arabic was removed per request — most Moroccan café clients only need FR + EN for tourists.)

Key fields to swap:

| Field path | What it controls |
|---|---|
| `fr.hero.eyebrow` / `en.hero.eyebrow` | "Casablanca · Maroc" eyebrow above hero title |
| `fr.hero.tagline` / `en.hero.tagline` | Hero subtitle paragraph |
| `fr.hero.hours_chip` / `en.hero.hours_chip` | "10h — 19h · Fermé le lundi" chip |
| `fr.hero.location_chip` / `en.hero.location_chip` | "Casablanca, Maroc" chip |
| `fr.story.*` / `en.story.*` | Story section title, two body paragraphs, three stats, caption |
| `fr.menu.subtitle` / `en.menu.subtitle` | Menu section subtitle |
| `fr.menu.note` / `en.menu.note` | Footer note about allergies |
| `fr.findus.*` / `en.findus.*` | Address, hours (2 lines), phone, Instagram handle, "Open in Google Maps" button label |
| `fr.cta.*` / `en.cta.*` | WhatsApp CTA banner eyebrow, title, body, button label |
| `fr.footer.*` / `en.footer.*` | Footer columns: address (2 lines), hours (2 lines), Instagram, copyright, made-with-love |

---

## 🍽️ Menu items + categories (DB-driven)

**Categories** are now stored in their own `MenuCategory` table (not hardcoded):
- `key` — slug like `pancakes`, `waffles`, `smoothies` (lowercase, hyphens only)
- `labelFr`, `labelEn` — display labels in both languages
- `displayOrder` — left-to-right / top-to-bottom render order on the live page

**Menu items** live in `MenuItem` and reference a category by its `key`:
- `category` — string matching a `MenuCategory.key`
- `order` — display order within the category (1, 2, 3…)
- `nameFr`, `nameEn` — dish name in both languages
- `descFr`, `descEn` — short description in both languages
- `price` — in MAD (Moroccan dirhams), as integer
- `photoUrl` — full URL to a food photo
- `photoSize` — one of `"small" | "medium" | "large" | "feature"` (controls thumbnail size in menu + tile span in gallery)

**Three ways to edit:**

1. **Via the Admin Sheet** (recommended for non-technical users / clients) — see top of this guide. Includes category management now.
2. **Via `prisma/seed.ts`** (recommended for setup / new client setup) — edit the file, then run:
   ```bash
   bun run db:push --force-reset   # destructive — wipes existing items
   bun run db:seed                 # re-seed categories + items from the file
   ```
3. **Direct API** (for integrations / scripts) — `GET/POST /api/menu`, `GET/POST /api/menu/categories`, `PATCH/DELETE /api/menu/[id]`, `PATCH/DELETE /api/menu/categories/[key]`. All write routes are auth-protected with `ADMIN_TOKEN` (default `demo`).

---

## 🖨️ Printable PDF menu (currently disabled in UI)

The PDF generator backend is still wired up and working — it just doesn't have UI buttons anymore. The user can re-enable it anytime by adding back the buttons (one line of code each).

**Backend (still active):**
- `GET /api/menu/pdf` — returns a vintage-styled A4 PDF with all menu items + categories, dynamically rendered. Try it directly in the browser: visit `http://localhost:3000/api/menu/pdf` and the file downloads.
- `src/scripts/menu-pdf.ts` — pdfkit-based generator using LiberationSerif font, cream background, espresso text, terracotta accents, 2-column layout. Editable.

**UI buttons (removed per user request):**
- Previously there were two "Télécharger le menu (PDF)" buttons — one in the sticky header, one in the menu section. Both removed.
- The `t.print.button` + `t.print.aria` strings remain in `strings.ts` for backward compat (and easy re-enable).

**To re-enable the buttons later**, paste this back into the `Menu` component (around line 484 of `src/app/page.tsx`, after the subtitle):

```tsx
<a
  href="/api/menu/pdf"
  download="pancakes-and-wafflez-menu.pdf"
  className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-4 py-2 text-sm font-500 text-primary-foreground hover:bg-primary/90"
>
  <span>{t.print.button}</span>
</a>
```

Or for the header, add an icon button next to `<LangToggle />` that links to the same URL.

---

## 🖼️ Photos — where they're stored & how to swap

| Photo | Where it shows | How to swap |
|---|---|---|
| Hero photo | Big circle in the hero section | Edit `HERO_PHOTO_URL` in `src/app/page.tsx` |
| Story photo | Tilted paper-frame in story section | Edit `STORY_PHOTO_URL` in `src/app/page.tsx` |
| Menu item thumbnails | Small squares next to each menu row | Edit `photoUrl` per item via Admin Sheet OR `prisma/seed.ts` |
| Gallery tiles (6) | Asymmetric editorial grid | Auto-uses the first 6 menu items' `photoUrl`. Reorder by editing the `order` field in seed/admin. |

**Allowed photo hosts** (configured in `next.config.ts`):
- `z-cdn.chatglm.cn` (ZAI in-house image search CDN — free)
- `images.unsplash.com` (Unsplash — free)
- `images.pexels.com` (Pexels — free)

To allow a different host, edit `next.config.ts → images.remotePatterns` and add the hostname.

**Best practice:** upload the client's real food photos to their own CDN/S3/Cloudinary bucket and swap the URLs. Real food photos of the actual dishes will sell the menu 10× better than stock.

---

## 🎨 Design system (`src/app/globals.css`)

| Variable | What it controls | Current value |
|---|---|---|
| `--background` | Page background (cream paper) | `#F5EBDC` |
| `--foreground` | Default text color (espresso) | `#2B1A12` |
| `--primary` | Dark text, primary buttons | `#3B2A1F` |
| `--accent` | Warm tomato — prices, CTAs, highlights | `#C44A3B` |
| `--tertiary` | Sage green — botanical accents | `#9CA882` |
| `--secondary` | Toasted caramel — secondary surfaces | `#E8D5B5` |

To rebrand for a different client (e.g., a surf café in Taghazout — they might want ocean blue + sand), just edit the `:root` block. The whole site re-themes instantly.

**Fonts** (in `src/app/layout.tsx`):
- `Fraunces` — serif display (headlines, prices, menu names)
- `Inter` — sans body text
- `IBM Plex Sans Arabic` — Arabic body text

All three are loaded from Google Fonts via `next/font` — zero cost, instant load.

---

## 🛠️ Local development commands

```bash
# Install deps
bun install

# Start dev server (auto-runs on port 3000)
bun run dev

# Lint
bun run lint

# Reset / re-seed the database
bun run db:push     # sync schema (DESTRUCTIVE — accepts data loss)
bun run db:seed     # re-seed the 16 menu items

# Generate Prisma client (after schema changes)
bun run db:generate
```

---

## 🚢 Deployment

This is a standard Next.js 16 app with SQLite + Prisma. For production:

1. **Pick a host that supports SQLite persistence** (Vercel's persistent volumes, Railway, Fly.io, Render — or move to Postgres for serverless platforms like Vercel without volumes).
2. **Set environment variables:**
   - `DATABASE_URL` — production DB path or Postgres URL
   - `ADMIN_TOKEN` — a long random string (e.g., `openssl rand -hex 32`). Anything without this token will be rejected by the `/api/menu` POST/PATCH/DELETE routes.
3. **Build and deploy:**
   ```bash
   bun run build
   bun run start
   ```
4. **Re-seed the menu** once on first deploy if the DB is empty.

---

## ✅ Pre-pitch checklist

Before showing this to a real client, walk through:

- [ ] WhatsApp number `WHATSAPP_NUMBER` is the client's real number (with country code, no `+`)
- [ ] Phone number in `strings.ts → findus.phone` is real
- [ ] Address in `strings.ts → findus.address` is real
- [ ] Instagram URL `INSTAGRAM_URL` is the client's actual IG
- [ ] Google Maps query `MAPS_QUERY` is the client's actual address
- [ ] Hours in `strings.ts → findus.hours_lines` match the client's real hours
- [ ] Menu items in the Admin Sheet (or `prisma/seed.ts`) match the client's real dishes + prices
- [ ] Categories (top section of Admin Sheet) match the client's real food sections
- [ ] Hero photo + story photo are either the client's real photos OR high-quality stock that matches their vibe
- [ ] Each menu item's `photoUrl` is the client's real photo of that dish
- [ ] Each menu item's `photoSize` is set sensibly (most "small", a few "feature" for the gallery hero)
- [ ] Set `ADMIN_TOKEN` env var to a strong random secret on the deployed server
- [ ] Test the Admin Sheet end-to-end on the deployed site (Shift+A → unlock → edit → save → see change)
- [ ] Test FR/EN toggle — both languages render cleanly

---

## 📞 Support

This site was built as a portfolio-quality demo. The bones (vintage layout, FR/AR toggle, Prisma CMS, print CSS, hand-drawn icon set) are reusable for any café/bakery/brunch spot in Morocco. Fork, rebrand, repeat.

— Built with ❤ in Casablanca.
