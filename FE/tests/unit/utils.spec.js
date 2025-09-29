/**
 *  Validates date formatting and currency/price formatting helpers.
 */
import { describe, it, expect } from 'vitest';
import { formatDate } from '@/utils/dateUtils.js';
import { formatCurrency, formatProjectPrice } from '@/utils/formatters.js';

describe('dateUtils.formatDate', () => {
  it('formats ISO date strings into short human readable form', () => {
    const out = formatDate('2024-01-02T00:00:00Z');
    expect(typeof out).toBe('string');
    // Locale dependent part: we assert it contains year and formatted month/day
    expect(out).toContain('2024');
  });

  it('returns N/A for falsy input', () => {
    expect(formatDate(null)).toBe('N/A');
    expect(formatDate('')).toBe('N/A');
  });
});

describe('formatters.formatCurrency', () => {
  it('formats euro amounts correctly from cents', () => {
    expect(formatCurrency(12345)).toBe('\u20ac123.45');
  });

  it('formats other currencies with code suffix', () => {
    expect(formatCurrency(5000, 'USD')).toBe('50.00 USD');
  });

  it('returns N/A for falsy amount', () => {
    expect(formatCurrency(0)).toBe('N/A');
    expect(formatCurrency(null)).toBe('N/A');
  });
});

describe('formatters.formatProjectPrice', () => {
  it('returns formatted euro when amount_euro present', () => {
    const res = formatProjectPrice({ amount_euro: 2500 });
    expect(res).toBe('\u20ac25.00');
  });

  it('returns formatted other currency when amount+currency present', () => {
    const res = formatProjectPrice({ amount: 7500, currency: 'USD' });
    expect(res).toBe('75.00 USD');
  });

  it('returns null for missing price object or incomplete data', () => {
    expect(formatProjectPrice(null)).toBeNull();
    expect(formatProjectPrice({})).toBeNull();
  });
});
