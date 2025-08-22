import moment from "moment";

/**
 * Returns Ant Design form input rules
 * @param {string} message - Custom required message (default: "Required")
 */
export const getAntdFormInputRules = (message = "Required") => [
  {
    required: true,
    message,
  },
];

/**
 * Default date format for consistency across the app
 */
export const DEFAULT_DATE_FORMAT = "MMMM Do YYYY, h:mm A";

/**
 * Format a date safely using moment.js
 * @param {Date|string|number} date - Date object, ISO string, or timestamp
 * @param {string} format - Optional custom format
 * @returns {string} Formatted date or empty string if invalid
 */
export const getDateFormat = (date, format = DEFAULT_DATE_FORMAT) => {
  if (!date || !moment(date).isValid()) return "";
  return moment(date).format(format);
};
