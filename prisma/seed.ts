/**
 * Seed the MenuCategory + MenuItem tables with the REAL Pancakes & Wafflez menu
 * (transcribed from the café's Instagram highlight "Menu" — Sweets, Savory, Brunch,
 * Drinks, Bakery Corner).
 * Run with: `bun run db:push && bun run db:seed`
 *
 * NOTE ON PHOTOS: individual photos weren't supplied for every one of these ~50
 * items, so photoUrl below reuses the existing stock food photos (cycled per
 * category) as placeholders. Swap them for real photos of each dish later via
 * the Admin Sheet (Shift+A) — click any item's photo to replace it.
 *
 * NOTE ON PRICES: all prices are in MAD (Moroccan dirhams), stored as integers,
 * transcribed exactly as shown on the menu.
 */
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const db =
  globalThis.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

type SeedCategory = {
  key: string;
  labelFr: string;
  labelEn: string;
  displayOrder: number;
};

type Seed = {
  category: string;
  order: number;
  nameFr: string;
  nameEn: string;
  descFr: string;
  descEn: string;
  price: number;
  photoUrl: string;
  photoSize: "small" | "medium" | "large" | "feature";
};

const categories: SeedCategory[] = [
  { key: "pancakes", labelFr: "Pancakes", labelEn: "Pancakes", displayOrder: 1 },
  { key: "waffles", labelFr: "Gaufres de Liège", labelEn: "Liège Waffles", displayOrder: 2 },
  { key: "french-toast", labelFr: "Pain Perdu", labelEn: "French Toasts", displayOrder: 3 },
  { key: "brownies", labelFr: "Brownies", labelEn: "Brownies", displayOrder: 4 },
  { key: "savory", labelFr: "Salé", labelEn: "Savory", displayOrder: 5 },
  { key: "brunch", labelFr: "Brunch", labelEn: "Brunch", displayOrder: 6 },
  { key: "drinks", labelFr: "Boissons", labelEn: "Drinks", displayOrder: 7 },
  { key: "bakery", labelFr: "Coin Pâtisserie", labelEn: "Bakery Corner", displayOrder: 8 },
];

const PANCAKE_PHOTOS = [
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0fda198e2e9b.jpg",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9b9f94be3de8.jpg",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c14677c1a7fb.jpg",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3b4eda9561bd.jpg",
];
const WAFFLE_PHOTOS = [
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9deebcca46c9.jpg",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/133ea9e2a354.jpg",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7cbe41e2818f.jpg",
];
const BRUNCH_PHOTOS = [
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/72e3d6bddb87.jpg",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/facfee257955.jpg",
];
const DRINK_PHOTOS = [
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/51ff51794573.jpg",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/062662ba0b5b.png",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b491271d03ec.jpg",
];
const BAKERY_PHOTOS = [
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/aee87a2c8b6d.jpg",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/672350ccf5ff.jpg",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c7a14fb6e29b.jpg",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3bad0dfda649.jpg",
];

const pick = (pool: string[], i: number) => pool[i % pool.length];

