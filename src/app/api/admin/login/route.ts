import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@chinmayigallery.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChinmayiGallery@2026";

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = generateToken();
    const cookieStore = await cookies();

    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Store token hash in a cookie to verify later
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    cookieStore.set("admin_hash", tokenHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  cookieStore.delete("admin_hash");
  return NextResponse.json({ success: true });
}
