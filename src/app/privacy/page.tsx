import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Privacy Policy — ChinuN" };

export default function PrivacyPage() {
  return (
    <PolicyPage label="Your Information" title="Privacy Policy">
      <p>
        ChinuN (&quot;we&quot;, &quot;us&quot;) takes your privacy seriously. This page summarises what information we
        collect, why we collect it, and how we use it.
      </p>

      <h2 className="font-[Playfair_Display] text-[22px] font-semibold mt-8" style={{ color: "var(--text)" }}>What we collect</h2>
      <ul className="list-disc list-inside space-y-2">
        <li><strong style={{ color: "var(--text)" }}>Contact form:</strong> name, email and message — used solely to reply to your enquiry.</li>
        <li><strong style={{ color: "var(--text)" }}>Newsletter sign-ups:</strong> just your email — used to send occasional updates about new paintings and exhibitions. You can unsubscribe at any time.</li>
        <li><strong style={{ color: "var(--text)" }}>Orders:</strong> name, email, shipping address and items purchased — used to fulfil your order.</li>
      </ul>

      <h2 className="font-[Playfair_Display] text-[22px] font-semibold mt-8" style={{ color: "var(--text)" }}>What we do NOT do</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>We do not sell your data.</li>
        <li>We do not share your data with third parties for marketing.</li>
        <li>We do not use intrusive tracking — only basic site analytics.</li>
      </ul>

      <h2 className="font-[Playfair_Display] text-[22px] font-semibold mt-8" style={{ color: "var(--text)" }}>Cookies</h2>
      <p>
        Essential cookies are used to keep your shopping cart working and to remember your theme
        preference (light/dark). No advertising cookies are set.
      </p>

      <h2 className="font-[Playfair_Display] text-[22px] font-semibold mt-8" style={{ color: "var(--text)" }}>Your rights</h2>
      <p>
        You can ask us at any time to see, correct or delete the personal information we hold
        about you. Email <a href="mailto:chinmayi_n@yahoo.com" style={{ color: "var(--gold)" }}>chinmayi_n@yahoo.com</a> with the subject &quot;Privacy Request&quot;.
      </p>

      <h2 className="font-[Playfair_Display] text-[22px] font-semibold mt-8" style={{ color: "var(--text)" }}>Contact</h2>
      <p>
        For any privacy questions, please email <a href="mailto:chinmayi_n@yahoo.com" style={{ color: "var(--gold)" }}>chinmayi_n@yahoo.com</a>.
      </p>
    </PolicyPage>
  );
}
