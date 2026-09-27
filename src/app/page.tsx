"use client";

import * as React from "react";
import Image from "next/image";
import {
  strings,
  type Lang,
  type Translation,
} from "@/components/bakery/strings";
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
import {
  CartDock,
  OrderProvider,
  ProductCustomizer,
  useCart,
  type CartLine,
} from "@/components/bakery/order-cart";

/* ============================================================
   Pancakes & Wafflez — single-page vintage bakery site
   ------------------------------------------------------------
   FR / EN only.
   Menu data is DB-driven through Prisma + /api/menu.
  Story content is part of the bilingual site copy.
   ============================================================ */

/* ---------- Business configuration ---------- */

/*
 * Publicly listed restaurant number used for the demo.
 * Before handing the site to the restaurant, confirm that this
 * exact number is their active WhatsApp Business number.
 */
const WHATSAPP_NUMBER = "212520335347";

const WHATSAPP_MSG_FR =
  "Bonjour Pancakes & Wafflez, je souhaite passer une commande :";

const WHATSAPP_MSG_EN = "Hello Pancakes & Wafflez, I'd like to place an order:";

const INSTAGRAM_URL =
  "https://www.instagram.com/pancakesandwafflez/";

const MAPS_QUERY = encodeURIComponent(
  "Rue Aïn Oulmes, Casablanca 20250, Morocco"
);

const MAPS_EMBED_SRC =
  `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;

const HERO_PHOTO_URL =
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0fda198e2e9b.jpg";

const STORY_PHOTO_URL =
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f86a2ee9abd7.jpg";

/* ---------- Small helpers ---------- */

function whatsappHref(lang: Lang, message?: string) {
  const defaultMessage = lang === "fr" ? WHATSAPP_MSG_FR : WHATSAPP_MSG_EN;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message ?? defaultMessage
  )}`;
}

function whatsappOrderHref(
  lang: Lang,
  lines: CartLine[],
  note: string,
  name: string,
  t: Translation
) {
  const total = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0
  );
  const itemLines = lines
    .map((line) => {
      const name = lang === "en" ? line.nameEn : line.nameFr;
      const extras = line.extras
        .map((extra) => `   + ${lang === "en" ? extra.nameEn : extra.nameFr}`)
        .join("\n");
      const lineTotal = line.unitPrice * line.quantity;
      return `${name} ×${line.quantity} — ${lineTotal} MAD${
        extras ? `\n${extras}` : ""
      }`;
    })
    .join("\n\n");
  const nameBlock = name.trim() ? `\n\nNom : ${name.trim()}` : "";
  const noteBlock = note.trim()
    ? `\n\n${t.ordering.whatsappNote}:\n${note.trim()}`
    : "";
  const message = `${t.ordering.whatsappGreeting}\n\n${itemLines}\n\n${t.ordering.total} : ${total} MAD${nameBlock}${noteBlock}\n\n${t.ordering.whatsappThanks}`;
  return whatsappHref(lang, message);
}

