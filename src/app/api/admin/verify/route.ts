import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const hash = cookieStore.get("admin_hash")?.value;

  if (!token || !hash) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const expectedHash = crypto.createHash("sha256").update(token).digest("hex");

  if (expectedHash !== hash) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
