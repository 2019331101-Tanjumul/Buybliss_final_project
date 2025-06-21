export function parsePrice(price) {
  const value = String(price);
  if (!value || value.toLowerCase().includes("out of stock")) return "Out Of Stock";

  // Match all number groups (e.g. 2,499 or 2599)
  const matches = value.match(/[\d,]+/g);

  if (!matches || matches.length === 0) return "Out Of Stock";

  // Use the first match, remove commas, and convert to float
  const firstPrice = parseFloat(matches[0].replace(/,/g, ""));

  return isNaN(firstPrice) || firstPrice === 0 ? "Out Of Stock" : firstPrice;
}