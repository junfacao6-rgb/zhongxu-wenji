import { NextResponse } from "next/server";

export function requireAdmin(request: Request) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return null;

  const token = request.headers.get("x-admin-token") || "";
  if (token === expected) return null;

  return NextResponse.json({ error: "管理员口令不正确" }, { status: 401 });
}
