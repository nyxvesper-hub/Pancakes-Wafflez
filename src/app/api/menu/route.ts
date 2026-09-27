/**
 * GET /api/menu
 *   Returns all menu items. No auth needed — the live site
 *   uses this to render the menu section.
 *
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

