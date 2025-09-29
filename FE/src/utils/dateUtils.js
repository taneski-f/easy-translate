/**
 * Format date strings into human-readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string (short format)
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Can be extended as needed for more date utilities
