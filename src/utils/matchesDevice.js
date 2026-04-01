/**
 * Generic device-matching: checks if `mainStr` contains keywords for a device.
 *
 * Each device in the DISPOSITIVOS array should include a `match` field:
 *   - Array of strings  → any keyword present = match
 *   - Array with nested arrays → inner array = AND (all must appear)
 *
 * Examples:
 *   match: ['picc']                       → m.includes('picc')
 *   match: [['cvc', 'yugular']]           → m.includes('cvc') && m.includes('yugular')
 *   match: ['hickman', 'tunelizado']      → m.includes('hickman') || m.includes('tunelizado')
 */
export function matchesDevice(mainStr, matchTerms) {
  if (!mainStr || !matchTerms) return false;
  const m = mainStr.toLowerCase();
  return matchTerms.some(term =>
    Array.isArray(term)
      ? term.every(t => m.includes(t))
      : m.includes(term),
  );
}
