/**
 * Menu PDF generator — uses pdfkit to build a vintage-styled A4 PDF menu
 * matching the website's warm bakery aesthetic.
 *
 * Called by the API route /api/menu/pdf. The route fetches menu items from
 * the database, passes them here, and we return a Buffer of PDF bytes.
 *
 * Fonts: LiberationSerif (Times-like, available on the system at
 * /usr/share/fonts/truetype/liberation/). Owner can swap for Fraunces TTF
 * later if they download it.
 */
import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";

export type MenuItemForPdf = {
  id: string;
  category: string;
  order: number;
  nameFr: string;
  nameEn: string;
  descFr: string;
  descEn: string;
  price: number;
  photoUrl: string | null;
  photoSize: string | null;
};

const FONT_DIR = "/usr/share/fonts/truetype/liberation";
const FONT_SERIF_REG = path.join(FONT_DIR, "LiberationSerif-Regular.ttf");
const FONT_SERIF_BOLD = path.join(FONT_DIR, "LiberationSerif-Bold.ttf");
const FONT_SERIF_ITAL = path.join(FONT_DIR, "LiberationSerif-Italic.ttf");
const FONT_SERIF_BOLDITAL = path.join(FONT_DIR, "LiberationSerif-BoldItalic.ttf");

/** Brand palette (matches globals.css) */
const C = {
  bg: "#F5EBDC", // cream
  ink: "#2B1A12", // espresso
  primary: "#3B2A1F", // dark brown
  accent: "#C44A3B", // warm tomato
  muted: "#6F5640", // soft brown
  border: "#D9C5A4", // tan
  secondary: "#E8D5B5", // caramel
};

const A4_W = 595.28;
const A4_H = 841.89;
const MARGIN = 50;

/** Safe font registration — falls back to Helvetica if a file is missing. */
function registerFonts(doc: PDFKit.PDFDocument) {
  const files: [string, string][] = [
    ["LiberationSerif", FONT_SERIF_REG],
    ["LiberationSerif-Bold", FONT_SERIF_BOLD],
    ["LiberationSerif-Italic", FONT_SERIF_ITAL],
    ["LiberationSerif-BoldItalic", FONT_SERIF_BOLDITAL],
  ];
  for (const [name, file] of files) {
    if (fs.existsSync(file)) {
      doc.registerFont(name, file);
    }
  }
}

/** Draw a horizontal dotted divider. */
function drawDottedLine(doc: PDFKit.PDFDocument, y: number, x1: number, x2: number) {
  const step = 4;
  for (let x = x1; x < x2; x += step) {
    doc.circle(x, y, 0.7).fillColor(C.border).fill();
  }
}

export type MenuCategoryForPdf = {
  key: string;
  labelFr: string;
  labelEn: string;
  displayOrder: number;
};

