import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const TO_EMAIL = "chinmayi_n@yahoo.com";
// Resend's onboarding sender works without domain verification.
// To use a custom From address, verify a domain in Resend and set RESEND_FROM_EMAIL.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Chinmayi Gallery <onboarding@resend.dev>";

export async function GET() {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const subject = (body.subject || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // Persist to DB so submissions are never lost even if email fails.
  try {
    await prisma.contactSubmission.create({
      data: { name, email, subject, message },
    });
  } catch {
    // DB write is best-effort; do not block the email
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Email service is not configured. Your message was saved — please email chinmayi_n@yahoo.com directly while we resolve this.",
      },
      { status: 500 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
        <h2 style="color: #b8860b; border-bottom: 2px solid #b8860b; padding-bottom: 8px;">New Enquiry — ChinuN</h2>
        <p style="margin: 16px 0 4px;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p style="margin: 4px 0;"><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e5e5;">
        <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e5e5;">
        <p style="font-size: 12px; color: #888;">Reply directly to this email to respond to ${escapeHtml(name)}.</p>
        <p style="font-size: 12px; color: #888;">— chinun.uk</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `[ChinuN] ${subject} — from ${name}`,
      html,
    });

    if (error) {
      return NextResponse.json(
        { error: `Could not send email: ${error.message || "unknown error"}. Your message was saved.` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      { error: `Could not send email: ${msg}. Your message was saved.` },
      { status: 502 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
