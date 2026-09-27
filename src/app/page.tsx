"use client";

import * as React from "react";
import Image from "next/image";
import { strings, type Lang, type Translation } from "@/components/bakery/strings";
import {
  Whisk,
  MintSprig,
  CoffeeCup,
  ForkKnife,
  OliveBranch,
  PancakeStack,
  Waffle,
  Wheat,
  Clock,
  Pin,
  WhatsAppIcon,
  InstagramIcon,
  StarDivider,
  ZelligeStar,
  Heart,
} from "@/components/bakery/icons";
import {
  useMenu,
  type MenuItemDTO,
  type MenuCategoryDTO,
  type PhotoSize,
} from "@/components/bakery/use-menu-items";
import { useSettings, type SiteSettingsDTO } from "@/components/bakery/use-settings";

/* ============================================================
   Pancakes & Wafflez — single-page vintage bakery site
   ------------------------------------------------------------
   Self-contained: only external assets are food photos hosted on
   the ZAI image-search CDN (z-cdn.chatglm.cn) — easy to swap via
   the admin Sheet or directly in the DB.

   FR/AR language toggle is client-side state.
   Menu data is DB-driven via Prisma + /api/menu endpoints.
   Admin Sheet opens from a tiny pencil in the footer.
   Print button in the header triggers window.print() — the print
   CSS in globals.css renders a clean printable menu.
   ============================================================ */

/* WhatsApp deep-link (placeholder number — owner swaps later) */
const WHATSAPP_NUMBER = "212612345678";
const WHATSAPP_MSG_FR = encodeURIComponent(
  "Bonjour Pancakes & Wafflez, je souhaite passer une commande :"
);
const WHATSAPP_MSG_EN = encodeURIComponent(
  "Hello Pancakes & Wafflez, I'd like to place an order:"
);
const INSTAGRAM_URL = "https://www.instagram.com/pancakesandwafflez/";
/* The MAPS_QUERY is the address string Google Maps searches for. It's URL-encoded
   so you can include spaces + commas. To swap for a real client, replace this
   string with their actual street address (the more specific, the better). */
const MAPS_QUERY = encodeURIComponent(
  "Rue Aïn Oulmes, Casablanca 20250, Morocco"
);
/* The MAPS_EMBED_SRC is the URL used inside the iframe — it returns a real
   interactive Google Map (no API key required). It uses the same query as
   the "Open in Google Maps" button so they always match. */
const MAPS_EMBED_SRC = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;

/* Hero / story photos (top-level constants — easy to swap) */
const HERO_PHOTO_URL =
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0fda198e2e9b.jpg";
const STORY_PHOTO_URL =
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f86a2ee9abd7.jpg";

