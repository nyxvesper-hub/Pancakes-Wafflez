/**
 * GET /api/settings
 *   Returns the single SiteSettings row (or null if never set). No auth —
 *   the public page reads this to render the "Our Story" section.
 *
 * PATCH /api/settings
 *   Upserts the singleton row (id = 1). Auth-protected via the same
 *   ADMIN_TOKEN as the menu endpoints. Any field left out of the body is
 *   left unchanged.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminAuthError } from "@/lib/admin-auth";

export async function GET() {
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  return NextResponse.json(settings ?? null);
}

export async function PATCH(req: NextRequest) {
  const authError = adminAuthError(req);
  if (authError) return authError;
  const body = await req.json();
  const allowed = [
    "storyTitleFr",
    "storyTitleEn",
    "storyBodyFr1",
    "storyBodyEn1",
    "storyBodyFr2",
    "storyBodyEn2",
    "storyPhotoUrl",
  ] as const;
  const data: Record<string, string | null> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }
  const settings = await db.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  return NextResponse.json(settings);
}