/* ---------- Header ---------- */

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

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}
        <a
          href="#top"
          onClick={closeMenu}
          className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          aria-label="Pancakes & Wafflez"
        >
          <Image
            src="/pancakes-wafflez-logo.jpg"
            alt="Pancakes & Wafflez"
            width={52}
            height={52}
            className="h-11 w-11 shrink-0 rounded-full border border-secondary bg-card object-cover shadow-sm sm:h-14 sm:w-14"
          />
          <span className="max-w-[8rem] font-display text-sm font-600 leading-tight text-primary sm:max-w-none sm:text-xl">
            Pancakes <span className="italic text-accent">&amp;</span> Wafflez
          </span>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          <a
            href="#story"
            className="font-display text-base text-foreground/80 transition-colors hover:text-accent"
          >
            {t.nav.story}
          </a>
          <a
            href="#menu"
            className="font-display text-base text-foreground/80 transition-colors hover:text-accent"
          >
            {t.nav.menu}
          </a>
          <a
            href="#gallery"
            className="font-display text-base text-foreground/80 transition-colors hover:text-accent"
          >
            {t.nav.gallery}
          </a>
          <a
            href="#findus"
            className="font-display text-base text-foreground/80 transition-colors hover:text-accent"
          >
            {t.nav.findus}
          </a>
        </nav>

        {/* Language + order + mobile menu */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <LangToggle lang={lang} setLang={setLang} />

          {/* Order button stays accessible on mobile.
              On very narrow screens it becomes icon-only. */}
          <a
            href={whatsappHref(lang)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.order}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-2 text-sm font-500 text-accent-foreground transition-colors hover:bg-accent/90 sm:px-4"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0" />
            <span className="hidden min-[390px]:inline">{t.nav.order}</span>
          </a>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary transition-colors hover:bg-muted md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={
              open
                ? lang === "en"
                  ? "Close menu"
                  : "Fermer le menu"
                : lang === "en"
                  ? "Open menu"
                  : "Ouvrir le menu"
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="M6 6 L18 18" />
                  <path d="M18 6 L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7 L20 7" />
                  <path d="M4 12 L20 12" />
                  <path d="M4 17 L20 17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          id="mobile-navigation"
          className="border-t border-border/60 bg-background px-4 py-4 md:hidden"
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-3" aria-label="Mobile navigation">
            {[
              ["#story", t.nav.story],
              ["#menu", t.nav.menu],
              ["#gallery", t.nav.gallery],
              ["#findus", t.nav.findus],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                className="font-display text-lg text-foreground/90 transition-colors hover:text-accent"
              >
                {label}
              </a>
            ))}

            <a
              href={whatsappHref(lang)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-500 text-accent-foreground"
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

/* ---------- Language toggle ---------- */

function LangToggle({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-500"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang("fr")}
        className={`rounded-full px-2.5 py-1.5 transition-colors sm:px-3 ${
          lang === "fr"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-primary"
        }`}
        aria-pressed={lang === "fr"}
        aria-label="Français"
      >
        FR
      </button>

      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-full px-2.5 py-1.5 transition-colors sm:px-3 ${
          lang === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-primary"
        }`}
        aria-pressed={lang === "en"}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}

/* ---------- Hero ---------- */

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
      className="hero-vintage relative overflow-hidden bg-primary text-primary-foreground"
    >
      <div className="mx-auto max-w-3xl px-4 pt-10 text-center sm:px-6 sm:pt-14">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-3 py-1 text-xs font-500 uppercase tracking-wider text-primary-foreground/70">
          <Pin className="h-3.5 w-3.5 text-accent" />
          <span>{t.hero.eyebrow}</span>
        </div>

        <h1 className="font-display text-[2.5rem] font-500 leading-[0.96] sm:text-6xl md:text-7xl">
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
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground px-5 py-2.5 text-sm font-500 text-primary transition-colors hover:bg-primary-foreground/90"
          >
            <ForkKnife className="h-4 w-4" />
            <span>{t.hero.cta_primary}</span>
          </a>

          <a
            href={whatsappHref(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-5 py-2.5 text-sm font-500 text-accent-foreground transition-colors hover:bg-accent/90"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>{t.hero.cta_secondary}</span>
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-12 pt-9 sm:px-6 sm:pb-16 sm:pt-12">
        <div className="grid items-center gap-4 sm:grid-cols-[8rem_1fr_8rem] sm:gap-5">
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

      <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 px-4 pb-5">
        <div className="h-px flex-1 bg-primary-foreground/15" />
        <StarDivider className="h-4 w-4 text-accent" />
        <div className="h-px flex-1 bg-primary-foreground/15" />
      </div>
    </section>
  );
}

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

      <div className="absolute -bottom-3 -right-2 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-md animate-float-slow">
        <CoffeeCup className="h-5 w-5 text-accent" />
      </div>

      <div
        className="absolute -left-2 -top-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-md animate-float-slow"
        style={{ animationDelay: "1.5s" }}
      >
        <MintSprig className="h-5 w-5 text-tertiary" />
      </div>
    </div>
  );
}

/* ---------- Story ---------- */

function Story({
  t,
}: {
  t: Translation;
}) {
  return (
    <section
      id="story"
      className="border-b border-border/60 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-3 flex items-center gap-3 text-accent">
          <Whisk className="h-5 w-5" />
          <span className="text-xs font-600 uppercase tracking-widest">
            {t.story.label}
          </span>
        </div>

        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <h2 className="font-display text-3xl font-500 leading-tight text-primary sm:text-4xl md:text-5xl">
              {t.story.title}
            </h2>

            <p className="mt-6 text-base leading-relaxed text-foreground/80 sm:text-lg">
              {t.story.body_p1}
            </p>

            <p className="mt-4 text-base leading-relaxed text-foreground/80 sm:text-lg">
              {t.story.body_p2}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { num: "01", label: t.story.stat_1, sub: t.story.stat_1_sub },
                { num: "02", label: t.story.stat_2, sub: t.story.stat_2_sub },
                { num: "03", label: t.story.stat_3, sub: t.story.stat_3_sub },
              ].map((stat) => (
                <div
                  key={stat.num}
                  className="paper-card rounded-md bg-card p-3 sm:p-4"
                >
                  <div className="num-vintage text-2xl text-accent sm:text-3xl">
                    {stat.num}
                  </div>
                  <div className="mt-1 font-display text-sm font-600 text-primary sm:text-base">
                    {stat.label}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative">
              <div className="story-photo-mat paper-card overflow-hidden rounded-md border border-border bg-card p-2 rotate-[-1deg] sm:p-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                  <Image
                    src={STORY_PHOTO_URL}
                    alt="Cozy bakery cafe interior with morning light"
                    fill
                    sizes="(max-width: 768px) 100vw, 28rem"
                    className="object-cover"
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

                <p className="mt-2 px-2 text-center text-xs italic text-muted-foreground">
                  {t.story.caption}
                </p>
              </div>

              <OliveBranch className="absolute -right-2 -top-2 h-10 w-10 text-tertiary/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Menu ---------- */

function Menu({
  t,
  items,
  categories,
  extras,
  lang,
}: {
  t: Translation;
  items: MenuItemDTO[];
  categories: MenuCategoryDTO[];
  extras: MenuItemDTO[];
  lang: Lang;
}) {
  const [selectedCategoryKey, setSelectedCategoryKey] = React.useState<string | null>(null);
  const grouped = categories
    .filter((category) => !["add-ons", "toppings"].includes(category.key))
    .map((category) => ({
    cat: category.key,
    label: lang === "en" ? category.labelEn : category.labelFr,
    items: items
      .filter((item) => item.category === category.key)
      .sort((a, b) => a.order - b.order),
  }));

  React.useEffect(() => {
    if (
      grouped.length > 0 &&
      !grouped.some((group) => group.cat === selectedCategoryKey)
    ) {
      setSelectedCategoryKey(grouped[0].cat);
    }
  }, [grouped, selectedCategoryKey]);

  const selectedGroup =
    grouped.find((group) => group.cat === selectedCategoryKey) ?? grouped[0];

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
      default:
        return <ForkKnife className="h-6 w-6" />;
    }
  };

  return (
    <section
      id="menu"
      className="border-b border-border/60 bg-card/30 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-3 flex items-center gap-3 text-accent">
          <ForkKnife className="h-5 w-5" />
          <span className="text-xs font-600 uppercase tracking-widest">
            {t.menu.label}
          </span>
        </div>

        <h2 className="max-w-2xl font-display text-3xl font-500 leading-tight text-primary sm:text-4xl md:text-5xl">
          {t.menu.title}
        </h2>

        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {t.menu.subtitle}
        </p>

        <div
          className="my-10 flex items-center justify-center gap-3"
        >
          <div className="divider-dotted w-24" />
          <ZelligeStar className="h-5 w-5 text-accent/70" />
          <div className="divider-dotted w-24" />
        </div>

        {grouped.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">
            {lang === "en"
              ? "Menu coming soon."
              : "Le menu sera bientôt disponible."}
          </p>
        ) : (
          <div>
            <div
              className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:justify-center sm:px-0"
              role="tablist"
              aria-label={lang === "en" ? "Menu categories" : "Catégories du menu"}
            >
              {grouped.map((group) => {
                const isSelected = group.cat === selectedGroup?.cat;
                return (
                  <button
                    key={group.cat}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedCategoryKey(group.cat)}
                    className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-500 transition-colors ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-primary hover:border-primary hover:bg-secondary"
                    }`}
                  >
                    {iconFor(group.cat)}
                    <span>{group.label}</span>
                  </button>
                );
              })}
            </div>

            {selectedGroup && (
              <div>
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 text-accent">
                      {iconFor(selectedGroup.cat)}
                    </span>
                    <h3 className="font-display text-2xl font-600 text-primary sm:text-3xl">
                      {selectedGroup.label}
                    </h3>
                  </div>

                  {selectedGroup.items.length > 2 && (
                    <span className="hidden shrink-0 items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-[10px] font-600 uppercase tracking-wide text-muted-foreground sm:inline-flex">
                      {lang === "en" ? "Drag" : "Glisser"}
                      <span aria-hidden>→</span>
                    </span>
                  )}
                </div>

                {selectedGroup.cat === "bakery" && (
                  <p className="mb-4 text-sm text-muted-foreground">
                    {lang === "en"
                      ? "Bakery orders require a deposit. House specials need 24 hours' notice for afternoon pickup."
                      : "Les commandes pâtissières nécessitent un acompte. Les spécialités maison se commandent 24 h à l'avance pour un retrait l'après-midi."}
                  </p>
                )}

                {selectedGroup.items.length === 0 ? (
                  <p className="text-xs italic text-muted-foreground">
                    {t.ui.emptyCategory}
                  </p>
                ) : (
                  <>
                    <div
                      className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
                    >
                      {selectedGroup.items.map((item) => (
                        <MenuCard
                          key={item.id}
                          item={item}
                          extras={extras}
                          lang={lang}
                          t={t}
                        />
                      ))}
                    </div>

                  </>
                )}
              </div>
            )}
          </div>
        )}

        <p
          className="mt-10 text-center text-xs italic text-muted-foreground"
        >
          {t.menu.note}
        </p>
      </div>
    </section>
  );
}

