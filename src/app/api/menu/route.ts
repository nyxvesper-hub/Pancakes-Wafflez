/**
 * GET /api/menu
 *   Returns all menu items grouped by category. No auth needed — the live site
 *   uses this to render the menu section.
 *
 * POST /api/menu
 *   Creates a new menu item. **Auth-protected** via a simple admin token
 *   the ADMIN_TOKEN environment variable. The body must match
 *   the MenuItem schema minus the auto fields (id, createdAt, updatedAt).
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminAuthError } from "@/lib/admin-auth";

/** Simple in-memory cache (10s TTL) to skip re-hitting the DB during the page's many parallel reads. */
let cache: { at: number; data: unknown } | null = null;
const CACHE_TTL_MS = 10_000;

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return NextResponse.json(cache.data);
  }
  const items = await db.menuItem.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
  cache = { at: Date.now(), data: items };
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const authError = adminAuthError(req);
  if (authError) return authError;
  const body = await req.json();
  // Basic validation — let Prisma enforce the rest
  if (
    !body.category ||
    !body.nameFr ||
    !body.nameEn ||
    typeof body.descFr !== "string" ||
    typeof body.descEn !== "string" ||
    typeof body.price !== "number"
  ) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: category, nameFr, nameEn, descFr, descEn, price",
      },
      { status: 400 }
    );
  }
  const created = await db.menuItem.create({
    data: {
      category: body.category,
      order: Number(body.order ?? 0),
      nameFr: body.nameFr,
      nameEn: body.nameEn,
      descFr: body.descFr,
      descEn: body.descEn,
      price: Number(body.price),
      photoUrl: body.photoUrl || null,
      photoSize: body.photoSize || "small",
      showInGallery:
        typeof body.showInGallery === "boolean" ? body.showInGallery : true,
    },
  });
  cache = null; // invalidate
  return NextResponse.json(created, { status: 201 });
}
