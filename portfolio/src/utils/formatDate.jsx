/**
 * Formats a date string into a readable format with abbreviated month, day and year.
 * Examples:
 *  - "2025-02-13" -> "Feb 13, 2025"
 *  - "2025-02"    -> "Feb 1, 2025" (falls back to start of month)
 * @param {string|Date} dateInput - The date (ISO string or Date) to format.
 * @param {string} locale - Locale for Intl formatting (default: 'en-US').
 * @returns {string} Formatted date like "Feb 13, 2025" or "Unknown" when invalid.
 */
export const formatDate = (dateInput, locale = 'en-US', options = {}) => {
  if (!dateInput) return 'Unknown';

  // Accept either a Date object or a string. Try to create a Date safely.
  // If input looks like YYYY-MM (no day), treat specially to avoid showing the fallback day.
  const isYearMonth = typeof dateInput === 'string' && /^\d{4}-\d{2}$/.test(dateInput);
  const date = dateInput instanceof Date ? dateInput : new Date(isYearMonth ? `${dateInput}-01` : dateInput);
  if (Number.isNaN(date.getTime())) return 'Unknown';

  // Allow callers to force month+year output even when the input includes a day
  const { monthYearOnly = false } = options || {};

  const fmtOptions =
    monthYearOnly || isYearMonth
      ? { year: 'numeric', month: 'short' }
      : { year: 'numeric', month: 'short', day: 'numeric' };

  const formatted = new Intl.DateTimeFormat(locale, fmtOptions).format(date);

  // For year-month inputs prefer a short month + year with a comma, e.g. "Oct, 2025"
  if (isYearMonth) {
    const idx = formatted.lastIndexOf(' ');
    if (idx !== -1) return `${formatted.slice(0, idx)}, ${formatted.slice(idx + 1)}`;
  }

  return formatted;
};

export default formatDate;
