/**
 * SEO Utility Functions
 * Used across models to generate SEO-friendly slugs and canonical URLs
 */

const BASE_URL = 'https://convoytravels.pk';

/**
 * Generate SEO-friendly slug from a string
 * @param {string} text - Text to convert to slug
 * @returns {string} - SEO-friendly slug
 */
export function generateSlug(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate canonical URL based on route pattern and slug
 * @param {string} route - Base route (e.g., '/cars', '/vehicle-types')
 * @param {string} slug - Slug or identifier
 * @param {string} customCanonical - Custom canonical URL if provided
 * @returns {string} - Full canonical URL
 */
export function generateCanonicalUrl(route, slug = null, customCanonical = null) {
  // If custom canonical is provided, use it exactly
  if (customCanonical && typeof customCanonical === 'string' && customCanonical.trim()) {
    // Ensure it's a full URL
    if (customCanonical.startsWith('http://') || customCanonical.startsWith('https://')) {
      return customCanonical;
    }
    // If it's a path, prepend base URL
    return `${BASE_URL}${customCanonical.startsWith('/') ? customCanonical : `/${customCanonical}`}`;
  }

  // Generate canonical from route and slug
  if (!route) {
    return BASE_URL;
  }

  const cleanRoute = route.startsWith('/') ? route : `/${route}`;
  
  if (slug) {
    const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
    return `${BASE_URL}${cleanRoute}${cleanSlug}`;
  }

  return `${BASE_URL}${cleanRoute}`;
}

/**
 * Generate default SEO title from name/title
 * @param {string} name - Name or title
 * @param {string} suffix - Optional suffix (e.g., '| Convoy Travels')
 * @returns {string} - SEO title
 */
export function generateSeoTitle(name, suffix = '| Convoy Travels') {
  if (!name || typeof name !== 'string') {
    return suffix ? suffix : 'Convoy Travels';
  }
  return suffix ? `${name} ${suffix}` : name;
}

/**
 * Generate default SEO description from content
 * @param {string} content - Content to extract description from
 * @param {number} maxLength - Maximum length (default: 160)
 * @returns {string} - SEO description
 */
export function generateSeoDescription(content, maxLength = 160) {
  if (!content || typeof content !== 'string') {
    return 'Rent a car in Lahore with Convoy Travels. Affordable car rental services with or without driver.';
  }

  // Strip HTML tags if present
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  
  if (textContent.length <= maxLength) {
    return textContent;
  }

  // Truncate at word boundary
  const truncated = textContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

export { BASE_URL };

