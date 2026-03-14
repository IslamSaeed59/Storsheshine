import React, { useState, useEffect } from 'react';

/**
 * Optimized Cloudinary Image Component
 * Implements: f_auto, q_auto:eco, w_auto, dpr_auto, Lazy Loading, and Blur-up placeholding.
 */
const OptimizedImage = ({ src, alt, className, style, sizes }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [blurSrc, setBlurSrc] = useState(null);

  useEffect(() => {
    if (!src || !src.includes('res.cloudinary.com')) {
      setImgSrc(src);
      return;
    }

    const uploadIndex = src.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const beforeUpload = src.substring(0, uploadIndex + 8);
      const afterUpload = src.substring(uploadIndex + 8);
      // Remove any existing transformations temporarily to apply our own
      const cleanAfterUpload = afterUpload.replace(/^[a-z_0-9,]+(?:[:][a-z_0-9]+)?\//, '');

      // 1. Full Resolution URL (w_auto, dpr_auto, f_auto, q_auto:good)
      // Note: c_limit ensures we don't scale up past the original image size
      const full = `${beforeUpload}f_auto,q_auto:good,w_auto,c_limit,dpr_auto/${cleanAfterUpload}`;

      // 2. Blur-Up URL (Ultra-low res, heavily blurred)
      const blur = `${beforeUpload}w_20,f_auto,q_auto:eco,e_blur:1000/${cleanAfterUpload}`;

      setImgSrc(full);
      setBlurSrc(blur);
    } else {
      setImgSrc(src);
    }
  }, [src]);

  return (
    <div 
      className={`relative overflow-hidden ${className || ''}`} 
      style={{ ...style, display: 'inline-block' }}
    >
      {/* Blur-up Placeholder */}
      {blurSrc && !isLoaded && (
        <img
          src={blurSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 blur-md scale-110"
          aria-hidden="true"
        />
      )}

      {/* Main Image with Native Lazy Loading */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          sizes={sizes || "100vw"} // Important for w_auto to work natively
          loading="lazy" // Defers loading until near the viewport
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ position: blurSrc && !isLoaded ? 'absolute' : 'relative' }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
