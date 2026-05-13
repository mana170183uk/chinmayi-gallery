import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const TO_EMAIL = "chinmayi_n@yahoo.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "ChinuN Orders <onboarding@resend.dev>";

// Essex postcode area prefixes — must stay in sync with src/app/checkout/page.tsx
// and docs/essex-postcodes.md
const ESSEX_POSTCODE_PREFIXES = ["CM", "CO", "SS", "IG", "RM"] as const;

function isEssexPostcode(postcode: string): boolean {
  if (!postcode) return false;
  const p = postcode.trim().toUpperCase().replace(/\s+/g, "");
  return ESSEX_POSTCODE_PREFIXES.some((prefix) => p.startsWith(prefix));
}

function calcShipping(subtotal: number, postcode: string): { cost: number; reason: string } {
  if (isEssexPostcode(postcode)) return { cost: 0, reason: "FREE — local Essex delivery" };
  if (subtotal >= 75) return { cost: 0, reason: "FREE — UK orders over £75" };
  return { cost: 5, reason: "£5 standard UK delivery" };
}

function genReference(): string {
  return `CHN-${Math.random().toString(36).slice(2, 7).toUpperCase()}-${Date.now().toString().slice(-4)}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { artwork: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json([]);
  }
}

interface CheckoutItem {
  id: string;
  kind: "artwork" | "product" | "book";
  title: string;
  price: number;
  quantity: number;
}

export async function POST(request: NextRequest) {
  let body: {
    customerName?: string;
    customerEmail?: string;
    shippingAddress?: string;
    postcode?: string;
    items?: CheckoutItem[];
    subtotal?: number;
    total?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = (body.customerName || "").trim();
  const email = (body.customerEmail || "").trim();
  const address = (body.shippingAddress || "").trim();
  const postcode = (body.postcode || "").trim();
  const items = body.items || [];
  const subtotal = typeof body.subtotal === "number" ? body.subtotal : items.reduce((s, i) => s + i.price * i.quantity, 0);

  // Recompute shipping server-side so the client can't manipulate it
  const shippingInfo = calcShipping(subtotal, postcode);
  const shipping = shippingInfo.cost;
  const shippingReason = shippingInfo.reason;
  const total = subtotal + shipping;

  if (!name || !email || !address || !postcode) {
    return NextResponse.json({ error: "Name, email, shipping address and postcode are required." }, { status: 400 });
  }
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const reference = genReference();

  // Save order (without OrderItem rows — itemsJson holds the full snapshot)
  try {
    await prisma.order.create({
      data: {
        customerName: name,
        customerEmail: email,
        shippingAddress: address,
        total,
        status: "pending",
        paymentReference: reference,
        paymentMethod: "bank_transfer",
        itemsJson: JSON.stringify(items),
      },
    });
  } catch (e) {
    // Don't fail the whole flow if DB write fails — the email will still tell the artist
    console.error("Order DB write failed:", e);
  }

  // Build the email body
  const itemsHtml = items
    .map(
      (it) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(it.title)} <span style="color:#888;font-size:12px;">(${it.kind})</span></td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${it.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">£${(it.price * it.quantity).toLocaleString()}</td>
        </tr>`
    )
    .join("");

  const adminHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
      <h2 style="color: #b8860b; border-bottom: 2px solid #b8860b; padding-bottom: 8px;">New Order — ${escapeHtml(reference)}</h2>
      <p><strong>Customer:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      <p><strong>Shipping address:</strong><br>${escapeHtml(address).replace(/\n/g, "<br>")}</p>
      <p><strong>Payment method:</strong> UK bank transfer</p>
      <p><strong>Payment reference:</strong> ${escapeHtml(reference)}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <thead><tr style="background:#f7f7f7;"><th style="padding:8px 12px;text-align:left;">Item</th><th style="padding:8px 12px;">Qty</th><th style="padding:8px 12px;text-align:right;">Subtotal</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr><td colspan="2" style="padding:8px 12px;text-align:right;color:#666;">Subtotal:</td><td style="padding:8px 12px;text-align:right;">£${subtotal.toLocaleString()}</td></tr>
          <tr><td colspan="2" style="padding:8px 12px;text-align:right;color:#666;">Shipping (${escapeHtml(shippingReason)}):</td><td style="padding:8px 12px;text-align:right;">${shipping === 0 ? "FREE" : "£" + shipping.toLocaleString()}</td></tr>
          <tr style="border-top:2px solid #b8860b;"><td colspan="2" style="padding:12px;text-align:right;font-weight:bold;">Total:</td><td style="padding:12px;text-align:right;font-weight:bold;color:#b8860b;">£${total.toLocaleString()}</td></tr>
        </tfoot>
      </table>
      <p style="margin-top:24px;font-size:13px;color:#888;">Awaiting bank transfer. The customer has been emailed with payment instructions referencing <strong>${escapeHtml(reference)}</strong>.</p>
    </div>
  `;

  const customerHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
      <h2 style="color: #b8860b;">Thank you for your order, ${escapeHtml(name.split(" ")[0])}!</h2>
      <p>We've received your order and reserved your items. To complete the purchase, please make a UK bank transfer for <strong>£${total.toLocaleString()}</strong> using the details below.</p>

      <div style="background:#fafafa;border:1px solid #ddd;border-left:4px solid #b8860b;padding:16px;border-radius:8px;margin:16px 0;">
        <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Payment Reference</p>
        <p style="margin:0;font-family:monospace;font-size:22px;font-weight:bold;color:#b8860b;">${escapeHtml(reference)}</p>
        <p style="margin:12px 0 0;font-size:13px;color:#666;">Please include this reference when making the transfer so we can match your payment.</p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-top:8px;">
        <tr><td style="padding:4px 12px;color:#888;width:160px;">Account Name</td><td style="padding:4px 12px;font-weight:600;">Chinmayi Rekha Nath</td></tr>
        <tr><td style="padding:4px 12px;color:#888;">Sort Code</td><td style="padding:4px 12px;font-family:monospace;">40-25-31</td></tr>
        <tr><td style="padding:4px 12px;color:#888;">Account Number</td><td style="padding:4px 12px;font-family:monospace;">41697455</td></tr>
        <tr><td style="padding:4px 12px;color:#888;">Amount</td><td style="padding:4px 12px;font-weight:600;color:#b8860b;">£${total.toLocaleString()}</td></tr>
      </table>

      <h3 style="margin-top:32px;">Your order</h3>
      <table style="width:100%;border-collapse:collapse;margin-top:8px;">
        <tbody>${itemsHtml}</tbody>
        <tfoot><tr><td colspan="2" style="padding:12px;text-align:right;font-weight:bold;">Total:</td><td style="padding:12px;text-align:right;font-weight:bold;color:#b8860b;">£${total.toLocaleString()}</td></tr></tfoot>
      </table>

      <p style="margin-top:24px;font-size:13px;color:#666;">Once your transfer is received, we'll despatch your order and send tracking details where applicable. Any questions, just reply to this email or contact <a href="mailto:chinmayi_n@yahoo.com">chinmayi_n@yahoo.com</a>.</p>
      <p style="margin-top:16px;font-size:13px;color:#666;">With warmth,<br><strong>Chinmayi Nath</strong><br>ChinuN — chinun.uk</p>
    </div>
  `;

  // Send emails (best-effort)
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend = new Resend(apiKey);
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        replyTo: email,
        subject: `[ChinuN] New order ${reference} — £${total.toLocaleString()} — ${name}`,
        html: adminHtml,
      });
    } catch (e) {
      console.error("Admin email failed:", e);
    }
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        replyTo: TO_EMAIL,
        subject: `Your ChinuN order ${reference} — payment instructions`,
        html: customerHtml,
      });
    } catch (e) {
      console.error("Customer email failed:", e);
    }
  }

  return NextResponse.json({ success: true, reference });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const order = await prisma.order.update({
      where: { id: body.id },
      data: {
        status: body.status,
        ...(body.shippingAddress !== undefined && { shippingAddress: body.shippingAddress || null }),
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