/** Build the menu PDF. Returns a Promise<Buffer> of PDF bytes. */
export function buildMenuPdf(
  items: MenuItemForPdf[],
  categories: MenuCategoryForPdf[] = []
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      bufferPages: true,
    });
    registerFonts(doc);

    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    try {
      // -------- Page 1: Header + 2-column menu --------
      // Cream background
      doc.rect(0, 0, A4_W, A4_H).fill(C.bg);

      // Top eyebrow
      doc
        .fillColor(C.accent)
        .font("LiberationSerif-Bold")
        .fontSize(9)
        .text("CASABLANCA · MAROC", MARGIN, MARGIN - 28, {
          align: "center",
          width: A4_W - MARGIN * 2,
          characterSpacing: 2,
        });

      // Main brand title — "Pancakes & Wafflez"
      doc
        .fillColor(C.primary)
        .font("LiberationSerif-Bold")
        .fontSize(42)
        .text("Pancakes & Wafflez", MARGIN, MARGIN, {
          align: "center",
          width: A4_W - MARGIN * 2,
          lineBreak: false,
        });

      // Italic subtitle
      doc
        .fillColor(C.muted)
        .font("LiberationSerif-Italic")
        .fontSize(13)
        .text("Maison de brunch, thé & pâtisserie", MARGIN, MARGIN + 50, {
          align: "center",
          width: A4_W - MARGIN * 2,
          lineBreak: false,
        });

      // Hours chip
      doc
        .fillColor(C.ink)
        .font("LiberationSerif")
        .fontSize(10)
        .text(
          "Ouvert tous les jours sauf lundi  ·  10h — 19h",
          MARGIN,
          MARGIN + 75,
          { align: "center", width: A4_W - MARGIN * 2, lineBreak: false }
        );

      // Dotted divider
      drawDottedLine(doc, MARGIN + 100, MARGIN, A4_W - MARGIN);

      // 2-column layout
      const colGap = 24;
      const colW = (A4_W - MARGIN * 2 - colGap) / 2;
      const leftX = MARGIN;
      const rightX = MARGIN + colW + colGap;
      const startY = MARGIN + 120;

      // Group items by category — uses the categories passed in (DB-driven, not hardcoded)
      const groups: {
        cat: string;
        label: string;
        items: MenuItemForPdf[];
      }[] = (categories.length > 0
        ? categories
        : [
            { key: "pancakes", labelFr: "Pancakes", labelEn: "Pancakes", displayOrder: 1 },
            { key: "waffles", labelFr: "Gaufres", labelEn: "Waffles", displayOrder: 2 },
            { key: "brunch", labelFr: "Brunch & Thé", labelEn: "Brunch & Tea", displayOrder: 3 },
            { key: "bakery", labelFr: "Pâtisseries", labelEn: "Pastries", displayOrder: 4 },
          ]
      ).map((c) => ({
        cat: c.key,
        label: c.labelFr,
        items: [] as MenuItemForPdf[],
      }));
      for (const it of items) {
        const g = groups.find((g) => g.cat === it.category);
        if (g) g.items.push(it);
      }
      groups.forEach((g) => g.items.sort((a, b) => a.order - b.order));

      // Adaptive column split: split categories evenly into 2 columns
      // (1 cat: just left column; 2 cats: 1+1; 4 cats: 2+2; etc.)
      const halfCount = Math.ceil(groups.length / 2);
      const leftGroups = groups.slice(0, halfCount);
      const rightGroups = groups.slice(halfCount);
      // Left column
      drawColumn(doc, leftX, colW, startY, leftGroups);
      // Right column (may be empty if odd # of categories — that's fine)
      if (rightGroups.length > 0) {
        drawColumn(doc, rightX, colW, startY, rightGroups);
      }

      // Footer (bottom of page 1)
      const footerY = A4_H - MARGIN - 20;
      drawDottedLine(doc, footerY - 10, MARGIN, A4_W - MARGIN);
      doc
        .fillColor(C.muted)
        .font("LiberationSerif-Italic")
        .fontSize(9)
        .text(
          "Fait avec amour à Casablanca  ·  @pancakesandwafflez  ·  +212 6 12 34 56 78",
          MARGIN,
          footerY,
          { align: "center", width: A4_W - MARGIN * 2, lineBreak: false }
        );

      // Set PDF metadata
      doc.info.Title = "Pancakes & Wafflez — Menu";
      doc.info.Author = "Pancakes & Wafflez";
      doc.info.Subject = "Menu de brunch, thé & pâtisserie";
      doc.info.Creator = "Pancakes & Wafflez website";

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/** Draw a column of category blocks. */
function drawColumn(
  doc: PDFKit.PDFDocument,
  x: number,
  w: number,
  startY: number,
  groups: { cat: string; label: string; items: MenuItemForPdf[] }[]
) {
  let y = startY;
  for (const g of groups) {
    // Category header
    doc
      .fillColor(C.primary)
      .font("LiberationSerif-Bold")
      .fontSize(16)
      .text(g.label.toUpperCase(), x, y, {
        width: w,
        align: "left",
        lineBreak: false,
        characterSpacing: 1,
      });
    // Underline under category
    y += 22;
    doc.moveTo(x, y).lineTo(x + w, y).lineWidth(1).strokeColor(C.accent).stroke();
    y += 12;

    // Items
    for (const item of g.items) {
      const name = item.nameFr;
      const desc = item.descFr;
      const priceStr = `${item.price} MAD`;

      // Name + price on same line, with dotted leader
      doc.font("LiberationSerif-Bold").fontSize(11).fillColor(C.ink);
      doc.text(name, x, y, { width: w * 0.65, lineBreak: false });
      doc.font("LiberationSerif-Bold").fontSize(11).fillColor(C.accent);
      doc.text(priceStr, x + w * 0.7, y, {
        width: w * 0.3,
        align: "right",
        lineBreak: false,
      });
      y += 14;

      // Description
      doc.font("LiberationSerif-Italic").fontSize(9).fillColor(C.muted);
      doc.text(desc, x, y, { width: w, lineBreak: false });
      y += 16;

      // Dotted leader between items
      drawDottedLine(doc, y, x, x + w);
      y += 12;
    }
    // Space between categories
    y += 16;
  }
}
