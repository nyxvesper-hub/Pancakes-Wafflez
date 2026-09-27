/**
 * PATCH /api/menu/categories/[key]
 *   Update labelFr, labelEn, or displayOrder for a category. Auth-protected.
 *
 * DELETE /api/menu/categories/[key]
 *   Delete a category. The items in it stay in the DB but their `category`
 *   field becomes orphaned — they'll only show up under that category key,
 *   which no longer exists, so they effectively disappear from the live page
 *   until the owner re-categorizes them. (We could cascade-delete but that's
 *   destructive — better to leave the items intact for safety.)
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminAuthError } from "@/lib/admin-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const authError = adminAuthError(req);
  if (authError) return authError;
  const { key } = await params;
  const body = await req.json();
  const updated = await db.menuCategory.update({
    where: { key },
    data: {
      ...(body.labelFr !== undefined ? { labelFr: body.labelFr } : {}),
      ...(body.labelEn !== undefined ? { labelEn: body.labelEn } : {}),
      ...(body.displayOrder !== undefined
        ? { displayOrder: Number(body.displayOrder) }
        : {}),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const authError = adminAuthError(req);
  if (authError) return authError;
  const { key } = await params;
  await db.menuCategory.delete({ where: { key } });
  return NextResponse.json({ ok: true });
}
