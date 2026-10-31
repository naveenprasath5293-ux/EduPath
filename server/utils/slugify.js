/**
 * Converts a string into a URL-safe slug.
 * e.g. "Intro to React & Redux!" -> "intro-to-react-redux"
 */
function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

module.exports = slugify;
