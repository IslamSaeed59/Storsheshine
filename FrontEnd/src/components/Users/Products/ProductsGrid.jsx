import React from "react";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductsGrid = ({ products }) => {
  const navigate = useNavigate();

  const handleViewDetails = (productId) => {
    navigate(`/Product/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    console.log("Added to cart:", product);
  };

  const handleAddToWishlist = (e, product) => {
    e.stopPropagation();
    console.log("Added to wishlist:", product);
  };

  const calculateDiscountedPrice = (basePrice, discount) => {
    return (parseFloat(basePrice) * (1 - discount / 100)).toFixed(2);
  };

  console.log("ProductsGrid received products:", products);

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-lg border border-gray-200">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <ShoppingCart size={48} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500 max-w-md">
          We couldn't find any products matching your criteria. Try adjusting
          your filters or browse our full collection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="group bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-pink-200"
          onClick={() => handleViewDetails(product._id)}
        >
          {/* Image Container */}
          <div className="relative w-full aspect-square overflow-hidden bg-white">
            <img
              src={
                (Array.isArray(product.images)
                  ? product.images[0]
                  : product.images) ||
                product.image ||
                "/api/placeholder/400/400"
              }
              alt={product.name}
              className={`w-full h-full object-contain object-center transition-all duration-700 ${
                Array.isArray(product.images) && product.images.length > 1
                  ? "group-hover:opacity-0"
                  : "group-hover:scale-110"
              }`}
              loading="lazy"
            />
            {Array.isArray(product.images) && product.images.length > 1 && (
              <img
                src={product.images[1]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain object-center opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                loading="lazy"
              />
            )}

            {/* Action Buttons */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2 sm:pb-6">
              <div className="flex gap-2 sm:gap-3 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(product._id);
                  }}
                  className="p-1.5 sm:p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-all duration-300 shadow-sm"
                  aria-label="Quick view"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
              {product.discount > 0 && (
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg">
                  {product.discount}% OFF
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-gradient-to-r from-amber-400 to-pink-400 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg">
                  BESTSELLER
                </span>
              )}
              {product.isNew && (
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg">
                  NEW
                </span>
              )}
              {(product.ProductVariants?.reduce(
                (acc, item) => acc + (Number(item.stock) || 0),
                0,
              ) || 0) <= 0 && (
                <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg">
                  OUT OF STOCK
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToWishlist(e, product);
              }}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-pink-500 transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 shadow-md"
              aria-label="Add to wishlist"
            >
              <Heart size={18} />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-2 sm:p-3 md:p-4">
            {/* Brand */}
            {product.brand && (
              <p className="text-[10px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-semibold uppercase tracking-wider mb-0.5 sm:mb-1 truncate">
                {product.brand.length > 15
                  ? `${product.brand.substring(0, 12)}...`
                  : product.brand}
              </p>
            )}

            {/* Product Name */}
            <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-1 sm:mb-2 line-clamp-2 h-8 sm:h-10 hover:text-pink-600 transition-colors">
              {product.name.length > 50
                ? `${product.name.substring(0, 45)}...`
                : product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                {product.discount > 0 ? (
                  <>
                    <span className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      EGP
                      {calculateDiscountedPrice(
                        product.basePrice,
                        product.discount,
                      )}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                      EGP{parseFloat(product.basePrice).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-sm sm:text-base md:text-lg font-bold text-gray-800">
                    EGP{parseFloat(product.basePrice).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Available Sizes */}
            <div className="flex flex-wrap gap-1.5 mt-2 min-h-[1.75rem]">
              {product.ProductVariants && (
                <>
                  {[
                    ...new Set(
                      product.ProductVariants.map((v) => v.size).filter(
                        (s) => s && s !== "NoSize",
                      ),
                    ),
                  ]
                    .slice(0, 3)
                    .map((size, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 text-[11px] font-medium bg-black text-white rounded-md border border-gray-700 shadow-sm"
                        title={`Size: ${size}`}
                      >
                        {size}
                      </span>
                    ))}

                  {[
                    ...new Set(
                      product.ProductVariants.map((v) => v.size).filter(
                        (s) => s && s !== "NoSize",
                      ),
                    ),
                  ].length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 text-[11px] font-medium bg-gray-900 text-gray-300 rounded-md border border-gray-700">
                      +
                      {[
                        ...new Set(
                          product.ProductVariants.map((v) => v.size).filter(
                            (s) => s && s !== "NoSize",
                          ),
                        ),
                      ].length - 3}{" "}
                      more
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;
