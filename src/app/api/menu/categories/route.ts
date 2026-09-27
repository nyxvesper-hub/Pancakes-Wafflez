/**
 * GET /api/menu/categories
 *   Returns all menu categories sorted by displayOrder. Public (no auth).
 *
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

