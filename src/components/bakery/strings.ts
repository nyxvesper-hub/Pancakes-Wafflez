/**
 * Bilingual FR / EN content for Pancakes & Wafflez.
 * French is the primary language (most Casa brunch places use French),
 * English is the secondary (for tourists + international visitors).
 *
 * Old `ar` block was removed per request — most Moroccan café clients
 * only need FR + EN, not Arabic.
 */

export type Lang = "fr" | "en";

export const strings = {
  fr: {
    meta: {
      htmlLang: "fr",
      dir: "ltr",
    },
    nav: {
      story: "Notre histoire",
      menu: "Menu",
      gallery: "Galerie",
      findus: "Nous trouver",
      order: "Commander",
    },
    print: {
      button: "Télécharger le menu (PDF)",
      aria: "Télécharger le menu en PDF",
    },
    hero: {
      eyebrow: "Casablanca · Maroc",
      title: "Pancakes",
      titleAmp: "&",
      title2: "Wafflez",
      tagline:
        "Maison de brunch, thé & pâtisserie. Ouvert tous les jours sauf lundi, de 10h à 19h.",
      cta_primary: "Voir le menu",
      cta_secondary: "Commander sur WhatsApp",
      hours_chip: "10h — 19h · Fermé le lundi",
      location_chip: "Casablanca, Maroc",
    },
    story: {
      label: "Notre histoire",
      title: "Une petite maison qui sent la farine chaude",
      body_p1:
        "Tout a commencé dans un coin tranquille de Casablanca. Une cuisinière, une plaque, et l'envie de faire des pancakes comme on les aime : moelleux, dorés, sans lait, sans additifs. Juste de la bonne farine, des œufs frais, et le temps qu'il faut.",
      body_p2:
        "Aujourd'hui, Pancakes & Wafflez c'est un petit salon où l'on vient bruncher lentement, prendre un thé à la menthe, et repartir avec une boîte de pâtisseries pour la maison. Pas de chichi. Juste du fait-main, tous les jours.",
      caption: "Pancakes & Wafflez — depuis le premier matin.",
      stat_1: "Sans lait",
      stat_1_sub: "Recettes végétales maison",
      stat_2: "Fait main",
      stat_2_sub: "Tous les jours, dès 10h",
      stat_3: "Sur commande",
      stat_3_sub: "Grazing tables 24h à l'avance",
    },
    menu: {
      label: "Le menu",
      title: "Tout est fait ici, le matin même",
      subtitle:
        "Prix en dirhams (MAD). Boissons chaudes incluses avec les brunchs. Sans lait de vache, sans additifs.",
      c_pancakes: "Pancakes",
      c_waffles: "Gaufres",
      c_brunch: "Brunch & Thé",
      c_bakery: "Pâtisseries",
      items: {
        classic: {
          name: "Pancakes classiques",
          desc: "Sirop d'érable, beurre fermier salé",
          price: "65",
        },
        berry: {
          name: "Pancakes aux fruits rouges",
          desc: "Framboises, myrtilles, coulis maison",
          price: "75",
        },
        chocolate: {
          name: "Pancakes chocolat",
          desc: "Pépites noir 70%, cacao cru",
          price: "75",
        },
        citrus: {
          name: "Pancakes agrumes & miel",
          desc: "Orange sanguine, fleur d'oranger, miel",
          price: "80",
        },
        classicW: {
          name: "Gaufre classique",
          desc: "Sucre perlé, beurre salé, sirop au choix",
          price: "55",
        },
        liege: {
          name: "Gaufre Liégeois",
          desc: "Sucre perlé maison, vanille de Madagascar",
          price: "65",
        },
        berryW: {
          name: "Gaufre aux fruits rouges",
          desc: "Framboises, myrtilles, chantilly végétale",
          price: "75",
        },
        brunchClassic: {
          name: "Brunch (sucré)",
          desc: "Pancakes ou gaufre au choix, thé à la menthe, jus du jour, fruit",
          price: "120",
        },
        brunchSalty: {
          name: "Brunch (salé)",
          desc: "Œufs au plat, pain au levain, fromage frais, salade, thé",
          price: "130",
        },
        mintTea: {
          name: "Thé à la menthe (théière)",
          desc: "Menthe fraîche du jour, servi à la marocaine",
          price: "30",
        },
        coffee: {
          name: "Café maison",
          desc: "Espresso, noisette, ou crème (lait d'avoine)",
          price: "22",
        },
        seasonLatte: {
          name: "Latte de saison",
          desc: "Avoine, cannelle, miel de thym",
          price: "32",
        },
        cookie: {
          name: "Cookie géant",
          desc: "Chocolat noir, fleur de sel",
          price: "28",
        },
        cinnamonRoll: {
          name: "Roule à la cannelle",
          desc: "Glaçage au cream cheese végétal",
          price: "32",
        },
        brownie: {
          name: "Brownie",
          desc: "Noix, cacao intense, sans gluten",
          price: "30",
        },
        bananaBread: {
          name: "Banana bread",
          desc: "Mûr, noisettes grillées, miel",
          price: "28",
        },
      },
      note: "Les plats peuvent contenir des traces de fruits à coque. N'hésitez pas à demander.",
    },
    gallery: {
      label: "La galerie",
      title: "Ce qui sort de la cuisine",
      subtitle: "Quelques instants du matin, à Casablanca.",
    },
    findus: {
      label: "Nous trouver",
      title: "Venez bruncher à Casablanca",
      address_label: "Adresse",
      address: "Quartier racé — Casablanca, Maroc",
      hours_label: "Heures",
      hours_lines: ["Lun : Fermé", "Mar — Dim : 10h — 19h"],
      contact_label: "Contact",
      phone: "+212 6 12 34 56 78",
      instagram_label: "Instagram",
      instagram_handle: "@pancakesandwafflez",
      map_cta: "Ouvrir dans Google Maps",
    },
    cta: {
      eyebrow: "Sur commande",
      title: "Faites votre commande sur WhatsApp",
      body:
        "Envoyez-nous votre liste, on prépare et vous prévient quand c'est prêt. Pour les grazing tables, prévoyez 24h à l'avance.",
      button: "Ouvrir WhatsApp",
      note: "Réponse rapide pendant les heures d'ouverture.",
    },
    footer: {
      tagline: "Maison de brunch à Casablanca.",
      col1_title: "Adresse",
      col1_line1: "Quartier racé",
      col1_line2: "Casablanca, Maroc",
      col2_title: "Heures",
      col2_line1: "Mar — Dim",
      col2_line2: "10h — 19h · Fermé lundi",
      col3_title: "Suivez-nous",
      col3_line1: "Instagram",
      col3_line2: "@pancakesandwafflez",
      rights: "Tous droits réservés.",
      made_with: "Fait avec",
      in_casa: "à Casablanca",
    },
  },
  en: {
    meta: {
      htmlLang: "en",
      dir: "ltr",
    },
    nav: {
      story: "Our story",
      menu: "Menu",
      gallery: "Gallery",
      findus: "Find us",
      order: "Order",
    },
    print: {
      button: "Download menu (PDF)",
      aria: "Download the menu as a PDF",
    },
    hero: {
      eyebrow: "Casablanca · Morocco",
      title: "Pancakes",
      titleAmp: "&",
      title2: "Wafflez",
      tagline:
        "Brunch, tea & bakery house. Open every day except Monday, 10am — 7pm.",
      cta_primary: "See the menu",
      cta_secondary: "Order on WhatsApp",
      hours_chip: "10am — 7pm · Closed Mondays",
      location_chip: "Casablanca, Morocco",
    },
    story: {
      label: "Our story",
      title: "A little house that smells of warm flour",
      body_p1:
        "It started in a quiet corner of Casablanca. A stovetop, a griddle, and the desire to make pancakes the way we love them: fluffy, golden, dairy-free, no additives. Just good flour, fresh eggs, and the time it takes.",
      body_p2:
        "Today, Pancakes & Wafflez is a small parlour where you come to brunch slowly, sip mint tea, and leave with a box of pastries for home. No fuss. Just handmade, every day.",
      caption: "Pancakes & Wafflez — since the first morning.",
      stat_1: "Dairy-free",
      stat_1_sub: "House plant-based recipes",
      stat_2: "Handmade",
      stat_2_sub: "Every day, from 10am",
      stat_3: "Made-to-order",
      stat_3_sub: "Grazing tables with 24h notice",
    },
    menu: {
      label: "The menu",
      title: "Everything is made here, the same morning",
      subtitle:
        "Prices in dirhams (MAD). Hot drinks included with brunches. No cow's milk, no additives.",
      c_pancakes: "Pancakes",
      c_waffles: "Waffles",
      c_brunch: "Brunch & Tea",
      c_bakery: "Pastries",
      items: {
        classic: {
          name: "Classic pancakes",
          desc: "Maple syrup, salted farm butter",
          price: "65",
        },
        berry: {
          name: "Berry pancakes",
          desc: "Raspberries, blueberries, house coulis",
          price: "75",
        },
        chocolate: {
          name: "Chocolate pancakes",
          desc: "70% dark chunks, raw cacao",
          price: "75",
        },
        citrus: {
          name: "Citrus & honey pancakes",
          desc: "Blood orange, orange blossom, honey",
          price: "80",
        },
        classicW: {
          name: "Classic waffle",
          desc: "Pearl sugar, salted butter, syrup of choice",
          price: "55",
        },
        liege: {
          name: "Liège waffle",
          desc: "House pearl sugar, Madagascar vanilla",
          price: "65",
        },
        berryW: {
          name: "Berry waffle",
          desc: "Raspberries, blueberries, plant cream",
          price: "75",
        },
        brunchClassic: {
          name: "Brunch (sweet)",
          desc: "Pancakes or waffle of choice, mint tea, juice of the day, fruit",
          price: "120",
        },
        brunchSalty: {
          name: "Brunch (savoury)",
          desc: "Fried eggs, sourdough, fresh cheese, salad, tea",
          price: "130",
        },
        mintTea: {
          name: "Mint tea (pot)",
          desc: "Fresh mint of the day, served Moroccan style",
          price: "30",
        },
        coffee: {
          name: "House coffee",
          desc: "Espresso, noisette, or crème (oat milk)",
          price: "22",
        },
        seasonLatte: {
          name: "Seasonal latte",
          desc: "Oat, cinnamon, thyme honey",
          price: "32",
        },
        cookie: {
          name: "Giant cookie",
          desc: "Dark chocolate, fleur de sel",
          price: "28",
        },
        cinnamonRoll: {
          name: "Cinnamon roll",
          desc: "Plant cream-cheese glaze",
          price: "32",
        },
        brownie: {
          name: "Brownie",
          desc: "Walnuts, intense cacao, gluten-free",
          price: "30",
        },
        bananaBread: {
          name: "Banana bread",
          desc: "Ripe, toasted hazelnuts, honey",
          price: "28",
        },
      },
      note: "Dishes may contain traces of nuts. Please ask if unsure.",
    },
    gallery: {
      label: "Gallery",
      title: "What comes out of the kitchen",
      subtitle: "A few moments from the morning, in Casablanca.",
    },
    findus: {
      label: "Find us",
      title: "Come brunch in Casablanca",
      address_label: "Address",
      address: "Racé neighbourhood — Casablanca, Morocco",
      hours_label: "Hours",
      hours_lines: ["Mon: Closed", "Tue — Sun: 10am — 7pm"],
      contact_label: "Contact",
      phone: "+212 6 12 34 56 78",
      instagram_label: "Instagram",
      instagram_handle: "@pancakesandwafflez",
      map_cta: "Open in Google Maps",
    },
    cta: {
      eyebrow: "Made to order",
      title: "Place your order on WhatsApp",
      body:
        "Send us your list, we'll prep it and let you know when it's ready. For grazing tables, please give 24h notice.",
      button: "Open WhatsApp",
      note: "Quick reply during opening hours.",
    },
    footer: {
      tagline: "Brunch house in Casablanca.",
      col1_title: "Address",
      col1_line1: "Racé neighbourhood",
      col1_line2: "Casablanca, Morocco",
      col2_title: "Hours",
      col2_line1: "Tue — Sun",
      col2_line2: "10am — 7pm · Closed Mondays",
      col3_title: "Follow us",
      col3_line1: "Instagram",
      col3_line2: "@pancakesandwafflez",
      rights: "All rights reserved.",
      made_with: "Made with",
      in_casa: "in Casablanca",
    },
  },
} as const;

export type Strings = (typeof strings)["fr"];
