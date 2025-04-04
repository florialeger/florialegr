/**
 * Formats a date string into a readable format.
 * @param {string} dateString - The date string to format (e.g., "2025-02").
 * @param {string} locale - The locale to use for formatting (default: "en-US").
 * @returns {string} - The formatted date (e.g., "February 2025").
 */
export const formatDate = (dateString, locale = "en-US") => {
    if (!dateString) return "Unknown Date";
  
    const options = { year: "numeric", month: "long" }; // Example: "February 2025"
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, options).format(date);
  };
  
  export default formatDate;