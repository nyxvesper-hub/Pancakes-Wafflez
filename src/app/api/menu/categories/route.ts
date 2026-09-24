/**
 * GET /api/menu/categories
 *   Returns all menu categories sorted by displayOrder. Public (no auth).
 *
 * POST /api/menu/categories
 *   Creates a new category. Auth-protected (same ADMIN_TOKEN as item routes).
 *   Body: { key, labelFr, labelEn, displayOrder? }
 *   - `key` must be unique (it's the @id). Use lowercase slug like "smoothies".
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "demo";

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  return token === ADMIN_TOKEN;
}

let cache: { at: number; data: unknown } | null = null;
const CACHE_TTL_MS = 10_000;

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return NextResponse.json(cache.data);
  }
  const cats = await db.menuCategory.findMany({
    orderBy: { displayOrder: "asc" },
  });
  cache = { at: Date.now(), data: cats };
  return NextResponse.json(cats);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (!body.key || !body.labelFr || !body.labelEn) {
    return NextResponse.json(
      { error: "Missing required fields: key, labelFr, labelEn" },
      { status: 400 }
    );
  }
  // Validate key is a slug-friendly string
  if (!/^[a-z0-9-]+$/.test(String(body.key))) {
    return NextResponse.json(
      {
        error:
          "Key must be lowercase letters, digits, or hyphens only (e.g. 'smoothies').",
      },
      { status: 400 }
    );
  }
  const created = await db.menuCategory.create({
    data: {
      key: String(body.key),
      labelFr: String(body.labelFr),
      labelEn: String(body.labelEn),
      displayOrder: Number(body.displayOrder ?? 99),
    },
  });
  cache = null;
  return NextResponse.json(created, { status: 201 });
}
