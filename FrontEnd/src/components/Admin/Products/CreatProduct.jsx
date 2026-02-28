import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createProduct,
  getCategories,
  uploadImage,
  uploadVariantImage,
} from "../../../Services/api";
import axios from "axios";
import { FiUpload, FiX } from "react-icons/fi";

const CreatProduct = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [variantImageFile, setVariantImageFile] = useState(null);
  const [variantImagePreview, setVariantImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Watch categoryId to get category name
  const selectedCategoryId = watch("categoryId");

  // ✅ Get selected category name
  const getSelectedCategoryName = () => {
    const selected = categories.find((cat) => cat._id === selectedCategoryId);
    if (!selected) return "uncategorized";

    const parent = categories.find((c) => c._id === selected.parentId); // Ensure parentId check uses _id
    // Use parent name if exists, otherwise use category name
    return parent ? parent.name : selected.name;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // ✅ Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (imageFiles.length + files.length > 4) {
      toast.error("You can only upload a maximum of 4 images");
      return;
    }

    const newFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`Skipped ${file.name}: Not an image file`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Skipped ${file.name}: Size must be less than 5MB`);
        return;
      }

      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setImageFiles((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // ✅ Remove selected image
  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ✅ Handle variant image selection
  const handleVariantImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setVariantImageFile(file);
    setVariantImagePreview(URL.createObjectURL(file));
  };

  // ✅ Remove selected variant image
  const handleRemoveVariantImage = () => {
    setVariantImageFile(null);
    if (variantImagePreview) {
      URL.revokeObjectURL(variantImagePreview);
      setVariantImagePreview(null);
    }
  };

  // ✅ Upload image with category name
  const handleImageUpload = async () => {
    if (imageFiles.length === 0) return null;

    const categoryName = getSelectedCategoryName();
    console.log("📤 Uploading to category:", categoryName); // Debug

    try {
      setUploading(true);
      const uploadPromises = imageFiles.map((file) => {
        const formData = new FormData();
        formData.append("categoryName", categoryName);
        formData.append("productImage", file);
        return uploadImage(formData).then((res) => res.data.imageUrl);
      });

      const imageUrls = await Promise.all(uploadPromises);
      console.log("✅ Upload response:", imageUrls); // Debug
      return imageUrls;
    } catch (error) {
      console.error("❌ Upload error:", error);
      toast.error("Image upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (imageFiles.length === 0) {
        toast.error("Please upload at least one product image");
        return;
      }

      if (!data.categoryId) {
        toast.error("Please select a category first");
        return;
      }

      const imageUrls = await handleImageUpload();
      if (!imageUrls) return;

      // ✅ الباكند بيستقبل بس الفيلدات دي:
      const payload = {
        name: data.name,
        description: data.description,
        basePrice: parseFloat(data.basePrice),
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        categoryId: data.categoryId,
        brand: data.brand,
        size: data.size,
        color: data.color.split(",").map((c) => c.trim()),
        images: imageUrls,
      };
      // ❌ شلنا imageVariant لأن الباكند مش بيستخدمه

      await createProduct(payload);
      toast.success("Product created successfully");
      console.log("Product created with payload:", payload);
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create New Product
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc1f69] focus:border-transparent outline-none transition-all ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description", {})}
              rows="4"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc1f69] focus:border-transparent outline-none transition-all ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ✅ Category - Moved up so user selects it first */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              {...register("categoryId", { required: "Category is required" })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc1f69] focus:border-transparent outline-none transition-all ${
                errors.categoryId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => {
                const parent = categories.find((c) => c._id === cat.parentId);
                return (
                  <option key={cat._id} value={cat._id}>
                    {parent ? `${parent.name} > ${cat.name}` : cat.name}
                  </option>
                );
              })}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Base Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Price
            </label>
            <input
              type="number"
              step="0.01"
              {...register("basePrice", {
                required: "Base Price is required",
                min: 0,
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc1f69] focus:border-transparent outline-none transition-all ${
                errors.basePrice ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.00"
            />
            {errors.basePrice && (
              <p className="text-red-500 text-xs mt-1">
                {errors.basePrice.message}
              </p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              {...register("brand", { required: "Brand is required" })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc1f69] focus:border-transparent outline-none transition-all ${
                errors.brand ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter brand name"
            />
            {errors.brand && (
              <p className="text-red-500 text-xs mt-1">
                {errors.brand.message}
              </p>
            )}
          </div>
        </div>
        {/* ✅ Image Upload Section */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images (Max 4)
          </label>

          {/* ✅ Show category warning if not selected */}
          {!selectedCategoryId && (
            <p className="text-yellow-500 text-xs mb-2">
              ⚠️ Please select a category before uploading images
            </p>
          )}

          {/* ✅ Show selected category folder */}
          {selectedCategoryId && (
            <p className="text-green-600 text-xs mb-2">
              📁 Images will be saved in:{" "}
              <span className="font-semibold">
                /uploads/
                {getSelectedCategoryName().toLowerCase().replace(/\s+/g, "-")}/
              </span>
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagePreviews.map((src, index) => (
              <div
                key={index}
                className="relative h-32 rounded-lg overflow-hidden border border-gray-200 group"
              >
                <img
                  src={src}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}

            {imagePreviews.length < 4 && (
              <label
                className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg transition-all ${
                  selectedCategoryId
                    ? "border-gray-300 cursor-pointer hover:border-[#cc1f69] hover:bg-pink-50"
                    : "border-gray-200 cursor-not-allowed bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500 text-center px-2">
                    Upload Image
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                  disabled={!selectedCategoryId} // ✅ Disable if no category selected
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {uploading && (
            <div className="mt-2 text-center">
              <p className="text-[#cc1f69] text-sm font-semibold animate-pulse">
                Uploading images...
              </p>
            </div>
          )}
        </div>

        {/* Variant Details */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Initial Variant Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <input
                type="text"
                {...register("size", { required: "Size is required" })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc1f69] focus:border-transparent outline-none transition-all ${
                  errors.size ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. M, L, 42"
              />
              {errors.size && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.size.message}
                </p>
              )}
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="text"
                {...register("color", { required: "Color is required" })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc1f69] focus:border-transparent outline-none transition-all ${
                  errors.color ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. Red, Blue"
              />
              {errors.color && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.color.message}
                </p>
              )}
            </div>

            {/* Variant Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variant Price
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: 0,
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc1f69] focus:border-transparent outline-none transition-all ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                {...register("stock", {
                  required: "Stock is required",
                  min: 0,
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc1f69] focus:border-transparent outline-none transition-all ${
                  errors.stock ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* Variant Image */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variant Image
              </label>
              {!variantImagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Click to upload variant image
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleVariantImageChange}
                  />
                </label>
              ) : (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 group">
                  <img
                    src={variantImagePreview}
                    alt="Variant Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveVariantImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="bg-[#cc1f69] hover:bg-[#a91853] text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69] focus:ring-offset-2 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading
              ? "Uploading Image..."
              : isSubmitting
                ? "Creating..."
                : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatProduct;
