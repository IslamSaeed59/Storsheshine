/**
 * Optimizes a Cloudinary image URL by adding transformation parameters.
 * @param {string} url - The original Cloudinary image URL.
 * @param {Object} options - Transformation options (width, height, quality, format).
 * @returns {string} The optimized Cloudinary image URL.
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') return url;
  
  // Only optimize Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;

  const {
    width = 600, // Default width
    quality = 'auto', // Default quality
    format = 'auto', // Default format (webp/avif depending on browser)
    crop = 'fill', // Default crop mode
  } = options;

  // Build transformation string
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

  const transformString = transformations.join(',');

  // Check if URL already has transformations (usually right after 'upload/')
  const uploadIndex = url.indexOf('/upload/');
  
  if (uploadIndex !== -1) {
    // Insert transformations after '/upload/'
    const beforeUpload = url.substring(0, uploadIndex + 8);
    const afterUpload = url.substring(uploadIndex + 8);
    
    // Check if there are already transformations (like v1234567890 or w_500)
    if (afterUpload.match(/^[a-z]+_[^/]+\//)) {
        // We could replace existing, but for simplicity we prepend our transformations
        return `${beforeUpload}${transformString}/${afterUpload}`;
    } else {
        return `${beforeUpload}${transformString}/${afterUpload}`;
    }
  }

  return url;
};
