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
} from "lucide-react";

const ProductCard = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

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
    image,
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
    ? [...new Set(ProductVariants.map((v) => v.size))]
    : [];

  const colorOptions =
    ProductVariants && selectedVariant
      ? ProductVariants.filter((v) => v.size === selectedVariant.size)
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

  const handleAddToCart = () => {
    console.log("Add to cart clicked", { product, selectedVariant, quantity });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation with Category Data */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Products</span>
          <span className="text-gray-400">/</span>
          {Category && (
            <>
              <span className="text-gray-400">
                {Category.name || "Category"}
              </span>
              <span className="text-gray-400">/</span>
            </>
          )}
          <span className="text-gray-900 font-medium">{brand || "Brand"}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Product Image */}
          <div className="relative">
            {/* Badges */}
            <div className="absolute -top-2 left-0 z-10 flex gap-2">
              {discountValue > 0 && (
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold px-3 py-1 rounded">
                  -{discountValue}%
                </span>
              )}
              {isBestseller && (
                <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">
                  Best Seller
                </span>
              )}
              {isFeatured && (
                <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded">
                  Deal of the Day
                </span>
              )}
            </div>

            {/* Action Buttons (Wishlist/Share) */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
              <button className="p-3 bg-white rounded-full shadow-md hover:bg-pink-50 text-gray-600 hover:text-pink-500 transition-all duration-300 group">
                <Heart size={20} className="group-hover:fill-pink-500" />
              </button>
              <button className="p-3 bg-white rounded-full shadow-md hover:bg-pink-50 text-gray-600 hover:text-pink-500 transition-all duration-300">
                <Share2 size={20} />
              </button>
            </div>

            {/* Main Image */}
            <div className="bg-gray-50 rounded-2xl flex items-center justify-center aspect-square overflow-hidden group cursor-pointer">
              <img
                src={
                  selectedVariant?.imageVariant ||
                  image ||
                  "/api/placeholder/400/400"
                }
                alt={name}
                className="w-full h-full object-contain transition-opacity duration-300"
                onError={(e) => {
                  e.target.src = "/api/placeholder/400/400";
                  e.target.onerror = null;
                }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
                {name}
              </h1>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={`${star <= 4 ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium underline cursor-pointer hover:text-pink-600">
                  135 reviews
                </span>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="text-gray-600 text-sm leading-relaxed">
                <p>{description}</p>
              </div>
            )}

            {/* Category Information */}
            {Category && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Layers size={18} className="text-gray-500" />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">{Category.name}</span>
                </span>
              </div>
            )}

            {/* Price Section - Moved up for better visibility */}
            <div className="py-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${discountedPrice}
                </span>
                {discountValue > 0 && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${originalPrice}
                    </span>
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      Save ${(priceValue - discountedPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Memory Selection */}
            {memoryOptions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Select Size
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {memoryOptions.map((memory, idx) => {
                    const isOutOfStock = !ProductVariants.some(
                      (v) => v.size === memory && v.stock > 0,
                    );
                    return (
                      <button
                        key={idx}
                        disabled={isOutOfStock}
                        title={isOutOfStock ? "Out of Stock" : ""}
                        onClick={() => {
                          const variant =
                            ProductVariants.find(
                              (v) => v.size === memory && v.stock > 0,
                            ) || ProductVariants.find((v) => v.size === memory);
                          if (variant) {
                            setSelectedVariant(variant);
                            setSelectedColor(
                              Array.isArray(variant.color)
                                ? variant.color[0]
                                : variant.color,
                            );
                          }
                        }}
                        className={`
                        px-6 py-2.5 rounded-xl border text-sm font-medium transition-all min-w-[3rem]
                        ${
                          selectedVariant?.size === memory
                            ? "border-pink-500 bg-pink-50 text-pink-600 ring-1 ring-pink-500"
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
              </div>
            )}

            {/* Color Selection */}
            {colorOptions.length > 0 && (
              <div className="space-y-3">
                <span className="text-sm font-medium text-gray-700">
                  Choose color
                </span>

                <div className="flex flex-wrap gap-3">
                  {colorOptions
                    .flatMap((variant) => {
                      const colors = Array.isArray(variant.color)
                        ? variant.color
                        : [variant.color];
                      return colors.map((color) => ({ variant, color }));
                    })
                    .map(({ variant, color }, idx) => {
                      const isOutOfStock = variant.stock === 0;
                      const isSelected =
                        selectedVariant?.id === variant.id &&
                        selectedColor === color;

                      return (
                        <button
                          key={idx}
                          disabled={isOutOfStock}
                          title={`${color || "Default"}${isOutOfStock ? " (Out of Stock)" : ""}`}
                          onClick={() => {
                            setSelectedVariant(variant);
                            setSelectedColor(color);
                          }}
                          className={`
                          w-10 h-10 rounded-full border shadow-sm transition-all relative
                          ${
                            isSelected
                              ? "ring-2 ring-pink-500 ring-offset-2 border-transparent scale-110"
                              : "border-gray-200 hover:border-gray-300 hover:scale-105"
                          }
                          ${isOutOfStock ? "opacity-40 cursor-not-allowed" : ""}
                        `}
                          style={{ backgroundColor: color }}
                        >
                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-px bg-gray-500 -rotate-45" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {selectedVariant &&
              selectedVariant.stock <= 2 &&
              selectedVariant.stock > 0 && (
                <div className="text-amber-600 text-sm font-medium flex items-center gap-2">
                  <Info size={16} />
                  Only {selectedVariant.stock} items left in stock!
                </div>
              )}

            {/* Quantity and Buy Button */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-gray-200 rounded-lg w-fit">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="p-3.5 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
                >
                  <Minus size={18} />
                </button>
                <span className="px-4 font-medium text-gray-900 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={
                    selectedVariant && quantity >= selectedVariant.stock
                  }
                  className="p-3.5 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
                >
                  <Plus size={18} />
                </button>
              </div>
              {/* 
              <button
                className="flex-1 bg-white border-2 border-[#cc1f69] text-[#cc1f69] px-8 py-3.5 rounded-xl font-bold hover:bg-pink-50 transition-all flex items-center justify-center gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button> */}

              {/* <button
                className="flex-1 bg-[#cc1f69] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#b01b5b] transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 transform hover:-translate-y-0.5"
                onClick={() =>
                  console.log("Buy clicked", {
                    product,
                    selectedVariant,
                    quantity,
                  })
                }
              >
                Buy Now
              </button> */}
            </div>

            {/* Trust Badges */}
            {/* <div className="grid grid-cols-2 gap-4 pt-6 mt-2">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="p-2 bg-gray-100 rounded-full">
                  <Truck size={18} className="text-gray-600" />
                </div>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="p-2 bg-gray-100 rounded-full">
                  <ShieldCheck size={18} className="text-gray-600" />
                </div>
                <span>Secure Checkout</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
