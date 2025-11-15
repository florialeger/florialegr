/**
 * Formats a date string into a readable format with abbreviated month, day and year.
 * Examples:
 *  - "2025-02-13" -> "Feb 13, 2025"
 *  - "2025-02"    -> "Feb 1, 2025" (falls back to start of month)
 * @param {string|Date} dateInput - The date (ISO string or Date) to format.
 * @param {string} locale - Locale for Intl formatting (default: 'en-US').
 * @returns {string} Formatted date like "Feb 13, 2025" or "Unknown" when invalid.
 */
export const formatDate = (dateInput, locale = 'en-US') => {
  if (!dateInput) return 'Unknown';

  // Accept either a Date object or a string. Try to create a Date safely.
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return 'Unknown';

  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export default formatDate;
