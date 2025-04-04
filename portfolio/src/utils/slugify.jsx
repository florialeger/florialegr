/**
 * Converts a string into a URL-friendly slug.
 * @param {string} text - The text to slugify (e.g., "My Project Title").
 * @returns {string} - The slugified string (e.g., "my-project-title").
 */
export const slugify = (text) => {
    if (!text) return "";
  
    return text
      .toString() // Ensure it's a string
      .toLowerCase() // Convert to lowercase
      .trim() // Remove leading/trailing whitespace
      .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word characters with "-"
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
  };
  
  export default slugify;