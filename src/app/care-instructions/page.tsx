import PolicyPage from "@/components/PolicyPage";

export const metadata = { title: "Care Instructions — ChinuN" };

export default function CareInstructionsPage() {
  return (
    <PolicyPage label="Looking After Your Piece" title="Care Instructions">
      <h2 className="font-[Playfair_Display] text-[24px] font-semibold" style={{ color: "var(--text)" }}>Original Paintings</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Hang away from direct sunlight and damp areas to preserve colour.</li>
        <li>Dust gently with a soft, dry, lint-free cloth — never use household cleaners or solvents.</li>
        <li>If the surface looks dull, contact us before attempting to restore it.</li>
      </ul>

      <h2 className="font-[Playfair_Display] text-[24px] font-semibold mt-10" style={{ color: "var(--text)" }}>Prints</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Frame behind UV-protective glass to keep the inks vibrant.</li>
        <li>Avoid hanging in direct sunlight or in bathrooms / kitchens.</li>
      </ul>

      <h2 className="font-[Playfair_Display] text-[24px] font-semibold mt-10" style={{ color: "var(--text)" }}>Jewellery</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Store in a dry place, ideally in the pouch or box provided.</li>
        <li>Remove before showering, swimming, applying lotions and perfumes.</li>
        <li>Polish silver pieces gently with a jewellery cloth as needed.</li>
      </ul>

      <h2 className="font-[Playfair_Display] text-[24px] font-semibold mt-10" style={{ color: "var(--text)" }}>Clothing</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Hand wash or gentle machine cycle in cold water, inside out.</li>
        <li>Do not bleach. Reshape while damp and air dry away from direct sun.</li>
        <li>Iron on the reverse side on a low setting.</li>
      </ul>

      <h2 className="font-[Playfair_Display] text-[24px] font-semibold mt-10" style={{ color: "var(--text)" }}>Home Décor</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Keep away from direct heat sources, water and humidity.</li>
        <li>Dust regularly with a soft cloth or soft brush.</li>
      </ul>
    </PolicyPage>
  );
}
