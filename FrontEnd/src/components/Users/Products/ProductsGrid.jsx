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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-pink-100 hover:border-pink-200"
          onClick={() => handleViewDetails(product._id)}
        >
          {/* Image Container */}
          <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
            <img
              src={product.image || "/api/placeholder/400/400"}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />

            {/* Action Buttons - Modern glassmorphism style */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              <div className="flex gap-3 backdrop-blur-sm bg-white/30 p-2 rounded-full">
                {/* <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="p-2.5 bg-white rounded-full text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-pink-200"
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={16} />
                </button>
                <button
                  onClick={(e) => handleAddToWishlist(e, product)}
                  className="p-2.5 bg-white rounded-full text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-pink-200"
                  aria-label="Add to wishlist"
                >
                  <Heart size={16} />
                </button> */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(product._id);
                  }}
                  className="p-2.5 bg-white rounded-full text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-pink-200"
                  aria-label="Quick view"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>

            {/* Badges - More feminine styling */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.discount > 0 && (
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-pink-200">
                  {product.discount}% OFF
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-gradient-to-r from-amber-400 to-pink-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-amber-200">
                  BESTSELLER
                </span>
              )}
              {product.isNew && (
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-green-200">
                  NEW
                </span>
              )}
              {(product.ProductVariants?.reduce(
                (acc, item) => acc + (Number(item.stock) || 0),
                0,
              ) || 0) <= 0 && (
                <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-200">
                  OUT OF STOCK
                </span>
              )}
            </div>

            {/* Wishlist Button - Quick add */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToWishlist(e, product);
              }}
              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-pink-500 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-md"
              aria-label="Add to wishlist"
            >
              <Heart size={18} />
            </button>
          </div>

          {/* Product Info - Enhanced with better typography */}
          <div className="p-3 sm:p-4">
            {/* Brand with elegant styling */}
            {product.brand && (
              <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-semibold uppercase tracking-wider mb-1">
                Brand - {product.brand}
              </p>
            )}

            {/* Product Name - More elegant */}
            <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 h-10 hover:text-pink-600 transition-colors">
              {product.name}
            </h3>

            {/* Rating with hearts instead of stars */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((heart) => (
                  <svg
                    key={heart}
                    className={`w-3 h-3 ${
                      heart <= 4 ? "text-pink-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-400">(24 reviews)</span>
            </div>

            {/* Price with elegant styling */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {product.discount > 0 ? (
                  <>
                    <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      $
                      {calculateDiscountedPrice(
                        product.basePrice,
                        product.discount,
                      )}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ${parseFloat(product.basePrice).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-800">
                    ${parseFloat(product.basePrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Add to cart quick button */}
              {/* <button
                onClick={(e) => handleAddToCart(e, product)}
                className="p-2 bg-pink-50 rounded-full text-pink-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300"
                aria-label="Quick add"
              >
                <ShoppingCart size={14} />
              </button> */}
            </div>

            {/* Free shipping badge for cosmetics */}
            <div className="mt-2 flex items-center gap-1">
              <span className="text-[10px] text-gray-400">Free shipping</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;
