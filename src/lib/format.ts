// French currency: "2 890 €" with narrow non-breaking space, no decimals.
const NNBSP = " ";

export function formatEUR(amount: number): string {
  const grouped = amount
    .toLocaleString("fr-FR", { maximumFractionDigits: 0 })
    .replace(/\s| /g, NNBSP);
  return `${grouped}${NNBSP}€`;
}
