/**
 * Checks if the given HTTP status code is an error status.
 * Returns true for 4xx and 5xx status codes (e.g., 401, 404, 500, etc.), false otherwise.
 * @param {number} status - The HTTP status code to check.
 * @returns {boolean} True if error status, false otherwise.
 */
export default function isErrorStatus(status) {
  if (typeof status !== "number") return false;
  // 4xx and 5xx are error statuses
  return status >= 400 && status < 600;
}
