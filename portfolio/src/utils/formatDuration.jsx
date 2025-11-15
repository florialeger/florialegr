/**
 * formatDuration
 * Accepts a duration value from data.json and returns a human-friendly label.
 * Supported inputs:
 *  - numeric string or number -> interpreted as months ("1 month", "2 months")
 *  - strings like "2 weeks", "3 days" (case-insensitive) -> preserved with correct pluralization
 *  - "ongoing" (case-insensitive) -> returned as-is (capitalization preserved)
 *  - empty/null -> null
 */
export const formatDuration = (input) => {
  if (input === null || typeof input === 'undefined' || input === '') return null;

  const raw = String(input).trim();
  if (!raw) return null;

  if (/^ongoing$/i.test(raw)) return 'ongoing';

  // match explicit weeks/days like "2 weeks", "1 week", "10 days"
  const wdMatch = raw.match(/^(\d+(?:\.\d+)?)\s*(weeks?|w|days?|d)$/i);
  if (wdMatch) {
    const amount = Number(wdMatch[1]);
    const unitRaw = wdMatch[2].toLowerCase();
    const unit = /w/i.test(unitRaw)
      ? amount > 1
        ? 'weeks'
        : 'week'
      : /d/i.test(unitRaw)
        ? amount > 1
          ? 'days'
          : 'day'
        : unitRaw;
    return `${amount} ${unit}`;
  }

  // If input is numeric, interpret as months
  const numeric = Number(raw);
  if (!Number.isNaN(numeric)) {
    // allow fractional months? If <1, convert to weeks (approx 4.345 weeks per month)
    if (numeric > 0 && numeric < 1) {
      const weeks = Math.round(numeric * 4.345);
      if (weeks <= 0) return `${Math.round(numeric * 30)} days`;
      return `${weeks} ${weeks > 1 ? 'weeks' : 'week'}`;
    }
    if (numeric === 1) return '1 month';
    return `${numeric} months`;
  }

  // If the value is a free-form string, just return it as-is (best effort)
  return raw;
};

export default formatDuration;