function MenuCard({
  item,
  extras,
  lang,
  t,
}: {
  item: MenuItemDTO;
  extras: MenuItemDTO[];
  lang: Lang;
  t: Translation;
}) {
  const name = lang === "en" ? item.nameEn : item.nameFr;
  const desc = lang === "en" ? item.descEn : item.descFr;

  return (
    <article className="menu-photo-card group flex w-40 shrink-0 snap-start flex-col sm:w-44">
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

      <div className="mt-2 flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
          <div className="font-display text-sm font-500 leading-tight text-primary sm:text-base">
            {name}
          </div>

          {desc && (
            <div className="mt-0.5 line-clamp-2 min-h-8 text-xs text-muted-foreground">
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
        <ProductCustomizer item={item} extras={extras} lang={lang} t={t} />
      </div>
    </article>
  );
}

/* ---------- Gallery ---------- */

function Gallery({
  t,
  items,
  lang,
}: {
  t: Translation;
  items: MenuItemDTO[];
  lang: Lang;
}) {
  const priorityOrder: Record<PhotoSize, number> = {
    feature: 0,
    large: 1,
    medium: 2,
    small: 3,
  };

  const tiles = [...items]
    .filter((item) => item.photoUrl && item.showInGallery)
    .sort(
      (a, b) =>
        (priorityOrder[a.photoSize] ?? 4) -
        (priorityOrder[b.photoSize] ?? 4)
    )
    .slice(0, 6);

  const spanFor = (size: PhotoSize): string => {
    switch (size) {
      case "feature":
      case "large":
        return "col-span-2";
      case "medium":
      case "small":
      default:
        return "col-span-1";
    }
  };

  return (
    <section
      id="gallery"
      className="border-b border-border/60 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-3 flex items-center gap-3 text-accent">
          <MintSprig className="h-5 w-5" />
          <span className="text-xs font-600 uppercase tracking-widest">
            {t.gallery.label}
          </span>
        </div>

        <h2 className="font-display text-3xl font-500 leading-tight text-primary sm:text-4xl md:text-5xl">
          {t.gallery.title}
        </h2>

        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {t.gallery.subtitle}
        </p>

        <div className="my-10 flex items-center justify-center gap-3">
          <div className="divider-dotted w-24" />
          <ZelligeStar className="h-5 w-5 text-accent/70" />
          <div className="divider-dotted w-24" />
        </div>

        {tiles.length > 0 ? (
          <div className="mt-8 grid auto-rows-[132px] grid-cols-2 gap-3 sm:auto-rows-[152px] sm:gap-4 md:auto-rows-[170px] md:grid-cols-4 lg:grid-cols-6">
            {tiles.map((item) => {
              const name =
                lang === "en" ? item.nameEn : item.nameFr;
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

                  <div
                    className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-20"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(59,42,31,0.6) 0%, rgba(245,235,220,0) 60%)",
                    }}
                    aria-hidden
                  />

                  <figcaption className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 rounded bg-background/85 px-2.5 py-1 text-xs backdrop-blur-sm">
                    <span className="min-w-0 truncate font-display font-500 text-primary">
                      {name}
                    </span>

                    <span className="num-vintage shrink-0 text-accent">
                      {item.price}
                      <span className="ml-1 text-[10px] text-muted-foreground">
                        MAD
                      </span>
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        ) : (
          <p className="mt-8 text-sm italic text-muted-foreground">
            {lang === "en"
              ? "Gallery photos will appear here soon."
              : "Les photos de la galerie apparaîtront ici bientôt."}
          </p>
        )}
      </div>
    </section>
  );
}

/* ---------- Find us ---------- */

function FindUs({ t }: { t: Translation }) {
  return (
    <section
      id="findus"
      className="border-b border-border/60 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-3 flex items-center gap-3 text-accent">
          <Pin className="h-5 w-5" />
          <span className="text-xs font-600 uppercase tracking-widest">
            {t.findus.label}
          </span>
        </div>

        <h2 className="max-w-2xl font-display text-3xl font-500 leading-tight text-primary sm:text-4xl md:text-5xl">
          {t.findus.title}
        </h2>

        <div className="my-10 flex items-center justify-center gap-3">
          <div className="divider-dotted w-24" />
          <ZelligeStar className="h-5 w-5 text-accent/70" />
          <div className="divider-dotted w-24" />
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="paper-card rounded-md border border-border bg-card p-6 sm:p-8">
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

            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2 text-xs font-600 uppercase tracking-wider text-muted-foreground">
                <Clock className="h-4 w-4 text-accent" />
                <span>{t.findus.hours_label}</span>
              </div>

              <div className="space-y-1 text-sm text-foreground/80 sm:text-base">
                {t.findus.hours_lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <div className="divider-dotted my-6" />

            <div className="mb-6">
              <div className="mb-1 flex items-center gap-2 text-xs font-600 uppercase tracking-wider text-muted-foreground">
                <span
                  className="inline-flex h-4 w-4 items-center justify-center text-accent"
                  aria-hidden="true"
                >
                  ✆
                </span>
                <span>{t.findus.contact_label}</span>
              </div>

              <a
                href={`tel:${t.findus.phone.replace(/\s/g, "")}`}
                className="font-display text-lg text-primary transition-colors hover:text-accent"
                dir="ltr"
              >
                {t.findus.phone}
              </a>
            </div>

            <div className="divider-dotted my-6" />

            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-600 uppercase tracking-wider text-muted-foreground">
                <InstagramIcon className="h-4 w-4 text-accent" />
                <span>{t.findus.instagram_label}</span>
              </div>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-lg text-primary transition-colors hover:text-accent"
                dir="ltr"
              >
                {t.findus.instagram_handle}
              </a>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="paper-card relative overflow-hidden rounded-md border border-border bg-card">
              <iframe
                src={MAPS_EMBED_SRC}
                title={
                  t.meta.htmlLang === "en"
                    ? "Map showing the restaurant location"
                    : "Carte montrant l'emplacement du restaurant"
                }
                className="aspect-[4/3] w-full sm:aspect-[5/4] md:aspect-[4/5]"
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
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-500 text-primary-foreground transition-colors hover:bg-primary/90"
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

/* ---------- WhatsApp CTA ---------- */

function CtaBanner({
  t,
  lang,
}: {
  t: Translation;
  lang: Lang;
}) {
  return (
    <section className="border-b border-border/60 bg-primary py-16 text-primary-foreground sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mb-2 flex items-center gap-2 text-sm uppercase tracking-widest text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>{t.cta.eyebrow}</span>
            </div>

            <h2 className="font-display text-3xl font-500 leading-tight sm:text-4xl md:text-5xl">
              {t.cta.title}
            </h2>

            <p className="mt-4 max-w-xl text-sm text-primary-foreground/80 sm:text-base">
              {t.cta.body}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappHref(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-600 text-accent-foreground transition-colors hover:bg-accent/90"
              >
                <WhatsAppIcon className="h-5 w-5" />
                <span>{t.cta.button}</span>
              </a>

              <span className="self-center text-xs text-primary-foreground/60">
                {t.cta.note}
              </span>
            </div>
          </div>

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
    <svg
      viewBox="0 0 280 220"
      className="mx-auto w-full max-w-xs opacity-90"
      aria-hidden="true"
    >
      <rect
        x="60"
        y="20"
        width="160"
        height="180"
        rx="14"
        fill="#FBF4E6"
        stroke="#F5EBDC"
        strokeWidth="2"
      />
      <rect
        x="68"
        y="36"
        width="144"
        height="140"
        rx="6"
        fill="#E8D5B5"
      />
      <circle cx="140" cy="90" r="30" fill="#9CA882" />
      <path
        d="M 128 84 C 128 80, 132 78, 136 78 C 142 78, 146 82, 146 86 L 146 90 C 146 92, 144 94, 142 94 L 138 94 L 132 100 L 132 94 C 130 94, 128 92, 128 90 Z"
        fill="#FBF4E6"
      />
      <circle cx="132" cy="86" r="1.5" fill="#9CA882" />
      <circle cx="138" cy="86" r="1.5" fill="#9CA882" />
      <path
        d="M 90 130 L 130 130 L 130 150 L 100 150 L 90 158 L 90 130 Z"
        fill="#FBF4E6"
        stroke="#F5EBDC"
        strokeWidth="1"
      />
      <path d="M 100 138 L 120 138" stroke="#9CA882" strokeWidth="2" />
      <path d="M 100 144 L 115 144" stroke="#9CA882" strokeWidth="2" />
      <path
        d="M 150 138 L 195 138 L 195 158 L 165 158 L 155 166 L 155 138 Z"
        fill="#C44A3B"
      />
      <path d="M 162 146 L 188 146" stroke="#FBF4E6" strokeWidth="2" />
      <path d="M 162 152 L 180 152" stroke="#FBF4E6" strokeWidth="2" />
      <circle
        cx="140"
        cy="190"
        r="6"
        fill="none"
        stroke="#F5EBDC"
        strokeWidth="2"
      />
    </svg>
  );
}

/* ---------- Footer ---------- */

function Footer({ t }: { t: Translation }) {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="mb-10 flex items-center justify-center gap-3">
          <div className="divider-dotted w-24" />
          <ZelligeStar className="h-5 w-5 text-accent/70" />
          <OliveBranch className="h-6 w-6 text-tertiary" />
          <ZelligeStar className="h-5 w-5 text-accent/70" />
          <div className="divider-dotted w-24" />
        </div>

        <div className="grid gap-8 md:grid-cols-4">
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
                Pancakes{" "}
                <span className="italic text-muted-foreground">&amp;</span>{" "}
                Wafflez
              </span>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <div className="mb-2 text-xs font-600 uppercase tracking-wider text-accent">
              {t.footer.col1_title}
            </div>
            <p className="text-sm text-foreground/80">
              {t.footer.col1_line1}
            </p>
            <p className="text-sm text-foreground/80">
              {t.footer.col1_line2}
            </p>
          </div>

          <div>
            <div className="mb-2 text-xs font-600 uppercase tracking-wider text-accent">
              {t.footer.col2_title}
            </div>
            <p className="text-sm text-foreground/80">
              {t.footer.col2_line1}
            </p>
            <p className="text-sm text-foreground/80">
              {t.footer.col2_line2}
            </p>
          </div>

          <div>
            <div className="mb-2 text-xs font-600 uppercase tracking-wider text-accent">
              {t.footer.col3_title}
            </div>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-accent"
              dir="ltr"
            >
              <InstagramIcon className="h-4 w-4" />
              <span>{t.footer.col3_line2}</span>
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
            <span>© {new Date().getFullYear()} Pancakes &amp; Wafflez.</span>
            <span>{t.footer.rights}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>{t.footer.made_with}</span>
            <Heart className="h-3.5 w-3.5 text-accent" />
            <span>{t.footer.in_casa}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Main page ---------- */

function PageContent() {
  const [lang, setLang] = React.useState<Lang>("fr");
  const t = strings[lang];

  const {
    items,
    categories,
    isLoadingItems,
  } = useMenu();
  const { itemCount } = useCart();

  /* Keep the document language in sync with the visible UI. */
  React.useEffect(() => {
    document.documentElement.lang = t.meta.htmlLang;
  }, [t.meta.htmlLang]);

  return (
    <div className="flex min-h-screen flex-col" data-lang={lang}>
      <Header
        lang={lang}
        setLang={setLang}
        t={t}
      />

      <main className={itemCount > 0 ? "flex-1 pb-24 md:pb-0" : "flex-1"}>
        <Hero t={t} lang={lang} />
        <Story t={t} />
        <Menu
          t={t}
          items={items}
          categories={categories}
          extras={[]}
          lang={lang}
        />
        <Gallery
          t={t}
          items={items}
          lang={lang}
        />
        <FindUs t={t} />
        <CtaBanner t={t} lang={lang} />
      </main>

      <Footer t={t} />

      <CartDock
        lang={lang}
        t={t}
        buildCheckoutHref={(cartLines, note, name) =>
          whatsappOrderHref(lang, cartLines, note, name, t)
        }
      />

      {/* Bilingual loading indicator */}
      {isLoadingItems && items.length === 0 && (
        <div
          className="fixed bottom-3 right-3 z-30 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-md"
          role="status"
          aria-live="polite"
        >
          {t.ui.loadingMenu}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <OrderProvider>
      <PageContent />
    </OrderProvider>
  );
}
