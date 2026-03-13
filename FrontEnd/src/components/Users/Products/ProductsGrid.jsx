import React from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProductsGrid = ({ products }) => {
  const navigate = useNavigate();

  const handleViewDetails = (productId) => {
    navigate(`/Product/${productId}`);
  };

  const calculateDiscountedPrice = (basePrice, discount) => {
    return (parseFloat(basePrice) * (1 - discount / 100)).toFixed(2);
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
          No matches found
        </h3>
        <p className="text-gray-500 font-light max-w-md mb-8">
          We couldn't find any products matching your current filters. Try
          adjusting your search criteria or browse our wider collection.
        </p>
        <button
          className="px-8 py-3 bg-gray-900 text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-primary transition-colors"
          onClick={() => window.location.reload()}
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className="group flex flex-col cursor-pointer"
          onClick={() => handleViewDetails(product._id)}
        >
          {/* Image Container */}
          <div className="relative aspect-[3/4] mb-6 bg-gray-50 overflow-hidden group">
            <img
              src={
                (Array.isArray(product.images)
                  ? product.images[0]
                  : product.images) ||
                "https://images.unsplash.com/photo-1512496015851-a1dc8aeddf0b?q=80&w=1974&auto=format&fit=crop"
              }
              alt={product.name}
              className={`w-full h-full object-cover object-center transition-transform duration-700 ${
                Array.isArray(product.images) && product.images.length > 1
                  ? "group-hover:opacity-0"
                  : "group-hover:scale-105"
              }`}
              loading="lazy"
            />
            {Array.isArray(product.images) && product.images.length > 1 && (
              <img
                src={product.images[1]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                loading="lazy"
              />
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.discount > 0 && (
                <span className="bg-primary text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                  Sale -{product.discount}%
                </span>
              )}
              {product.isNew && (
                <span className="bg-gray-900 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                  New
                </span>
              )}
            </div>

            {/* Quick Add Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-20">
              <button
                className="w-full bg-white/95 backdrop-blur-sm text-gray-900 font-medium tracking-wide uppercase text-xs py-4 flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(product._id);
                }}
              >
                <ShoppingBag size={16} />
                Quick View
              </button>
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="absolute top-4 right-4 z-20 text-gray-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
            >
              <Heart size={20} />
            </button>
          </div>

          {/* Product Info */}
          <div className="text-center flex flex-col flex-grow">
            {product.brand && (
              <span className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-2">
                {product.brand}
              </span>
            )}

            <h3 className="text-lg font-serif font-medium text-gray-900 mb-2 px-2 hover:text-primary transition-colors truncate">
              {product.name}
            </h3>

            {/* Sizes display */}
            {product.ProductVariants && product.ProductVariants.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3 px-2">
                {[
                  ...new Set(
                    product.ProductVariants.map((v) => v.size).filter(
                      (s) => s && s !== "NoSize",
                    ),
                  ),
                ].map((size, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] sm:text-xs font-medium text-gray-500 border border-gray-200 px-2 py-0.5 whitespace-nowrap"
                  >
                    {size}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto flex items-center justify-center gap-3">
              {product.discount > 0 ? (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    EGP {parseFloat(product.basePrice).toFixed(2)}
                  </span>
                  <span className="text-base font-medium text-primary">
                    EGP{" "}
                    {calculateDiscountedPrice(
                      product.basePrice,
                      product.discount,
                    )}
                  </span>
                </>
              ) : (
                <span className="text-base font-medium text-gray-900">
                  EGP {parseFloat(product.basePrice).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductsGrid;
