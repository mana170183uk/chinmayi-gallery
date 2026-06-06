// Shared discount helper. Returns the whole-number percent off when there's a
// genuine discount (originalPrice strictly greater than the current price),
// otherwise null so callers can simply do `pct && <Badge/>`.
export function discountPercent(
  price?: number | null,
  originalPrice?: number | null
): number | null {
  if (!price || !originalPrice || originalPrice <= price) return null;
  return Math.round((1 - price / originalPrice) * 100);
}