/* ---------- Top header ---------- */
function Header({
  lang,
  setLang,
  t,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translation;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo lockup */}
        <a href="#top" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <Image
            src="/pancakes-wafflez-logo.jpg"
            alt="Pancakes & Wafflez"
            width={52}
            height={52}
            className="h-11 w-11 shrink-0 rounded-full border border-secondary bg-card object-cover shadow-sm sm:h-14 sm:w-14"
          />
          <span className="max-w-32 font-display text-sm font-600 leading-tight text-primary sm:max-w-none sm:text-xl">
            Pancakes <span className="italic text-accent">&amp;</span> Wafflez
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          <a
            href="#story"
            className="font-display text-base text-foreground/80 hover:text-accent transition-colors"
          >
            {t.nav.story}
          </a>
          <a
            href="#menu"
            className="font-display text-base text-foreground/80 hover:text-accent transition-colors"
          >
            {t.nav.menu}
          </a>
          <a
            href="#gallery"
            className="font-display text-base text-foreground/80 hover:text-accent transition-colors"
          >
            {t.nav.gallery}
          </a>
          <a
            href="#findus"
            className="font-display text-base text-foreground/80 hover:text-accent transition-colors"
          >
            {t.nav.findus}
          </a>
        </nav>

        {/* Lang + Order */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LangToggle lang={lang} setLang={setLang} />
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${
              lang === "fr" ? WHATSAPP_MSG_FR : WHATSAPP_MSG_EN
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-500 text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>{t.nav.order}</span>
          </a>
          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
              <path d="M4 7 L20 7" />
              <path d="M4 12 L20 12" />
              <path d="M4 17 L20 17" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background px-4 py-4">
          <nav className="flex flex-col gap-3">
            {[
              ["#story", t.nav.story],
              ["#menu", t.nav.menu],
              ["#gallery", t.nav.gallery],
              ["#findus", t.nav.findus],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="font-display text-lg text-foreground/90 hover:text-accent"
              >
                {label}
              </a>
            ))}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${
                lang === "fr" ? WHATSAPP_MSG_FR : WHATSAPP_MSG_EN
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-500 text-accent-foreground"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>{t.nav.order}</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ---------- Language toggle (FR / EN) ---------- */
function LangToggle({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-500">
      <button
        onClick={() => setLang("fr")}
        className={`rounded-full px-3 py-1 transition-colors ${
          lang === "fr"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-primary"
        }`}
        aria-pressed={lang === "fr"}
      >
        FR
      </button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1 transition-colors ${
          lang === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-primary"
        }`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}

/* ---------- Hero (Scandibakes-style: dark full-bleed, centered giant headline) ---------- */
function Hero({
  t,
  lang,
}: {
  t: Translation;
  lang: Lang;
}) {
  return (
    <section
      id="top"
      className="hero-vintage relative overflow-hidden bg-primary text-primary-foreground print:hidden"
    >
      {/* Centered text block */}
      <div className="mx-auto max-w-3xl px-4 pt-10 text-center sm:px-6 sm:pt-14">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-3 py-1 text-xs font-500 uppercase tracking-wider text-primary-foreground/70">
          <Pin className="h-3.5 w-3.5 text-accent" />
          <span>{t.hero.eyebrow}</span>
        </div>

        <h1 className="font-display text-[2.5rem] leading-[0.96] font-500 sm:text-6xl md:text-7xl">
          <span className="block">{t.hero.title}</span>
          <span className="block italic text-accent">{t.hero.titleAmp}</span>
          <span className="block">{t.hero.title2}</span>
        </h1>

        <p className="mx-auto mt-5 max-w-lg font-sans text-base text-primary-foreground/75 sm:text-lg">
          {t.hero.tagline}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#menu"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground px-5 py-2.5 text-sm font-500 text-primary hover:bg-primary-foreground/90 transition-colors"
          >
            <ForkKnife className="h-4 w-4" />
            <span>{t.hero.cta_primary}</span>
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${
              lang === "fr" ? WHATSAPP_MSG_FR : WHATSAPP_MSG_EN
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-5 py-2.5 text-sm font-500 text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>{t.hero.cta_secondary}</span>
          </a>
        </div>
      </div>

      {/* Big photo flanked by ingredient-style spec boxes, like Scandibakes */}
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-9 sm:px-6 sm:pb-16 sm:pt-12">
        <div className="grid items-center gap-4 sm:grid-cols-[8rem_1fr_8rem] sm:gap-5">
          {/* Left spec box (desktop only) */}
          <div className="hidden rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 p-4 text-xs text-primary-foreground/70 sm:block">
            <div className="mb-2 font-600 uppercase tracking-wide text-primary-foreground/90">
              {lang === "en" ? "Fresh daily" : "Fait maison"}
            </div>
            <ul className="space-y-1.5">
              <li>{lang === "en" ? "Made to order" : "Préparé à la commande"}</li>
              <li>{lang === "en" ? "House batter" : "Pâte maison"}</li>
              <li>{lang === "en" ? "Real maple syrup" : "Vrai sirop d'érable"}</li>
            </ul>
          </div>

          <HeroPhoto lang={lang} />

          {/* Right spec box (desktop only) */}
          <div className="hidden rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 p-4 text-xs text-primary-foreground/70 sm:block">
            <div className="mb-2 font-600 uppercase tracking-wide text-primary-foreground/90">
              {t.hero.hours_chip}
            </div>
            <div className="mb-3">{t.hero.location_chip}</div>
            <div className="mb-2 font-600 uppercase tracking-wide text-primary-foreground/90">
              {lang === "en" ? "Order" : "Commander"}
            </div>
            <div>WhatsApp</div>
          </div>

          {/* Mobile-only chips (spec boxes hidden below sm) */}
          <div className="flex flex-wrap justify-center gap-3 text-xs sm:hidden">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 px-3 py-1 text-primary-foreground/70">
              <Clock className="h-3.5 w-3.5" />
              <span>{t.hero.hours_chip}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 px-3 py-1 text-primary-foreground/70">
              <Pin className="h-3.5 w-3.5" />
              <span>{t.hero.location_chip}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom divider, transitioning into the cream content below */}
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 px-4 pb-5">
        <div className="h-px flex-1 bg-primary-foreground/15" />
        <StarDivider className="h-4 w-4 text-accent" />
        <div className="h-px flex-1 bg-primary-foreground/15" />
      </div>
    </section>
  );
}

/* ---------- Hero photo: large rectangular product shot (Scandibakes-style) ---------- */
function HeroPhoto({ lang }: { lang: Lang }) {
  return (
    <div className="hero-photo-frame relative mx-auto w-full max-w-md">
      <div className="relative aspect-video overflow-hidden rounded-sm border-[4px] border-card shadow-2xl">
        <Image
          src={HERO_PHOTO_URL}
          alt="Stack of fluffy pancakes with maple syrup and butter"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 42rem"
          className="object-cover"
        />
        {/* Subtle warm gradient for legibility + mood */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-20"
          style={{
            background:
              "linear-gradient(180deg, rgba(59,42,31,0.05) 0%, rgba(59,42,31,0.35) 100%)",
          }}
          aria-hidden
        />
      </div>
      <div className="hero-photo-stamp" aria-hidden="true">
        <StarDivider className="h-4 w-4" />
        <span>{lang === "en" ? "Made fresh" : "Fait maison"}</span>
      </div>
      {/* Floating coffee cup badge */}
      <div className="absolute -bottom-3 -right-2 h-11 w-11 rounded-full bg-card border border-border flex items-center justify-center shadow-md animate-float-slow">
        <CoffeeCup className="h-5 w-5 text-accent" />
      </div>
      {/* Floating mint sprig badge */}
      <div
        className="absolute -top-3 -left-2 h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center shadow-md animate-float-slow"
        style={{ animationDelay: "1.5s" }}
      >
        <MintSprig className="h-5 w-5 text-tertiary" />
      </div>
    </div>
  );
}

/* ---------- Story section ---------- */
function Story({
  t,
  settings,
  lang,
}: {
  t: Translation;
  settings: SiteSettingsDTO;
  lang: Lang;
}) {
  const title =
    (lang === "en" ? settings?.storyTitleEn : settings?.storyTitleFr) ||
    t.story.title;
  const body1 =
    (lang === "en" ? settings?.storyBodyEn1 : settings?.storyBodyFr1) ||
    t.story.body_p1;
  const body2 =
    (lang === "en" ? settings?.storyBodyEn2 : settings?.storyBodyFr2) ||
    t.story.body_p2;
  const photoUrl = settings?.storyPhotoUrl || STORY_PHOTO_URL;

  return (
    <section id="story" className="border-b border-border/60 py-12 sm:py-16 print:hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section label */}
        <div className="mb-3 flex items-center gap-3 text-accent">
          <Whisk className="h-5 w-5" />
          <span className="text-xs font-600 uppercase tracking-widest">
            {t.story.label}
          </span>
        </div>

        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          {/* Left: title + body */}
          <div className="md:col-span-7">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-500 text-primary leading-tight">
              {title}
            </h2>
            <p className="mt-6 text-base text-foreground/80 leading-relaxed sm:text-lg">
              {body1}
            </p>
            <p className="mt-4 text-base text-foreground/80 leading-relaxed sm:text-lg">
              {body2}
            </p>

            {/* Stats row */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { num: "01", label: t.story.stat_1, sub: t.story.stat_1_sub },
                { num: "02", label: t.story.stat_2, sub: t.story.stat_2_sub },
                { num: "03", label: t.story.stat_3, sub: t.story.stat_3_sub },
              ].map((s) => (
                <div key={s.num} className="paper-card rounded-md bg-card p-3 sm:p-4">
                  <div className="num-vintage text-2xl text-accent sm:text-3xl">{s.num}</div>
                  <div className="mt-1 font-display text-sm font-600 text-primary sm:text-base">
                    {s.label}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Real bakery interior photo with paper-frame */}
          <div className="md:col-span-5">
            <div className="relative">
              <div className="story-photo-mat paper-card overflow-hidden rounded-md border border-border bg-card p-2 sm:p-3 rotate-[-1deg]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                  <Image
                    src={photoUrl}
                    alt="Cozy bakery cafe interior with morning light"
                    fill
                    sizes="(max-width: 768px) 100vw, 28rem"
                    className="object-cover"
                    unoptimized={photoUrl.startsWith("data:")}
                  />
                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-10"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(245,235,220,0) 50%, rgba(59,42,31,0.4) 100%)",
                    }}
                    aria-hidden
                  />
                </div>
                {/* Caption */}
                <p className="mt-2 px-2 text-center text-xs italic text-muted-foreground">
                  {t.story.caption}
                </p>
              </div>
              {/* Decorative olive branch overlay */}
              <OliveBranch className="absolute -top-2 -right-2 h-10 w-10 text-tertiary/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Menu section (DB-driven) ---------- */
function Menu({
  t,
  items,
  categories,
  lang,
}: {
  t: Translation;
  items: MenuItemDTO[];
  categories: MenuCategoryDTO[];
  lang: Lang;
}) {
  // Group items by category (DB-driven, not hardcoded). For each category in
  // displayOrder, find its items sorted by `order`.
  const grouped = categories.map((cat) => ({
    cat: cat.key,
    label: lang === "en" ? cat.labelEn : cat.labelFr,
    items: items
      .filter((i) => i.category === cat.key)
      .sort((a, b) => a.order - b.order),
  }));

  // Pick an icon per category by key — fallback to ForkKnife for unknown keys.
  const iconFor = (key: string): React.ReactNode => {
    switch (key) {
      case "pancakes":
        return <PancakeStack className="h-6 w-6" />;
      case "waffles":
        return <Waffle className="h-6 w-6" />;
      case "brunch":
      case "drinks":
        return <CoffeeCup className="h-6 w-6" />;
      case "bakery":
        return <Wheat className="h-6 w-6" />;
      case "add-ons":
      case "toppings":
        return <Whisk className="h-6 w-6" />;
      default:
        // For owner-added categories (e.g. "smoothies", "salads") use a neutral icon
        return <ForkKnife className="h-6 w-6" />;
    }
  };

  return (
    <section
      id="menu"
      className="print-menu border-b border-border/60 bg-card/30 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-3 flex items-center gap-3 text-accent">
          <ForkKnife className="h-5 w-5" />
          <span className="text-xs font-600 uppercase tracking-widest">
            {t.menu.label}
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-500 text-primary leading-tight max-w-2xl">
          {t.menu.title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {t.menu.subtitle}
        </p>

        {/* Center decorative star divider */}
        <div className="my-10 flex items-center justify-center gap-3 no-print" data-no-print>
          <div className="divider-dotted w-24" />
          <ZelligeStar className="h-5 w-5 text-accent/70" />
          <div className="divider-dotted w-24" />
        </div>

        {/* Menu groups — one horizontal drag-scroll row per DB category */}
        {grouped.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">
            {lang === "en" ? "Menu coming soon." : "Le menu sera bientôt disponible."}
          </p>
        ) : (
          <div className="space-y-11">
            {grouped.map((g) => (
              <div key={g.cat} className="print-category">
                {/* Category header */}
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-accent">{iconFor(g.cat)}</span>
                    <h3 className="font-display text-2xl font-600 text-primary sm:text-3xl">
                      {g.label}
                    </h3>
                  </div>
                  {g.items.length > 2 && (
                    <span
                      className="hidden shrink-0 items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-[10px] font-600 uppercase tracking-wide text-muted-foreground sm:inline-flex no-print"
                      data-no-print
                    >
                      {lang === "en" ? "Drag" : "Glisser"}
                      <span aria-hidden>→</span>
                    </span>
                  )}
                </div>

                {g.cat === "bakery" && (
                  <p className="mb-4 text-sm text-muted-foreground">
                    {lang === "en"
                      ? "Bakery orders require a deposit. House specials need 24 hours' notice for afternoon pickup."
                      : "Les commandes pâtissières nécessitent un acompte. Les spécialités maison se commandent 24 h à l'avance pour un retrait l'après-midi."}
                  </p>
                )}

                {g.items.length === 0 ? (
                  <p className="text-xs italic text-muted-foreground">
                    (Pas encore d'items dans cette catégorie — ouvrez l'admin pour en ajouter.)
                  </p>
                ) : (
                  g.cat === "add-ons" || g.cat === "toppings" ? (
                    <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                      {g.items.map((item) => (
                        <li key={item.id} className="flex items-baseline gap-2 border-b border-border/50 pb-2">
                          <span className="font-display text-sm text-primary sm:text-base">
                            {lang === "en" ? item.nameEn : item.nameFr}
                          </span>
                          <span className="divider-dotted min-w-4 flex-1" />
                          <span className="num-vintage text-sm text-accent">
                            {item.price} MAD
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                  <>
                    {/* Horizontal drag-scroll cards (screen) */}
                    <div
                      className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 no-print"
                      data-no-print
                    >
                      {g.items.map((it) => (
                        <MenuCard key={it.id} item={it} lang={lang} />
                      ))}
                    </div>
                    {/* Plain vertical list for print only */}
                    <ul className="mt-3 hidden space-y-4 print:block">
                      {g.items.map((it) => (
                        <MenuRow key={it.id} item={it} lang={lang} />
                      ))}
                    </ul>
                  </>
                  )
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footnote */}
        <p className="mt-10 text-center text-xs italic text-muted-foreground no-print" data-no-print>
          {t.menu.note}
        </p>
      </div>
    </section>
  );
}

/* ---------- Menu card: square photo + name + price, for the horizontal scroll row ---------- */
function MenuCard({ item, lang }: { item: MenuItemDTO; lang: Lang }) {
  const name = lang === "en" ? item.nameEn : item.nameFr;
  const desc = lang === "en" ? item.descEn : item.descFr;
  return (
    <div className="menu-photo-card group w-36 shrink-0 snap-start sm:w-44">
      <div className="relative aspect-square overflow-hidden rounded-sm border border-border bg-card p-1">
        {item.photoUrl ? (
          <Image
            src={item.photoUrl}
            alt={name}
            fill
            sizes="192px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            unoptimized={item.photoUrl.startsWith("data:")}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ForkKnife className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-display text-sm font-500 leading-tight text-primary sm:text-base">
            {name}
          </div>
          {desc && (
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {desc}
            </div>
          )}
        </div>
        <div className="num-vintage shrink-0 text-sm text-accent sm:text-base">
          {item.price}
          <span className="ml-0.5 text-[10px] font-400 text-muted-foreground">
            MAD
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Single menu row with photo thumbnail (used for print layout) ---------- */
// Map photoSize → pixel size of the thumbnail in the menu row
const PHOTO_SIZE_PX: Record<PhotoSize, string> = {
  small: "h-12 w-12 sm:h-14 sm:w-14",
  medium: "h-16 w-16 sm:h-20 sm:w-20",
  large: "h-20 w-20 sm:h-24 sm:w-24",
  feature: "h-20 w-20 sm:h-24 sm:w-24", // feature behaves like large in the menu row
};

function MenuRow({ item, lang }: { item: MenuItemDTO; lang: Lang }) {
  const name = lang === "en" ? item.nameEn : item.nameFr;
  const desc = lang === "en" ? item.descEn : item.descFr;
  const thumbClass = PHOTO_SIZE_PX[item.photoSize] ?? PHOTO_SIZE_PX.small;
  return (
    <li className="flex items-baseline gap-3">
      {/* Photo thumbnail (if any) */}
      {item.photoUrl && (
        <div className={`relative ${thumbClass} shrink-0 overflow-hidden rounded-md border border-border bg-card no-print`} data-no-print>
          <Image
            src={item.photoUrl}
            alt={name}
            fill
            sizes="56px"
            className="object-cover"
            unoptimized={item.photoUrl.startsWith("data:")}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-display text-base font-500 text-primary sm:text-lg">
          {name}
        </div>
        <div className="text-sm text-muted-foreground">
          {desc}
        </div>
      </div>
      {/* Dotted leader */}
      <div className="flex-1 self-end hidden sm:block">
        <div className="divider-dotted mb-1.5" />
      </div>
      {/* Price */}
      <div className="num-vintage text-lg text-accent sm:text-xl whitespace-nowrap">
        {item.price}
        <span className="ml-1 text-xs font-400 text-muted-foreground">
          MAD
        </span>
      </div>
    </li>
  );
}

/* ---------- Gallery section (real photos) ---------- */
function Gallery({
  t,
  items,
  lang,
}: {
  t: Translation;
  items: MenuItemDTO[];
  lang: Lang;
}) {
  // Prioritize "feature" + "large" photos in the gallery, then medium, then small.
  // Show up to 6 tiles. Items with photoSize=feature get a bigger tile.
  const priorityOrder: Record<PhotoSize, number> = {
    feature: 0,
    large: 1,
    medium: 2,
    small: 3,
  };
  const tiles = [...items]
    .filter((i) => i.photoUrl && i.showInGallery)
    .sort(
      (a, b) =>
        (priorityOrder[a.photoSize] ?? 4) - (priorityOrder[b.photoSize] ?? 4)
    )
    .slice(0, 6);

  // Span per photoSize: feature = 2×2, large = 2×1, medium/small = 1×1
  const spanFor = (size: PhotoSize): string => {
    switch (size) {
      case "feature":
        return "col-span-2";
      case "large":
        return "col-span-2";
      case "medium":
      case "small":
      default:
        return "col-span-1";
    }
  };

  return (
    <section id="gallery" className="border-b border-border/60 py-12 sm:py-16 print:hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-3 flex items-center gap-3 text-accent">
          <MintSprig className="h-5 w-5" />
          <span className="text-xs font-600 uppercase tracking-widest">
            {t.gallery.label}
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-500 text-primary leading-tight">
          {t.gallery.title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {t.gallery.subtitle}
        </p>

        {/* Decorative divider, matching the Menu section */}
        <div className="my-10 flex items-center justify-center gap-3">
          <div className="divider-dotted w-24" />
          <ZelligeStar className="h-5 w-5 text-accent/70" />
          <div className="divider-dotted w-24" />
        </div>

        {/* Editorial grid — span driven by each item's photoSize */}
        {tiles.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 auto-rows-[132px] gap-3 sm:auto-rows-[152px] sm:gap-4 md:grid-cols-4 md:auto-rows-[170px] lg:grid-cols-6">
            {tiles.map((item) => {
            const name = lang === "en" ? item.nameEn : item.nameFr;
            const span = spanFor(item.photoSize);
            return (
              <figure
                key={item.id}
                className={`paper-card group relative min-h-0 overflow-hidden rounded-md border border-border bg-card ${span}`}
              >
                {item.photoUrl ? (
                  <Image
                    src={item.photoUrl}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized={item.photoUrl.startsWith("data:")}
                  />
                ) : (
                  <div className="absolute inset-0 h-full w-full bg-muted" />
                )}
                {/* Warm vintage overlay */}
                <div
                  className="absolute inset-0 mix-blend-multiply opacity-20 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(59,42,31,0.6) 0%, rgba(245,235,220,0) 60%)",
                  }}
                  aria-hidden
                />
                <figcaption className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 bg-background/85 backdrop-blur-sm px-2.5 py-1 rounded text-xs">
                  <span className="font-display font-500 text-primary truncate">
                    {name}
                  </span>
                  <span className="num-vintage text-accent">
                    {item.price}
                    <span className="ml-1 text-[10px] text-muted-foreground">MAD</span>
                  </span>
                </figcaption>
              </figure>
            );
            })}
          </div>
        ) : (
          <p className="mt-8 text-sm italic text-muted-foreground">
            {lang === "en" ? "Gallery photos will appear here soon." : "Les photos de la galerie apparaîtront ici bientôt."}
          </p>
        )}
      </div>
    </section>
  );
}

/* ---------- Find Us section ---------- */
function FindUs({ t }: { t: Translation }) {
  return (
    <section id="findus" className="border-b border-border/60 py-12 sm:py-16 print:hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-3 flex items-center gap-3 text-accent">
          <Pin className="h-5 w-5" />
          <span className="text-xs font-600 uppercase tracking-widest">
            {t.findus.label}
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-500 text-primary leading-tight max-w-2xl">
          {t.findus.title}
        </h2>

        {/* Decorative divider, matching the Menu section */}
        <div className="my-10 flex items-center justify-center gap-3">
          <div className="divider-dotted w-24" />
          <ZelligeStar className="h-5 w-5 text-accent/70" />
          <div className="divider-dotted w-24" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Left: Info card */}
          <div className="paper-card rounded-md border border-border bg-card p-6 sm:p-8">
            {/* Address */}
            <div className="mb-6">
              <div className="mb-1 flex items-center gap-2 text-xs font-600 uppercase tracking-wider text-muted-foreground">
                <Pin className="h-4 w-4 text-accent" />
                <span>{t.findus.address_label}</span>
              </div>
              <p className="font-display text-lg text-primary sm:text-xl">
                {t.findus.address}
              </p>
            </div>
            <div className="divider-dotted my-6" />
            {/* Hours */}
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2 text-xs font-600 uppercase tracking-wider text-muted-foreground">
                <Clock className="h-4 w-4 text-accent" />
                <span>{t.findus.hours_label}</span>
              </div>
              <ul className="space-y-1 font-display text-base text-primary">
                {t.findus.hours_lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="divider-dotted my-6" />
            {/* Contact */}
            <div className="mb-6">
              <div className="mb-1 flex items-center gap-2 text-xs font-600 uppercase tracking-wider text-muted-foreground">
                <span className="h-4 w-4 inline-flex items-center justify-center text-accent">✆</span>
                <span>{t.findus.contact_label}</span>
              </div>
              <a
                href={`tel:${t.findus.phone.replace(/\s/g, "")}`}
                className="font-display text-lg text-primary hover:text-accent transition-colors"
                dir="ltr"
              >
                {t.findus.phone}
              </a>
            </div>
            <div className="divider-dotted my-6" />
            {/* Instagram */}
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-600 uppercase tracking-wider text-muted-foreground">
                <InstagramIcon className="h-4 w-4 text-accent" />
                <span>{t.findus.instagram_label}</span>
              </div>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-lg text-primary hover:text-accent transition-colors"
                dir="ltr"
              >
                {t.findus.instagram_handle}
              </a>
            </div>
          </div>

          {/* Right: Real Google Maps embed + CTA */}
          <div className="flex flex-col">
            <div className="paper-card relative overflow-hidden rounded-md border border-border bg-card">
              {/* Real Google Maps iframe embed — no API key required.
                  Uses the same MAPS_QUERY as the "Open in Google Maps" button
                  so they always match. */}
              <iframe
                src={MAPS_EMBED_SRC}
                title="Map showing the bakery location"
                className="w-full aspect-[4/3] sm:aspect-[5/4] md:aspect-[4/5]"
                style={{ border: 0, minHeight: "320px" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-500 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Pin className="h-4 w-4" />
              <span>{t.findus.map_cta}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- WhatsApp CTA banner ---------- */
function CtaBanner({
  t,
  lang,
}: {
  t: Translation;
  lang: Lang;
}) {
  return (
    <section className="border-b border-border/60 bg-primary py-16 text-primary-foreground sm:py-20 print:hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mb-2 flex items-center gap-2 text-sm uppercase tracking-widest text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>{t.cta.eyebrow}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-500 leading-tight">
              {t.cta.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm text-primary-foreground/80 sm:text-base">
              {t.cta.body}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${
                  lang === "fr" ? WHATSAPP_MSG_FR : WHATSAPP_MSG_EN
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-600 text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                <WhatsAppIcon className="h-5 w-5" />
                <span>{t.cta.button}</span>
              </a>
              <span className="self-center text-xs text-primary-foreground/60">
                {t.cta.note}
              </span>
            </div>
          </div>

          {/* Decorative illustration */}
          <div className="md:col-span-5">
            <CtaIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaIllustration() {
  return (
    <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto opacity-90">
      <rect x="60" y="20" width="160" height="180" rx="14" fill="#FBF4E6" stroke="#F5EBDC" strokeWidth="2" />
      <rect x="68" y="36" width="144" height="140" rx="6" fill="#E8D5B5" />
      <circle cx="140" cy="90" r="30" fill="#9CA882" />
      <path
        d="M 128 84 C 128 80, 132 78, 136 78 C 142 78, 146 82, 146 86 L 146 90 C 146 92, 144 94, 142 94 L 138 94 L 132 100 L 132 94 C 130 94, 128 92, 128 90 Z"
        fill="#FBF4E6"
      />
      <circle cx="132" cy="86" r="1.5" fill="#9CA882" />
      <circle cx="138" cy="86" r="1.5" fill="#9CA882" />
      <path d="M 90 130 L 130 130 L 130 150 L 100 150 L 90 158 L 90 130 Z" fill="#FBF4E6" stroke="#F5EBDC" strokeWidth="1" />
      <path d="M 100 138 L 120 138" stroke="#9CA882" strokeWidth="2" />
      <path d="M 100 144 L 115 144" stroke="#9CA882" strokeWidth="2" />
      <path d="M 150 138 L 195 138 L 195 158 L 165 158 L 155 166 L 155 138 Z" fill="#C44A3B" />
      <path d="M 162 146 L 188 146" stroke="#FBF4E6" strokeWidth="2" />
      <path d="M 162 152 L 180 152" stroke="#FBF4E6" strokeWidth="2" />
      <circle cx="140" cy="190" r="6" fill="none" stroke="#F5EBDC" strokeWidth="2" />
    </svg>
  );
}

/* ---------- Footer ---------- */
function Footer({
  t,
}: {
  t: Translation;
}) {
  return (
    <footer className="bg-background print:hidden">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        {/* Top decorative motif */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <div className="divider-dotted w-24" />
          <ZelligeStar className="h-5 w-5 text-accent/70" />
          <OliveBranch className="h-6 w-6 text-tertiary" />
          <ZelligeStar className="h-5 w-5 text-accent/70" />
          <div className="divider-dotted w-24" />
        </div>

        {/* Top grid */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/pancakes-wafflez-logo.jpg"
                alt=""
                width={48}
                height={48}
                className="h-10 w-10 rounded-full border border-secondary bg-card object-cover"
              />
              <span className="font-display text-lg font-600 text-primary">
                Pancakes <span className="italic text-muted-foreground">&amp;</span> Wafflez
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{t.footer.tagline}</p>
          </div>

          {/* Address */}
          <div>
            <div className="mb-2 text-xs font-600 uppercase tracking-wider text-accent">
              {t.footer.col1_title}
            </div>
            <p className="text-sm text-foreground/80">{t.footer.col1_line1}</p>
            <p className="text-sm text-foreground/80">{t.footer.col1_line2}</p>
          </div>

          {/* Hours */}
          <div>
            <div className="mb-2 text-xs font-600 uppercase tracking-wider text-accent">
              {t.footer.col2_title}
            </div>
            <p className="text-sm text-foreground/80">{t.footer.col2_line1}</p>
            <p className="text-sm text-foreground/80">{t.footer.col2_line2}</p>
          </div>

          {/* Instagram */}
          <div>
            <div className="mb-2 text-xs font-600 uppercase tracking-wider text-accent">
              {t.footer.col3_title}
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-accent transition-colors"
              dir="ltr"
            >
              <InstagramIcon className="h-4 w-4" />
              <span>{t.footer.col3_line2}</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Pancakes &amp; Wafflez.</span>
            <span>{t.footer.rights}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <span>{t.footer.made_with}</span>
              <Heart className="h-3.5 w-3.5 text-accent" />
              <span>{t.footer.in_casa}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   Main page
   ============================================================ */
export default function Page() {
  const [lang, setLang] = React.useState<Lang>("fr");
  const t = strings[lang];
  const { items, categories, isLoadingItems } = useMenu();
  const { settings } = useSettings();

  // Sync html lang attribute on change (no more dir=rtl — EN is LTR like FR)
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = t.meta.htmlLang;
    }
  }, [lang, t.meta.htmlLang]);

  return (
    <div className="flex min-h-screen flex-col" data-lang={lang}>
      <Header lang={lang} setLang={setLang} t={t} />
      <main className="flex-1">
        <Hero t={t} lang={lang} />
        <Story t={t} settings={settings} lang={lang} />
        <Menu t={t} items={items} categories={categories} lang={lang} />
        <Gallery t={t} items={items} lang={lang} />
        <FindUs t={t} />
        <CtaBanner t={t} lang={lang} />
      </main>
      <Footer t={t} />

      {/* Tiny loading veil while DB is fetching on first paint */}
      {isLoadingItems && items.length === 0 && (
        <div className="fixed bottom-3 right-3 z-30 rounded-full bg-card border border-border px-3 py-1.5 text-xs text-muted-foreground shadow-md print:hidden">
          Chargement du menu…
        </div>
      )}
    </div>
  );
}