const menu: Seed[] = [
  // ============ PANCAKES ============
  { category: "pancakes", order: 1, nameFr: "Pancakes Fruits Rouges", nameEn: "Berry Pancakes", descFr: "Pancakes nappés de chantilly et coulis de fruits rouges", descEn: "Pancakes with whipped cream & berry coulis", price: 55, photoUrl: pick(PANCAKE_PHOTOS, 0), photoSize: "feature" },
  { category: "pancakes", order: 2, nameFr: "Pancakes Chocolat", nameEn: "Choco Pancakes", descFr: "Pancakes nappés de chantilly et chocolat", descEn: "Pancakes with whipped cream & chocolate", price: 49, photoUrl: pick(PANCAKE_PHOTOS, 1), photoSize: "small" },
  { category: "pancakes", order: 3, nameFr: "Pancakes Caramel", nameEn: "Caramel Pancakes", descFr: "Pancakes nappés de chantilly et caramel au beurre salé", descEn: "Pancakes with whipped cream & salted caramel", price: 49, photoUrl: pick(PANCAKE_PHOTOS, 2), photoSize: "small" },

  // ============ WAFFLES (Liège) ============
  { category: "waffles", order: 1, nameFr: "Gaufre Fruits Rouges", nameEn: "Berry Waffles", descFr: "Gaufre de Liège, chantilly et coulis de fruits rouges", descEn: "Liège waffles with whipped cream & berry coulis", price: 55, photoUrl: pick(WAFFLE_PHOTOS, 0), photoSize: "feature" },
  { category: "waffles", order: 2, nameFr: "Gaufre Chocolat", nameEn: "Choco Waffles", descFr: "Gaufre de Liège, chantilly et chocolat", descEn: "Liège waffles with whipped cream & chocolate", price: 49, photoUrl: pick(WAFFLE_PHOTOS, 1), photoSize: "small" },
  { category: "waffles", order: 3, nameFr: "Gaufre Caramel", nameEn: "Caramel Waffles", descFr: "Gaufre de Liège, chantilly et caramel au beurre salé", descEn: "Liège waffles with whipped cream & salted caramel", price: 49, photoUrl: pick(WAFFLE_PHOTOS, 2), photoSize: "small" },

  // ============ FRENCH TOAST (sweet) ============
  { category: "french-toast", order: 1, nameFr: "Brioche Perdue Caramel", nameEn: "Brioche Perdue", descFr: "Brioche façon pain perdu, caramel au beurre salé et glace vanille", descEn: "French toasted brioche with salted caramel & vanilla ice cream", price: 55, photoUrl: pick(WAFFLE_PHOTOS, 0), photoSize: "feature" },
  { category: "french-toast", order: 2, nameFr: "Fruits Rouges & Chantilly", nameEn: "Berries & Cream", descFr: "Brioche perdue, coulis de fruits rouges, chantilly et fruits frais", descEn: "French toasted brioche with berry coulis, whipped cream & berries", price: 55, photoUrl: pick(PANCAKE_PHOTOS, 1), photoSize: "small" },
  { category: "french-toast", order: 3, nameFr: "Fondant Chocolat", nameEn: "Chocolate Melt", descFr: "Brioche perdue, chocolat fondant et glace vanille", descEn: "French toasted brioche with chocolate & vanilla ice cream", price: 55, photoUrl: pick(PANCAKE_PHOTOS, 2), photoSize: "small" },
  { category: "french-toast", order: 4, nameFr: "The Blueberry (Spécial Printemps)", nameEn: "The Blueberry (Spring Special)", descFr: "Demi-brioches perdues garnies de crème cheesecake et sauce myrtille", descEn: "French toasted brioche halves with cheesecake filling and blueberry sauce", price: 59, photoUrl: pick(WAFFLE_PHOTOS, 1), photoSize: "small" },
  { category: "french-toast", order: 5, nameFr: "Triple Berry (Spécial Printemps)", nameEn: "Triple Berry (Spring Special)", descFr: "Demi-brioches perdues garnies de crème cheesecake et sauce trois fruits rouges", descEn: "French toasted brioche halves with cheesecake filling and triple berry sauce", price: 59, photoUrl: pick(PANCAKE_PHOTOS, 0), photoSize: "small" },
  { category: "french-toast", order: 6, nameFr: "Salted Caramel (Spécial Printemps)", nameEn: "Salted Caramel (Spring Special)", descFr: "Demi-brioches perdues garnies de crème cheesecake et sauce caramel au beurre salé", descEn: "French toasted brioche halves with cheesecake filling and salted caramel sauce", price: 59, photoUrl: pick(WAFFLE_PHOTOS, 2), photoSize: "small" },

  // ============ BROWNIES (à la part) ============
  { category: "brownies", order: 1, nameFr: "Brownie Classique", nameEn: "Classic Brownie", descFr: "Brownie, glace vanille et sauce caramel", descEn: "Brownie with vanilla ice cream & caramel sauce", price: 45, photoUrl: pick(BAKERY_PHOTOS, 2), photoSize: "feature" },
  { category: "brownies", order: 2, nameFr: "Brownie Fruits Rouges", nameEn: "Berry Brownie", descFr: "Brownie, chantilly, coulis de fruits rouges et fruits frais", descEn: "Brownie with chantilly, berry coulis & fresh berries", price: 45, photoUrl: pick(BAKERY_PHOTOS, 0), photoSize: "small" },

  // ============ SAVORY ============
  { category: "savory", order: 1, nameFr: "Brioche Champignons", nameEn: "Mushroom Brioche", descFr: "Brioche façon pain perdu, champignons sautés, œufs brouillés, cream cheese", descEn: "French Toast Brioche with sautéed mushrooms, eggs scramble, side of whipped cream cheese", price: 59, photoUrl: pick(BRUNCH_PHOTOS, 1), photoSize: "feature" },
  { category: "savory", order: 2, nameFr: "Œuf, Bacon & Fromage", nameEn: "Egg Bacon & Cheese", descFr: "Œuf, bacon et fromage fondant sur brioche perdue", descEn: "Cheesy egg & bacon on brioche french toast", price: 59, photoUrl: pick(BRUNCH_PHOTOS, 0), photoSize: "small" },
  { category: "savory", order: 3, nameFr: "Avocat & Cheddar Fondu", nameEn: "Avo Cheddar Melt", descFr: "Brioche toastée, avocat écrasé, œufs brouillés et cheddar fondu", descEn: "Toasted brioche, smashed avocado, scrambled eggs & melted cheddar", price: 59, photoUrl: pick(BRUNCH_PHOTOS, 1), photoSize: "small" },
  { category: "savory", order: 4, nameFr: "Turkey Sammy", nameEn: "Turkey Sammy", descFr: "Pain au levain, cream cheese, tomates cerises, avocat, pastrami et cheddar", descEn: "Sourdough bread, cream cheese, cherry tomatoes, avocado, pastrami & cheddar", price: 59, photoUrl: pick(BRUNCH_PHOTOS, 0), photoSize: "small" },
  { category: "savory", order: 5, nameFr: "Toast Avocat Écrasé", nameEn: "Smashed Avo Toast", descFr: "Avocat écrasé et tomates cerises rôties sur pain au levain", descEn: "Mashed avocado with baked cherry tomatoes on sourdough", price: 59, photoUrl: pick(BRUNCH_PHOTOS, 1), photoSize: "small" },
  { category: "savory", order: 6, nameFr: "Melty Toastie (Nouveau)", nameEn: "Melty Toastie (New)", descFr: "Pain au levain, tomates cerises rôties, poivrons grillés, dinde et mozzarella fondue", descEn: "Sourdough bread, baked cherry tomatoes, grilled peppers, turkey, melted mozzarella", price: 59, photoUrl: pick(BRUNCH_PHOTOS, 0), photoSize: "small" },

  // ============ BRUNCH (formulas) ============
  { category: "brunch", order: 1, nameFr: "Tea Time (9h–17h50)", nameEn: "Tea Time (9am–5:50pm)", descFr: "Pancakes ou gaufres, thé ou café", descEn: "Pancakes or Waffles, Tea or Coffee", price: 59, photoUrl: pick(DRINK_PHOTOS, 1), photoSize: "small" },
  { category: "brunch", order: 2, nameFr: "Formule Déjeuner (12h–15h, lun–ven)", nameEn: "Lunchtime (12–3pm, Mon–Fri)", descFr: "Pancakes/gaufres ou pain perdu/levain + boisson fraîche", descEn: "Pancakes or Waffles / French Toasts or Sourdough + Fresh Drink", price: 89, photoUrl: pick(BRUNCH_PHOTOS, 0), photoSize: "medium" },
  { category: "brunch", order: 3, nameFr: "OG Breakfast", nameEn: "OG Breakfast", descFr: "Pancakes, miel, œufs brouillés, bacon, tomates cerises rôties, champignons sautés + thé glacé ou café/thé", descEn: "Pancakes, honey, scrambled eggs, bacon, baked cherry tomatoes, sautéed mushrooms + Ice Tea or Coffee/Tea", price: 75, photoUrl: pick(BRUNCH_PHOTOS, 1), photoSize: "medium" },
  { category: "brunch", order: 4, nameFr: "White Lotus", nameEn: "White Lotus", descFr: "Gaufre de Liège au miel, œufs brouillés, pain au levain et cream cheese + thé glacé ou café/thé", descEn: "Liège Waffles & honey, scrambled eggs, cream cheese sourdough bread + Ice Tea or Coffee/Tea", price: 79, photoUrl: pick(WAFFLE_PHOTOS, 0), photoSize: "medium" },
  { category: "brunch", order: 5, nameFr: "Sorrento (Nouveau)", nameEn: "Sorrento (New)", descFr: "Tomates cerises rôties et mozzarella fondue sur pain au levain, œufs brouillés ; pancakes ou gaufres au miel + thé glacé ou café/thé", descEn: "Baked cherry tomatoes & melted mozzarella on sourdough, side of scrambled eggs; pancakes or waffles with honey + Ice Tea or Coffee/Tea", price: 89, photoUrl: pick(BRUNCH_PHOTOS, 0), photoSize: "small" },
  { category: "brunch", order: 6, nameFr: "Cheeky Treat (Nouveau)", nameEn: "Cheeky Treat (New)", descFr: "Brioche perdue, cream cheese, œufs brouillés, champignons sautés et crème ; pancakes ou gaufres au miel + thé glacé ou café/thé", descEn: "French Toasted Brioche with cream cheese, scrambled egg, sautéed mushrooms & cream; pancakes or waffles with honey + Ice Tea or Coffee/Tea", price: 89, photoUrl: pick(BRUNCH_PHOTOS, 1), photoSize: "small" },
  { category: "brunch", order: 7, nameFr: "Banger Plate (Nouveau)", nameEn: "Banger Plate (New)", descFr: "Toast au levain, œufs brouillés, bacon, avocat, cream cheese, champignons sautés ; pancakes ou gaufres au miel + thé glacé ou café/thé", descEn: "Sourdough toast, scrambled eggs, bacon, avocado, cream cheese, sautéed mushroom; pancakes or waffles with honey + Ice Tea or Coffee/Tea", price: 99, photoUrl: pick(BRUNCH_PHOTOS, 0), photoSize: "small" },
  { category: "brunch", order: 8, nameFr: "The Big Brekkie", nameEn: "The Big Brekkie", descFr: "Choisissez votre plat salé (pain perdu salé, pain au levain ou spécial week-end) ; pancakes ou gaufres garnis au choix ; granola, yaourt grec et fruits frais ; boisson fraîche/café ou thé", descEn: "Choose your savory dish (Savory French Toasts, Sourdough Love or Week End Special); pancakes or waffles with topping of choice; granola with greek yogurt and fresh fruits; fresh drink/coffee or tea", price: 119, photoUrl: pick(BRUNCH_PHOTOS, 1), photoSize: "feature" },
  { category: "brunch", order: 9, nameFr: "Eggs Royale (Spécial Week-end)", nameEn: "Eggs Royale (Weekend Special)", descFr: "Toast brioché, cream cheese, avocat, saumon, œuf poché et sauce hollandaise", descEn: "Brioche toast, cream cheese, avocado, salmon, poached egg & hollandaise sauce", price: 69, photoUrl: pick(BRUNCH_PHOTOS, 0), photoSize: "medium" },
  { category: "brunch", order: 10, nameFr: "Eggs Benedict (Spécial Week-end)", nameEn: "Eggs Benedict (Weekend Special)", descFr: "Toast brioché, cream cheese, pastrami, œuf poché et sauce hollandaise", descEn: "Brioche toast, cream cheese, pastrami, poached egg & hollandaise sauce", price: 65, photoUrl: pick(BRUNCH_PHOTOS, 1), photoSize: "medium" },

  // ============ DRINKS ============
  { category: "drinks", order: 1, nameFr: "Nespresso", nameEn: "Nespresso", descFr: "", descEn: "", price: 15, photoUrl: pick(DRINK_PHOTOS, 1), photoSize: "small" },
  { category: "drinks", order: 2, nameFr: "Latte", nameEn: "Latte", descFr: "", descEn: "", price: 20, photoUrl: pick(DRINK_PHOTOS, 2), photoSize: "small" },
  { category: "drinks", order: 3, nameFr: "Caramel Macchiato", nameEn: "Caramel Macchiato", descFr: "", descEn: "", price: 25, photoUrl: pick(DRINK_PHOTOS, 1), photoSize: "small" },
  { category: "drinks", order: 4, nameFr: "Chocolat Chaud", nameEn: "Hot Chocolate", descFr: "", descEn: "", price: 25, photoUrl: pick(DRINK_PHOTOS, 2), photoSize: "small" },
  { category: "drinks", order: 5, nameFr: "Mocaccino", nameEn: "Mocaccino", descFr: "", descEn: "", price: 39, photoUrl: pick(DRINK_PHOTOS, 1), photoSize: "small" },
  { category: "drinks", order: 6, nameFr: "Thé à la Menthe", nameEn: "Mint Tea", descFr: "", descEn: "", price: 20, photoUrl: pick(DRINK_PHOTOS, 0), photoSize: "feature" },
  { category: "drinks", order: 7, nameFr: "Sélection de Thés", nameEn: "Tea Selection", descFr: "Earl Grey, vanille, fruits rouges, citron...", descEn: "Earl Grey, Vanilla, Berries, Lemon...", price: 25, photoUrl: pick(DRINK_PHOTOS, 0), photoSize: "small" },
  { category: "drinks", order: 8, nameFr: "Eau Minérale", nameEn: "Mineral Water", descFr: "", descEn: "", price: 15, photoUrl: pick(DRINK_PHOTOS, 2), photoSize: "small" },
  { category: "drinks", order: 9, nameFr: "Eau Gazeuse", nameEn: "Sparkling Water", descFr: "", descEn: "", price: 18, photoUrl: pick(DRINK_PHOTOS, 1), photoSize: "small" },
  { category: "drinks", order: 10, nameFr: "Soda", nameEn: "Soda", descFr: "", descEn: "", price: 18, photoUrl: pick(DRINK_PHOTOS, 2), photoSize: "small" },
  { category: "drinks", order: 11, nameFr: "Thé Glacé", nameEn: "Iced Tea", descFr: "", descEn: "", price: 25, photoUrl: pick(DRINK_PHOTOS, 0), photoSize: "small" },
  { category: "drinks", order: 12, nameFr: "Iced Latte Mousse Triple Berry", nameEn: "Triple Berry Cold Foam Iced Latte", descFr: "", descEn: "", price: 39, photoUrl: pick(DRINK_PHOTOS, 1), photoSize: "medium" },
  { category: "drinks", order: 13, nameFr: "Virgin Mojito", nameEn: "Virgin Mojito", descFr: "", descEn: "", price: 35, photoUrl: pick(DRINK_PHOTOS, 2), photoSize: "small" },
  { category: "drinks", order: 14, nameFr: "Mojito Framboise-Citron Vert", nameEn: "Raspberry Lime Mojito", descFr: "", descEn: "", price: 35, photoUrl: pick(DRINK_PHOTOS, 0), photoSize: "small" },
  { category: "drinks", order: 15, nameFr: "Iced Latte", nameEn: "Iced Latte", descFr: "", descEn: "", price: 30, photoUrl: pick(DRINK_PHOTOS, 1), photoSize: "small" },
  { category: "drinks", order: 16, nameFr: "Iced Caramel Macchiato", nameEn: "Iced Caramel Macchiato", descFr: "", descEn: "", price: 35, photoUrl: pick(DRINK_PHOTOS, 2), photoSize: "small" },

  // ============ BAKERY CORNER (dépôt requis) ============
  { category: "bakery", order: 1, nameFr: "Sweet Grazing Box", nameEn: "Sweet Grazing Box", descFr: "4 gaufres de Liège, 6 cookies, mini-brownies, caramel au beurre salé", descEn: "4 Liège waffles, 6 cookies, brownie bites, salted caramel", price: 200, photoUrl: pick(BAKERY_PHOTOS, 0), photoSize: "feature" },
  { category: "bakery", order: 2, nameFr: "Cookie Gourmet Box", nameEn: "Cookie Gourmet Box", descFr: "12 cookies aux saveurs variées (chocolat noir, chocolat au lait, s'mores...)", descEn: "12 cookies with different flavors (dark chocolate, milk chocolate, smores...)", price: 200, photoUrl: pick(BAKERY_PHOTOS, 1), photoSize: "medium" },
  { category: "bakery", order: 3, nameFr: "Chunky Cookie Box", nameEn: "Chunky Cookie Box", descFr: "5 cookies épais, saveurs mélangées", descEn: "5 chunky cookies with mixed flavors", price: 130, photoUrl: pick(BAKERY_PHOTOS, 2), photoSize: "small" },
  { category: "bakery", order: 4, nameFr: "Mini Gaufres de Liège (x10)", nameEn: "Mini Liège Waffles (10)", descFr: "", descEn: "", price: 60, photoUrl: pick(WAFFLE_PHOTOS, 1), photoSize: "small" },
  { category: "bakery", order: 5, nameFr: "Gaufres de Liège (x5)", nameEn: "Liège Waffles (5)", descFr: "", descEn: "", price: 60, photoUrl: pick(WAFFLE_PHOTOS, 2), photoSize: "small" },
  { category: "bakery", order: 6, nameFr: "Madeleines (x20)", nameEn: "Madeleines (20)", descFr: "", descEn: "", price: 120, photoUrl: pick(BAKERY_PHOTOS, 3), photoSize: "small" },
  { category: "bakery", order: 7, nameFr: "Cookies (x5)", nameEn: "Cookies (5)", descFr: "", descEn: "", price: 100, photoUrl: pick(BAKERY_PHOTOS, 1), photoSize: "small" },
  { category: "bakery", order: 8, nameFr: "Mini Cookies (x10)", nameEn: "Mini Cookies (10)", descFr: "", descEn: "", price: 100, photoUrl: pick(BAKERY_PHOTOS, 0), photoSize: "small" },
  { category: "bakery", order: 9, nameFr: "Chunky Cookies (x5)", nameEn: "Chunky Cookies (5)", descFr: "", descEn: "", price: 130, photoUrl: pick(BAKERY_PHOTOS, 2), photoSize: "small" },
  { category: "bakery", order: 10, nameFr: "Brownie à l'unité", nameEn: "Brownie (unit)", descFr: "", descEn: "", price: 30, photoUrl: pick(BAKERY_PHOTOS, 3), photoSize: "small" },
  { category: "bakery", order: 11, nameFr: "Tarte Granny Smith", nameEn: "Granny Smith Apple Pie", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 220, photoUrl: pick(BAKERY_PHOTOS, 0), photoSize: "medium" },
  { category: "bakery", order: 12, nameFr: "Tarte Rustique aux Fruits Rouges", nameEn: "Rustic Berry Pie", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 220, photoUrl: pick(BAKERY_PHOTOS, 1), photoSize: "small" },
  { category: "bakery", order: 13, nameFr: "Tarte Crème & Myrtilles", nameEn: "Blueberry Cream Pie", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 250, photoUrl: pick(BAKERY_PHOTOS, 2), photoSize: "small" },
  { category: "bakery", order: 14, nameFr: "Pizookie", nameEn: "Pizookie", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 220, photoUrl: pick(BAKERY_PHOTOS, 3), photoSize: "small" },
  { category: "bakery", order: 15, nameFr: "Brookie", nameEn: "Brookie", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 270, photoUrl: pick(BAKERY_PHOTOS, 0), photoSize: "small" },
  { category: "bakery", order: 16, nameFr: "Brownie (grand format)", nameEn: "Brownie (full size)", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 220, photoUrl: pick(BAKERY_PHOTOS, 1), photoSize: "small" },
  { category: "bakery", order: 17, nameFr: "Brownie Triple Chocolat", nameEn: "Triple Chocolate Brownie", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 250, photoUrl: pick(BAKERY_PHOTOS, 2), photoSize: "small" },
  { category: "bakery", order: 18, nameFr: "Brownie Fruits Rouges (grand format)", nameEn: "Berry Brownie (full size)", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 260, photoUrl: pick(BAKERY_PHOTOS, 3), photoSize: "small" },
  { category: "bakery", order: 19, nameFr: "Brownie Caramel au Beurre Salé", nameEn: "Salted Caramel Brownie", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 260, photoUrl: pick(BAKERY_PHOTOS, 0), photoSize: "small" },
  { category: "bakery", order: 20, nameFr: "Roulé Cream Cheese", nameEn: "Cream Cheese Roll", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 200, photoUrl: pick(BAKERY_PHOTOS, 1), photoSize: "small" },
  { category: "bakery", order: 21, nameFr: "Roulé Fruits Rouges", nameEn: "Berry Roll", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 220, photoUrl: pick(BAKERY_PHOTOS, 2), photoSize: "small" },
  { category: "bakery", order: 22, nameFr: "Roulé Glaçage Café", nameEn: "Coffee Glazed Roll", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 220, photoUrl: pick(BAKERY_PHOTOS, 3), photoSize: "small" },
  { category: "bakery", order: 23, nameFr: "Cheesecake NY Classic", nameEn: "NY Classic Cheesecake", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 380, photoUrl: pick(BAKERY_PHOTOS, 0), photoSize: "medium" },
  { category: "bakery", order: 24, nameFr: "Cheesecake Fruits Rouges & Chantilly", nameEn: "Berry Chantilly Cheesecake", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 400, photoUrl: pick(BAKERY_PHOTOS, 1), photoSize: "small" },
  { category: "bakery", order: 25, nameFr: "Cheesecake Caramel au Beurre Salé", nameEn: "Salted Caramel Cheesecake", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 400, photoUrl: pick(BAKERY_PHOTOS, 2), photoSize: "small" },
  { category: "bakery", order: 26, nameFr: "Cheesecake Ganache Chocolat au Lait & Myrtilles", nameEn: "Milk Chocolate Ganache & Blueberries Cheesecake", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 420, photoUrl: pick(BAKERY_PHOTOS, 3), photoSize: "small" },
  { category: "bakery", order: 27, nameFr: "Cheesecake Mangue Passion", nameEn: "Mangue Passion Cheesecake", descFr: "Commande 24h à l'avance", descEn: "24h advance order", price: 450, photoUrl: pick(BAKERY_PHOTOS, 0), photoSize: "feature" },
];

async function main() {
  console.log("🌱 Seeding menu categories + items...");

  await db.menuItem.deleteMany({});
  await db.menuCategory.deleteMany({});

  for (const cat of categories) {
    await db.menuCategory.create({ data: cat });
  }

  for (const item of menu) {
    await db.menuItem.create({ data: item });
  }

  const catCount = await db.menuCategory.count();
  const itemCount = await db.menuItem.count();
  console.log(`✅ Seeded ${catCount} categories + ${itemCount} menu items.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });