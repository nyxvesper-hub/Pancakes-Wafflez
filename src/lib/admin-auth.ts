import { NextRequest, NextResponse } from "next/server";

export function adminAuthError(req: NextRequest): NextResponse | null {
  const configuredToken = process.env.ADMIN_TOKEN;

  if (!configuredToken) {
    return NextResponse.json(
      { error: "Admin authentication is not configured" },
      { status: 503 }
    );
  }

  const authorization = req.headers.get("authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "");

  if (token !== configuredToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}