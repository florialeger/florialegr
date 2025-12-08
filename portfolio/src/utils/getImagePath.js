// Dynamically import images from assets/images directory
const imageModules = import.meta.glob('@/assets/images/*.{jpg,jpeg,png,gif,webp,svg}', { eager: true });

/**
 * Get the resolved image path for a given filename
 * @param {string} filename - The image filename (e.g., "purely-primary.jpg")
 * @returns {string|null} - The resolved image URL or null if not found
 */
export const getImagePath = (filename) => {
  if (!filename) return null;

  const path = `/src/assets/images/${filename}`;
  const module = imageModules[path];

  return module?.default || null;
};
