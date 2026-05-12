import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const TO_EMAIL = "chinmayi_n@yahoo.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "ChinuN Newsletter <onboarding@resend.dev>";

export async function GET() {
  try {
    const subs = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(subs);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Save subscription (idempotent — ignore unique-constraint duplicates)
  try {
    await prisma.newsletterSubscriber.create({ data: { email } });
  } catch {
    // already subscribed — still respond OK so the user has a nice experience
    return NextResponse.json({ success: true, alreadySubscribed: true });
  }

  // Notify the artist (best-effort, non-blocking failure)
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject: "[ChinuN] New newsletter sign-up",
        html: `<p>A new visitor has joined the ChinuN newsletter.</p><p><strong>Email:</strong> ${email}</p>`,
      });
    } catch {
      // ignore
    }
  }

  return NextResponse.json({ success: true });
}
