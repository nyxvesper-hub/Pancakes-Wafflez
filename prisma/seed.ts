/**
 * Seed the MenuCategory + MenuItem tables with the default Pancakes & Wafflez menu.
 * Run with: `bun run db:push && bun run db:seed`
 *
 * Photos are sourced from the ZAI image-search service (z-cdn.chatglm.cn).
 * Categories are now DB-driven — the owner can add / rename / reorder / delete
 * them via the Admin Sheet (Shift+A → "demo" to unlock).
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
  category: string; // = MenuCategory.key
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
  { key: "waffles", labelFr: "Gaufres", labelEn: "Waffles", displayOrder: 2 },
  { key: "brunch", labelFr: "Brunch & Thé", labelEn: "Brunch & Tea", displayOrder: 3 },
  { key: "bakery", labelFr: "Pâtisseries", labelEn: "Pastries", displayOrder: 4 },
];

const menu: Seed[] = [
  // --- Pancakes ---
  {
    category: "pancakes",
    order: 1,
    nameFr: "Pancakes classiques",
    nameEn: "Classic pancakes",
    descFr: "Sirop d'érable, beurre fermier salé",
    descEn: "Maple syrup, salted farm butter",
    price: 65,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0fda198e2e9b.jpg",
    photoSize: "feature", // hero of the pancakes section
  },
  {
    category: "pancakes",
    order: 2,
    nameFr: "Pancakes aux fruits rouges",
    nameEn: "Berry pancakes",
    descFr: "Framboises, myrtilles, coulis maison",
    descEn: "Raspberries, blueberries, house coulis",
    price: 75,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9b9f94be3de8.jpg",
    photoSize: "medium",
  },
  {
    category: "pancakes",
    order: 3,
    nameFr: "Pancakes chocolat",
    nameEn: "Chocolate pancakes",
    descFr: "Pépites noir 70%, cacao cru",
    descEn: "70% dark chunks, raw cacao",
    price: 75,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c14677c1a7fb.jpg",
    photoSize: "small",
  },
  {
    category: "pancakes",
    order: 4,
    nameFr: "Pancakes agrumes & miel",
    nameEn: "Citrus & honey pancakes",
    descFr: "Orange sanguine, fleur d'oranger, miel",
    descEn: "Blood orange, orange blossom, honey",
    price: 80,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3b4eda9561bd.jpg",
    photoSize: "small",
  },

  // --- Waffles ---
  {
    category: "waffles",
    order: 1,
    nameFr: "Gaufre classique",
    nameEn: "Classic waffle",
    descFr: "Sucre perlé, beurre salé, sirop au choix",
    descEn: "Pearl sugar, salted butter, syrup of choice",
    price: 55,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/133ea9e2a354.jpg",
    photoSize: "medium",
  },
  {
    category: "waffles",
    order: 2,
    nameFr: "Gaufre Liégeois",
    nameEn: "Liège waffle",
    descFr: "Sucre perlé maison, vanille de Madagascar",
    descEn: "House pearl sugar, Madagascar vanilla",
    price: 65,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9deebcca46c9.jpg",
    photoSize: "feature",
  },
  {
    category: "waffles",
    order: 3,
    nameFr: "Gaufre aux fruits rouges",
    nameEn: "Berry waffle",
    descFr: "Framboises, myrtilles, chantilly végétale",
    descEn: "Raspberries, blueberries, plant cream",
    price: 75,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7cbe41e2818f.jpg",
    photoSize: "small",
  },

  // --- Brunch & Tea ---
  {
    category: "brunch",
    order: 1,
    nameFr: "Brunch (sucré)",
    nameEn: "Brunch (sweet)",
    descFr: "Pancakes ou gaufre au choix, thé à la menthe, jus du jour, fruit",
    descEn: "Pancakes or waffle of choice, mint tea, juice of the day, fruit",
    price: 120,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/72e3d6bddb87.jpg",
    photoSize: "feature",
  },
  {
    category: "brunch",
    order: 2,
    nameFr: "Brunch (salé)",
    nameEn: "Brunch (savoury)",
    descFr: "Œufs au plat, pain au levain, fromage frais, salade, thé",
    descEn: "Fried eggs, sourdough, fresh cheese, salad, tea",
    price: 130,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/facfee257955.jpg",
    photoSize: "medium",
  },
  {
    category: "brunch",
    order: 3,
    nameFr: "Thé à la menthe (théière)",
    nameEn: "Mint tea (pot)",
    descFr: "Menthe fraîche du jour, servi à la marocaine",
    descEn: "Fresh mint of the day, served Moroccan style",
    price: 30,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/51ff51794573.jpg",
    photoSize: "small",
  },
  {
    category: "brunch",
    order: 4,
    nameFr: "Café maison",
    nameEn: "House coffee",
    descFr: "Espresso, noisette, ou crème (lait d'avoine)",
    descEn: "Espresso, noisette, or crème (oat milk)",
    price: 22,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/062662ba0b5b.png",
    photoSize: "small",
  },
  {
    category: "brunch",
    order: 5,
    nameFr: "Latte de saison",
    nameEn: "Seasonal latte",
    descFr: "Avoine, cannelle, miel de thym",
    descEn: "Oat, cinnamon, thyme honey",
    price: 32,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b491271d03ec.jpg",
    photoSize: "small",
  },

  // --- Bakery ---
  {
    category: "bakery",
    order: 1,
    nameFr: "Cookie géant",
    nameEn: "Giant cookie",
    descFr: "Chocolat noir, fleur de sel",
    descEn: "Dark chocolate, fleur de sel",
    price: 28,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/672350ccf5ff.jpg",
    photoSize: "medium",
  },
  {
    category: "bakery",
    order: 2,
    nameFr: "Roule à la cannelle",
    nameEn: "Cinnamon roll",
    descFr: "Glaçage au cream cheese végétal",
    descEn: "Plant cream-cheese glaze",
    price: 32,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/aee87a2c8b6d.jpg",
    photoSize: "feature",
  },
  {
    category: "bakery",
    order: 3,
    nameFr: "Brownie",
    nameEn: "Brownie",
    descFr: "Noix, cacao intense, sans gluten",
    descEn: "Walnuts, intense cacao, gluten-free",
    price: 30,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c7a14fb6e29b.jpg",
    photoSize: "small",
  },
  {
    category: "bakery",
    order: 4,
    nameFr: "Banana bread",
    nameEn: "Banana bread",
    descFr: "Mûr, noisettes grillées, miel",
    descEn: "Ripe, toasted hazelnuts, honey",
    price: 28,
    photoUrl:
      "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3bad0dfda649.jpg",
    photoSize: "small",
  },
];

async function main() {
  console.log("🌱 Seeding menu categories + items...");

  // Clear existing
  await db.menuItem.deleteMany({});
  await db.menuCategory.deleteMany({});

  // Insert categories first
  for (const cat of categories) {
    await db.menuCategory.create({ data: cat });
  }

  // Then items (category field references MenuCategory.key)
  for (const item of menu) {
    await db.menuItem.create({ data: item });
  }

  const catCount = await db.menuCategory.count();
  const itemCount = await db.menuItem.count();
  console.log(
    `✅ Seeded ${catCount} categories + ${itemCount} menu items across ${catCount} categories.`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
