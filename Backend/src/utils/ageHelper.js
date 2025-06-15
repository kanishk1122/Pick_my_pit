/**
 * Utility functions for handling pet age calculations and formatting
 */

/**
 * Normalizes an age value to the most appropriate unit
 * @param {Number} value - The age value
 * @param {String} unit - The current unit (days, weeks, months, years)
 * @returns {Object} - Object with normalized value and unit
 */
function normalizeAge(value, unit) {
  if (!value || value <= 0) return { value: 0, unit: "days" };

  // Convert everything to days for easier calculation
  let days;
  switch (unit) {
    case "days":
      days = value;
      break;
    case "weeks":
      days = value * 7;
      break;
    case "months":
      days = value * 30; // Approximate
      break;
    case "years":
      days = value * 365; // Approximate
      break;
    default:
      return { value, unit: unit || "days" };
  }

  // Convert to the most appropriate unit for display
  if (days < 7) {
    return { value: Math.round(days), unit: "days" };
  } else if (days < 30) {
    // Special case: if it's exactly 7, 14, 21, or 28 days, use weeks
    if (days % 7 === 0 || days % 7 === 1) {
      return { value: Math.round(days / 7), unit: "weeks" };
    } else {
      return { value: Math.round(days), unit: "days" };
    }
  } else if (days < 365) {
    // For months, try to use the most natural representation
    const months = days / 30;
    const roundedMonths = Math.round(months);

    // If it's close to a whole number of months, use months
    if (Math.abs(months - roundedMonths) < 0.15) {
      return { value: roundedMonths, unit: "months" };
    } else {
      // Otherwise use weeks
      return { value: Math.round(days / 7), unit: "weeks" };
    }
  } else {
    // For years, include decimal if needed
    const years = days / 365;
    const roundedYears = Math.round(years * 10) / 10; // One decimal place
    return { value: roundedYears, unit: "years" };
  }
}

/**
 * Formats an age object into a human-readable string
 * @param {Object} age - The age object with value and unit
 * @returns {String} - Formatted age string
 */
function formatAge(age) {
  if (!age || !age.value) return "Unknown";

  const { value, unit } = normalizeAge(age.value, age.unit);

  // Handle plural forms
  const unitString = value === 1 ? unit.slice(0, -1) : unit;

  return `${value} ${unitString}`;
}

module.exports = {
  normalizeAge,
  formatAge,
};
