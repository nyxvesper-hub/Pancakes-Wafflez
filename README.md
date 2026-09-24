# Pancakes & Wafflez — Vintage Bakery Site Template

A portfolio-quality, production-ready website template for Moroccan cafés, bakeries, and brunch spots. Built for a real Casablanca brunch brand (Pancakes & Wafflez) but designed to be forked, rebranded, and re-sold to any café/bakery client.

## What's inside

- **Next.js 16** + **TypeScript** + **Tailwind CSS 4** + **shadcn/ui**
- **Prisma + SQLite** for the menu CMS (no external DB needed)
- **Bilingual FR / EN** with one-click language toggle (live on the page)
- **Admin Sheet** — owner edits menu items, prices, photos, and **whole food categories** without code:
  - Open via **Shift + A** keyboard shortcut OR click "Admin" link in the footer
  - Default admin token: `demo` (change `ADMIN_TOKEN` env var in production)
- **Photo size controls** per dish (`small` / `medium` / `large` / `feature`) — controls thumbnail size in the menu row + tile span in the gallery
- **Hand-drawn SVG illustrations** + real food photos (loaded from ZAI image-search CDN, swappable)
- **WhatsApp deep-links** with pre-filled order message (different per language)
- **Stylized map illustration** with Google Maps deep-link
- **Mobile-first responsive** — works perfectly on phones (where most café clients will see it)

## Quick start (5 minutes)

```bash
# 1. Install dependencies (Bun is fastest; npm works too)
bun install
# or: npm install

# 2. Set up your environment
cp .env.example .env
# Edit .env to set ADMIN_TOKEN to a long random string (e.g. run: openssl rand -hex 32)

# 3. Initialize the database
bun run db:push     # creates SQLite DB + tables
bun run db:seed     # seeds 4 categories + 16 sample menu items with photo URLs

# 4. Start the dev server
bun run dev
# Site is live at http://localhost:3000
```

## Customize for a real client

Read **`SWAP_GUIDE.md`** (in this folder) — it's the complete reference for everything you need to swap before pitching to a real café:

- WhatsApp number, phone, address, Instagram URL, Google Maps query
- Hero photo URL + story photo URL
- All on-page copy (story text, menu descriptions, CTA) in `src/components/bakery/strings.ts`
- Menu items + categories — either via the Admin Sheet (no code) or by editing `prisma/seed.ts` and re-running `bun run db:seed`

Most swaps take 15 minutes once you have the client's real data.

## Deploy to production (free, ~10 minutes)

### Option A: Vercel (recommended, free tier is plenty)

1. **Push this folder to a new GitHub repo:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Pancakes & Wafflez bakery template"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com → sign in with GitHub
   - Click "Add New Project" → select your repo
   - Vercel auto-detects Next.js — leave all defaults
   - Under "Environment Variables" add:
     - `DATABASE_URL` = `file:./db/custom.db` (Vercel handles SQLite via persistent volumes; if not on a volume-capable plan, see Option B)
     - `ADMIN_TOKEN` = a long random string from `openssl rand -hex 32`
   - Click "Deploy" — live in ~90 seconds at `your-project.vercel.app`

3. **Connect a real domain (optional but recommended):**
   - In Vercel: Project Settings → Domains → add the client's domain
   - Vercel gives you DNS records to set at the registrar
   - Buy the domain at Namecheap (~$10/year for `.com`) or Nuxit/Maroc Telecom (~250 MAD/year for `.ma`)

### Option B: Railway / Render / Fly.io (better for SQLite persistence)

Vercel's free tier doesn't persist SQLite files across deploys by default. For a real client where the admin panel needs to persist data, use one of:

- **Railway.app** — has persistent volumes, supports Next.js + SQLite out of the box. ~$5/month for the smallest tier.
- **Render.com** — same idea, has a free tier with persistent disk on paid plans.
- **Fly.io** — has persistent volumes, very cheap (~$2-3/month).

On all three: deploy the GitHub repo, set the same two env vars (`DATABASE_URL`, `ADMIN_TOKEN`), and you're live.

## How to use the Admin Sheet (for the client / owner)

1. Open the live site
2. Either:
   - Press **Shift + A** anywhere on the page, OR
   - Scroll to the footer → click the visible **"Admin"** link
3. Enter the `ADMIN_TOKEN` you set in your env vars
4. The Sheet slides in from the right with:
   - **Catégories** (top): add / rename / reorder / delete food sections (Pancakes, Smoothies, Salades, anything you want)
   - **Items per category**: add / edit / delete dishes with name (FR/EN), description (FR/EN), price, photo URL, photo size

Changes save instantly to the DB and appear on the live page within 30 seconds (TanStack Query auto-refetch).

## File structure (the important files)

```
.
├── prisma/
│   ├── schema.prisma          # MenuCategory + MenuItem models
│   └── seed.ts                # Initial 4 categories + 16 dishes with photo URLs
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Fonts (Fraunces + Inter) + QueryProvider
│   │   ├── page.tsx           # Main page (Hero / Story / Menu / Gallery / Find Us / CTA / Footer)
│   │   ├── globals.css        # Vintage palette + paper-grain texture + print CSS
│   │   └── api/
│   │       └── menu/
│   │           ├── route.ts              # GET/POST menu items
│   │           ├── [id]/route.ts        # PATCH/DELETE one item
│   │           ├── categories/route.ts  # GET/POST categories
│   │           ├── categories/[key]/route.ts  # PATCH/DELETE one category
│   │           └── pdf/route.ts         # GET — generates a printable PDF menu (currently no UI button, but endpoint works)
│   ├── components/
│   │   └── bakery/
│   │       ├── admin-menu-sheet.tsx  # The admin panel (Categories + Items CRUD)
│   │       ├── use-menu-items.ts     # TanStack Query hook for items + categories
│   │       ├── query-provider.tsx    # Wraps app in QueryClient
│   │       ├── icons.tsx             # 14 hand-drawn SVG icons
│   │       └── strings.ts            # FR/EN translations for the whole UI
│   ├── lib/
│   │   ├── db.ts              # Prisma client (singleton)
│   │   └── utils.ts           # shadcn helper
│   └── scripts/
│       └── menu-pdf.ts       # pdfkit-based PDF generator (vintage styled)
├── SWAP_GUIDE.md              # READ THIS — full customization reference
├── README.md                  # This file
├── .env.example               # Template for env vars
├── package.json               # Dependencies + scripts
├── next.config.ts             # Image CDN whitelist
├── tailwind.config.ts
└── tsconfig.json
```

## Pricing recommendation (Moroccan market)

For a real café/bakery client in Casablanca, Rabat, or Marrakech:

| Item | Price (MAD) |
|---|---|
| Base site (this whole template, customized for them) | 1,500 – 3,000 |
| Domain `.ma` + 1 year hosting | 250 – 350 (pass-through, no markup) |
| Real food photography (you shoot 6-8 dishes) | +500 (upsell) |
| Monthly maintenance retainer (updates, fixes) | 200 – 500/mo |

**Pitch angle:** "Agencies charge 8,000-15,000 MAD for template sites. I deliver a hand-crafted, fully-bilingual, admin-managed site for 2,000 MAD in 5 days — and you change your own menu without calling me."

## License

You own this code. Use it for as many clients as you want. No attribution required.

Built with ❤ in Casablanca.
