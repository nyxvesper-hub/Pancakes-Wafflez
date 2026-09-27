/**
 * GET /api/verify
 *   Checks the Authorization: Bearer <token> header against ADMIN_TOKEN.
 *   Returns 200 { ok: true } if correct, 401 { ok: false } otherwise.
 *   Used by the admin unlock form to give an immediate, honest "wrong
 *   password" response instead of silently unlocking the UI and only
 *   failing later when the owner tries to save an edit.
 */
import { NextRequest, NextResponse } from "next/server";
import { adminAuthError } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const authError = adminAuthError(req);
  if (authError) {
    return NextResponse.json(
      { ok: false, error: (await authError.json()).error },
      { status: authError.status }
    );
  }
  return NextResponse.json({ ok: true });
}