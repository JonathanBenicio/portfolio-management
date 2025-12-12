const LANG = "pt-BR"
const CURRENCY = "BRL"

/**
 * Formats a numeric value into a currency string.
 * @param {number} value - The numeric value to be formatted.
 * @returns {string} The formatted currency string.
*/
function formatCurrency(value: number): string {
  return value.toLocaleString(
    LANG,
    {
      style: "currency",
      currency: CURRENCY,
    }
  )
}

export { formatCurrency }