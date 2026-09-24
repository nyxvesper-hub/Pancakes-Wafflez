/**
 * GET /api/menu/pdf
 *
 * Generates a vintage-styled A4 PDF of the full menu and returns it as a
 * downloadable attachment. No auth required — anyone visiting the site can
 * grab the PDF (it's a marketing asset).
 *
 * The PDF is generated server-side via pdfkit using the LiberationSerif
 * font (Times-like, available on the system). See scripts/menu-pdf.ts.
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  buildMenuPdf,
} from "@/scripts/menu-pdf";

export const dynamic = "force-dynamic";

export async function GET() {
  // Fetch all items + categories from DB in parallel
  const [items, categories] = await Promise.all([
    db.menuItem.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    }),
    db.menuCategory.findMany({
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  // Build the PDF (now async — pdfkit emits data/end events)
  const pdfBuffer = await buildMenuPdf(
    items as Parameters<typeof buildMenuPdf>[0],
    categories as unknown as Parameters<typeof buildMenuPdf>[1]
  );

  // Return as download
  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="pancakes-and-wafflez-menu.pdf"',
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
