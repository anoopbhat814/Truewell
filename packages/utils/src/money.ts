export function formatCents(cents: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);
}

export function sumCents(values: Array<number | null | undefined>): number {
  return values.reduce<number>((acc, v) => acc + (v ?? 0), 0);
}

/** Estimated patient share: copay first, then remaining deductible, then coinsurance on the rest. */
export function estimatePatientShare(
  allowedCents: number,
  copayCents: number,
  deductibleRemainingCents: number,
  coinsuranceRate = 0.2,
): number {
  const copay = Math.min(copayCents, allowedCents);
  let remaining = allowedCents - copay;
  const deductible = Math.min(deductibleRemainingCents, remaining);
  remaining -= deductible;
  return copay + deductible + Math.round(remaining * coinsuranceRate);
}
