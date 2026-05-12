import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Shipping & Returns — ChinuN" };

export default function ShippingReturnsPage() {
  return (
    <PolicyPage label="Delivery & Returns" title="Shipping & Returns">
      <h2 className="font-[Playfair_Display] text-[24px] font-semibold" style={{ color: "var(--text)" }}>Delivery</h2>
      <p>
        We ship original artworks, prints, jewellery, clothing, home décor and books worldwide. All
        items are carefully wrapped and despatched from the artist&apos;s Essex studio.
      </p>

      <ul className="list-disc list-inside space-y-2">
        <li><strong style={{ color: "var(--text)" }}>Free local delivery within Essex</strong> — hand-delivered when possible.</li>
        <li><strong style={{ color: "var(--text)" }}>Free Standard UK delivery for orders over £75</strong>.</li>
        <li>Standard UK delivery for orders under £75: a small flat charge added at checkout.</li>
        <li>International orders: shipping calculated based on size, weight and destination — please <a href="/contact" style={{ color: "var(--gold)" }}>contact us</a> for a quote before purchase, or proceed to checkout to see live rates.</li>
      </ul>

      <h2 className="font-[Playfair_Display] text-[24px] font-semibold mt-10" style={{ color: "var(--text)" }}>Despatch Times</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Ready-to-ship paintings, prints, jewellery and home décor: despatched within 2–3 working days.</li>
        <li>Books: despatched within 2 working days.</li>
        <li>Commissioned and custom pieces: timeline confirmed when the commission is agreed (typically 2–6 weeks).</li>
      </ul>

      <h2 className="font-[Playfair_Display] text-[24px] font-semibold mt-10" style={{ color: "var(--text)" }}>Returns</h2>
      <p>
        Original paintings and commissioned pieces are non-returnable. For all other items
        (prints, jewellery, clothing, home décor and books) you may return your order within
        14 days of delivery, provided the item is in its original condition.
      </p>
      <p>
        To start a return, please <a href="/contact" style={{ color: "var(--gold)" }}>email us</a> with
        your order reference. Return shipping is the buyer&apos;s responsibility unless the item arrived
        damaged.
      </p>

      <h2 className="font-[Playfair_Display] text-[24px] font-semibold mt-10" style={{ color: "var(--text)" }}>Damaged in Transit</h2>
      <p>
        If your order arrives damaged, please email us within 48 hours with photos of both the
        packaging and the item. We will arrange a full refund or replacement.
      </p>
    </PolicyPage>
  );
}
