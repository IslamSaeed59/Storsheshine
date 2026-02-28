import React, { useState, useEffect } from "react";
import {
  Star,
  Info,
  Package,
  Layers,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  X,
} from "lucide-react";

const ProductCard = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Reset selected image when variant changes
  useEffect(() => {
    setSelectedImage(null);
  }, [selectedVariant, selectedColor]);

  useEffect(() => {
    if (product) {
      if (product.ProductVariants && product.ProductVariants.length > 0) {
        const firstVariant = product.ProductVariants[0];
        setSelectedVariant(firstVariant);
        setSelectedColor(
          Array.isArray(firstVariant.color)
            ? firstVariant.color[0]
            : firstVariant.color,
        );
      }
    }
  }, [product]);

  if (!product) return null;

  const {
    name,
    brand,
    description,
    basePrice,
    discount,
    Category,
    ProductVariants,
    isBestseller,
    isFeatured,
    images,
  } = product;

  // Calculate prices based on selected variant or base price
  const currentPrice = selectedVariant ? selectedVariant.price : basePrice;
  const discountValue = parseFloat(discount) || 0;
  const priceValue = parseFloat(currentPrice) || 0;

  const discountedPrice =
    discountValue > 0
      ? (priceValue * (1 - discountValue / 100)).toFixed(2)
      : priceValue.toFixed(2);

  const originalPrice = priceValue.toFixed(2);

  // Extract unique sizes/memories from variants
  const memoryOptions = ProductVariants
    ? [
        ...new Set(
          ProductVariants.map((v) => v.size).filter(
            (s) => s != null && s !== "",
          ),
        ),
      ]
    : [];

  const uniqueColors = ProductVariants
    ? [
        ...new Set(
          ProductVariants.flatMap((v) =>
            Array.isArray(v.color) ? v.color : [v.color],
          ),
        ),
      ]
    : [];

  const handleIncrement = () => {
    if (selectedVariant && quantity >= selectedVariant.stock) return;
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const displayImage =
    selectedImage ||
    (Array.isArray(images) ? images[0] : images) ||
    "/api/placeholder/400/400";

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 hover:text-gray-600 transition-colors cursor-default">
            Products
          </span>
          <span className="text-gray-300">/</span>
          {Category && (
            <>
              <span className="text-gray-400 hover:text-gray-600 transition-colors cursor-default">
                {Category.name || "Category"}
              </span>
              <span className="text-gray-300">/</span>
            </>
          )}
          <span className="text-gray-900 font-medium line-clamp-1">
            {brand || "Brand"}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Column - Product Image */}
          <div className="relative space-y-4">
            {/* Badges - Improved positioning */}
            <div className="absolute -top-3 left-0 z-10 flex flex-wrap gap-2">
              {discountValue > 0 && (
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                  -{discountValue}%
                </span>
              )}
              {isBestseller && (
                <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                  Best Seller
                </span>
              )}
              {isFeatured && (
                <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                  Deal of the Day
                </span>
              )}
            </div>

            {/* Main Image - Improved container */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center aspect-square overflow-hidden group cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <img
                src={displayImage}
                alt={name}
                className="w-full h-full object-contain p-8 transition-all duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = "/api/placeholder/400/400";
                  e.target.onerror = null;
                }}
                loading="lazy"
              />
            </div>

            {/* Thumbnail Gallery - Improved interaction */}
            {Array.isArray(images) && images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      displayImage === img
                        ? "border-pink-500 ring-4 ring-pink-500/20 scale-105"
                        : "border-transparent hover:border-gray-300 hover:scale-105"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-7">
            {/* Product Title and Rating */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={`${
                        star <= 4
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      } transition-transform hover:scale-110`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium hover:text-pink-600 transition-colors cursor-pointer underline-offset-2 hover:underline">
                  135 reviews
                </span>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="text-gray-600 text-base leading-relaxed bg-gray-50 p-4 rounded-xl">
                <p className="line-clamp-3 hover:line-clamp-none transition-all duration-300">
                  {description}
                </p>
              </div>
            )}

            {/* Category Information */}
            {Category && (
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Layers size={20} className="text-pink-500" />
                </div>
                <span className="text-sm text-gray-700">
                  <span className="font-semibold">{Category.name}</span>
                </span>
              </div>
            )}

            {/* Price Section */}
            <div className="py-3">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-gray-900 tracking-tight">
                  ${discountedPrice}
                </span>
                {discountValue > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-gray-400 line-through">
                      ${originalPrice}
                    </span>
                    <span className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-semibold">
                      Save ${(priceValue - discountedPrice).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {uniqueColors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Choose Color
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {uniqueColors.map((color, idx) => {
                    const variantsWithColor = ProductVariants.filter((v) =>
                      Array.isArray(v.color)
                        ? v.color.includes(color)
                        : v.color === color,
                    );
                    const isOutOfStock = !variantsWithColor.some(
                      (v) => v.stock > 0,
                    );
                    const isSelected = selectedColor === color;

                    return (
                      <button
                        key={idx}
                        disabled={isOutOfStock}
                        title={`${color || "Default"}${isOutOfStock ? " (Out of Stock)" : ""}`}
                        onClick={() => {
                          let variant = variantsWithColor.find(
                            (v) => v.size === selectedVariant?.size,
                          );
                          if (!variant || variant.stock <= 0) {
                            variant =
                              variantsWithColor.find((v) => v.stock > 0) ||
                              variantsWithColor[0];
                          }
                          if (variant) {
                            setSelectedVariant(variant);
                            setSelectedColor(color);
                          }
                        }}
                        className={`
                      w-12 h-12 rounded-full border-2 shadow-md transition-all duration-200 relative
                      ${
                        isSelected
                          ? "ring-2 ring-pink-500 ring-offset-2 border-white scale-110"
                          : "border-gray-200 hover:border-pink-300 hover:scale-110"
                      }
                      ${isOutOfStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                    `}
                        style={{ backgroundColor: color }}
                      >
                        {isOutOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-gray-400 rotate-45 rounded-full" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Memory Selection */}
            {memoryOptions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Select Size
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {memoryOptions.map((memory, idx) => {
                    const variant = ProductVariants.find(
                      (v) =>
                        v.size === memory &&
                        (Array.isArray(v.color)
                          ? v.color.includes(selectedColor)
                          : v.color === selectedColor),
                    );
                    const isOutOfStock = !variant || variant.stock <= 0;
                    return (
                      <button
                        key={idx}
                        disabled={isOutOfStock}
                        title={isOutOfStock ? "Out of Stock" : ""}
                        onClick={() => {
                          if (variant) {
                            setSelectedVariant(variant);
                          } else {
                            const anyVariant =
                              ProductVariants.find(
                                (v) => v.size === memory && v.stock > 0,
                              ) ||
                              ProductVariants.find((v) => v.size === memory);
                            if (anyVariant) {
                              setSelectedVariant(anyVariant);
                              setSelectedColor(
                                Array.isArray(anyVariant.color)
                                  ? anyVariant.color[0]
                                  : anyVariant.color,
                              );
                            }
                          }
                        }}
                        className={`
                      px-6 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 min-w-[4rem]
                      ${
                        selectedVariant?.size === memory
                          ? "border-pink-500 bg-pink-50 text-pink-600 shadow-md"
                          : "border-gray-200 hover:border-pink-200 hover:bg-gray-50 text-gray-700"
                      }
                      ${
                        isOutOfStock
                          ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 line-through"
                          : ""
                      }
                    `}
                      >
                        {memory}
                      </button>
                    );
                  })}
                </div>

                {/* Variant Image Preview */}
                {selectedVariant?.imageVariant && (
                  <div className="mt-6 pt-2">
                    <div className="text-sm font-semibold text-gray-700 mb-3">
                      {selectedVariant.size} Preview:
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div
                        className="relative group w-64 md:w-72 cursor-pointer"
                        onClick={() => {
                          setModalImage(selectedVariant.imageVariant);
                          setIsImageModalOpen(true);
                        }}
                      >
                        <div className="aspect-square rounded-xl border-2 border-gray-100 overflow-hidden bg-gradient-to-br from-gray-50 to-white shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                          <img
                            src={selectedVariant.imageVariant}
                            alt={`${selectedVariant.size} variant`}
                            className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = "/api/placeholder/400/400";
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 mt-2 block text-center bg-gray-50 py-1 px-2 rounded-full">
                          {selectedVariant.size} Variant Image
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stock Status */}
            {selectedVariant &&
              selectedVariant.stock <= 2 &&
              selectedVariant.stock > 0 && (
                <div className="bg-amber-50 text-amber-700 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2 border border-amber-200">
                  <Info size={18} className="text-amber-500" />
                  Only {selectedVariant.stock}{" "}
                  {selectedVariant.stock === 1 ? "item" : "items"} left in
                  stock!
                </div>
              )}

            {/* Quantity */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center border-2 border-gray-200 rounded-xl w-fit hover:border-pink-200 transition-colors">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-4 hover:bg-gray-50 text-gray-600 transition-all rounded-l-xl disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-6 font-semibold text-gray-900 min-w-[4rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={
                      selectedVariant && quantity >= selectedVariant.stock
                    }
                    className="p-4 hover:bg-gray-50 text-gray-600 transition-all rounded-r-xl disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-opacity duration-300"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X size={32} />
          </button>
          <img
            src={modalImage}
            alt="Variant Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
