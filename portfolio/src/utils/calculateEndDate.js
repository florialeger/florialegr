/**
 * calculateEndDate
 * Calculates the end date of a project based on start date and duration.
 *
 * @param {string|Date} startDate - The start date (created date)
 * @param {string|number} duration - Duration in various formats:
 *   - Number or numeric string: interpreted as months (e.g., "4" = 4 months)
 *   - "X weeks": number of weeks
 *   - "X days": number of days
 *   - "ongoing": returns null (project is still ongoing)
 * @returns {Date|null} The calculated end date, or null if ongoing/invalid
 */
export const calculateEndDate = (startDate, duration) => {
  if (!startDate || !duration) return null;

  const durationStr = String(duration).trim().toLowerCase();

  // If ongoing, return null
  if (/^ongoing$/i.test(durationStr) || /in\s*progress|present|current/i.test(durationStr)) {
    return null;
  }

  const start = new Date(startDate);
  if (isNaN(start.getTime())) return null;

  // Match "X weeks" or "X days"
  const weeksDaysMatch = durationStr.match(/^(\d+(?:\.\d+)?)\s*(weeks?|w|days?|d)$/i);
  if (weeksDaysMatch) {
    const amount = Number(weeksDaysMatch[1]);
    const unit = weeksDaysMatch[2].toLowerCase();

    if (/w/i.test(unit)) {
      // Add weeks
      const endDate = new Date(start);
      endDate.setDate(endDate.getDate() + amount * 7);
      return endDate;
    } else if (/d/i.test(unit)) {
      // Add days
      const endDate = new Date(start);
      endDate.setDate(endDate.getDate() + amount);
      return endDate;
    }
  }

  // If it's a number, interpret as months
  const numeric = Number(durationStr);
  if (!Number.isNaN(numeric) && numeric > 0) {
    const endDate = new Date(start);
    endDate.setMonth(endDate.getMonth() + numeric);
    return endDate;
  }

  // If we can't parse it, return null
  return null;
};

export default calculateEndDate;
