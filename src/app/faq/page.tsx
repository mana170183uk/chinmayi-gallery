import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "FAQ — ChinuN" };

const faqs = [
  {
    q: "Are the paintings originals?",
    a: "Yes — every painting in the Art Gallery is a one-of-a-kind original by Chinmayi Nath, hand-painted with museum-grade materials and signed.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. Standard UK shipping is free for orders over £75. International orders are calculated at checkout, or contact us for a custom quote on larger artworks.",
  },
  {
    q: "Can I commission a custom painting?",
    a: "Absolutely. Use the 'Custom Designs Made to Order' section on the home page or the Contact form. Share your vision, dimensions and colour palette and the artist will reply with a proposal and timeline.",
  },
  {
    q: "How long does a commission take?",
    a: "Typically 2–6 weeks, depending on size and complexity. We agree the timeline together before any work begins.",
  },
  {
    q: "What does NFS mean on some paintings?",
    a: "NFS stands for 'Not For Sale'. These pieces are part of the artist's personal collection or have been promised to private collectors and are shown for reference only.",
  },
  {
    q: "Can I see a painting in person before buying?",
    a: "Studio visits in Essex can be arranged by appointment. Get in touch via the Contact page to organise a visit.",
  },
  {
    q: "Do you offer prints of sold paintings?",
    a: "Limited-edition prints are sometimes available for popular originals. Check the Prints section in the Art Gallery, or contact us to enquire about a specific piece.",
  },
  {
    q: "How do I care for my painting?",
    a: "See our full Care Instructions page for paintings, prints, jewellery, clothing and home décor.",
  },
  {
    q: "What is your returns policy?",
    a: "Original paintings and commissions are non-returnable. Other items can be returned within 14 days. See Shipping & Returns for full details.",
  },
];

export default function FAQPage() {
  return (
    <PolicyPage label="Frequently Asked Questions" title="FAQ">
      <div className="space-y-8">
        {faqs.map((f) => (
          <div key={f.q}>
            <h3 className="font-[Cormorant_Garamond] text-[20px] font-semibold mb-2" style={{ color: "var(--text)" }}>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </div>
    </PolicyPage>
  );
}
