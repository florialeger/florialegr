const DAY_MS = 1000 * 60 * 60 * 24;

const formatDateDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const days = Math.max(1, Math.round((end - start) / DAY_MS));
  if (days < 30) {
    if (days % 7 === 0) {
      const weeks = days / 7;
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    }
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }

  const months = Math.round(days / 30);
  return `${months} ${months === 1 ? 'month' : 'months'}`;
};

export default formatDateDifference;
