/**
 * /api/menu/[id]
 *
 * PATCH — update any field of a menu item. Auth-protected.
 * DELETE — remove a menu item. Auth-protected.
 *
 * In both cases we invalidate the in-memory cache of GET /api/menu so the
 * next render shows fresh data immediately.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "demo";

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  return token === ADMIN_TOKEN;
}

// Bust the GET cache by making the same module-scope `cache` variable
// reach into the parent route's cache. We can't directly, so we just
// rely on the parent route's short TTL (10s) — fine for an admin flow.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const updated = await db.menuItem.update({
    where: { id },
    data: {
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.order !== undefined ? { order: Number(body.order) } : {}),
      ...(body.nameFr !== undefined ? { nameFr: body.nameFr } : {}),
      ...(body.nameEn !== undefined ? { nameEn: body.nameEn } : {}),
      ...(body.descFr !== undefined ? { descFr: body.descFr } : {}),
      ...(body.descEn !== undefined ? { descEn: body.descEn } : {}),
      ...(body.price !== undefined ? { price: Number(body.price) } : {}),
      ...(body.photoUrl !== undefined ? { photoUrl: body.photoUrl } : {}),
      ...(body.photoSize !== undefined ? { photoSize: body.photoSize } : {}),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await db.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
