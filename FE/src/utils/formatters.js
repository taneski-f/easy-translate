/**
 * Format currency amounts with proper localization
 * @param {number} amount - Amount in cents
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'EUR') {
  if (!amount) return 'N/A';

  const value = amount / 100;

  // Support for EUR symbol, otherwise show currency code
  if (currency === 'EUR') {
    return `€${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

/**
 * Format project pricing information
 * @param {Object} price - Price object from project
 * @returns {string} Formatted price string
 */
export function formatProjectPrice(price) {
  if (!price) return null;

  if (price.amount_euro) {
    return formatCurrency(price.amount_euro, 'EUR');
  }

  if (price.amount && price.currency) {
    return formatCurrency(price.amount, price.currency);
  }

  return null;
}
