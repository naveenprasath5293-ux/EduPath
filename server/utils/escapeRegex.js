/**
 * Escapes RegExp special characters in user-supplied input before it's
 * interpolated into a `new RegExp(...)` call. Without this, input like
 * "C++" or an unmatched "(" either produces wrong matches or throws a
 * SyntaxError that bubbles up as an unhandled 500.
 */
function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = escapeRegex;
