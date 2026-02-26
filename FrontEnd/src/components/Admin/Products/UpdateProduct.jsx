import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getProductById,
  updateProduct,
  getCategories,
  updateVariant,
} from "../../../Services/api";
import Header from "../../../Layout/Admin/Header";
import { Save, X, Package, DollarSign, Layers, Edit3 } from "lucide-react";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingVariant, setSavingVariant] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          getProductById(id),
          getCategories(),
        ]);

        setCategories(categoriesResponse.data || []);

        const product = productResponse.data;
        if (product) {
          setValue("name", product.name);
          setValue("description", product.description);
          setValue("categoryId", product.categoryId?._id || product.categoryId);
          setValue("basePrice", product.basePrice);
          setValue("brand", product.brand);
          setValue("isBestseller", product.isBestseller);
          setValue("isFeatured", product.isFeatured);
          setValue("discount", product.discount);

          setVariants(
            (product.ProductVariants || []).map((v) => ({
              ...v,
              color: Array.isArray(v.color) ? v.color.join(", ") : v.color,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load product details");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        basePrice: parseFloat(data.basePrice),
        categoryId: data.categoryId,
        discount: parseFloat(data.discount),
      };

      await updateProduct(id, payload);
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const onUpdateVariant = async (index) => {
    const variant = variants[index];
    setSavingVariant(variant._id);
    try {
      await updateVariant(variant._id, {
        size: variant.size,
        color: variant.color.split(",").map((c) => c.trim()),
        price: parseFloat(variant.price),
        stock: parseInt(variant.stock),
      });
      toast.success("Variant updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update variant");
    } finally {
      setSavingVariant(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#cc1f69] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm text-gray-500 animate-pulse">
          Loading product details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Header
        title="Update Product"
        buttonText="Back to Products"
        navigation="/admin/products"
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Product Details Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Package size={20} className="text-[#cc1f69]" />
              Product Information
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name - Full Width */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all ${
                    errors.name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <X size={12} />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Description - Full Width */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  rows="4"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all resize-none ${
                    errors.description
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <X size={12} />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-600">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("categoryId", {
                    required: "Category is required",
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all appearance-none bg-white ${
                    errors.categoryId
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => {
                    const parent = categories.find(
                      (c) => c._id === cat.parentId,
                    );
                    return (
                      <option key={cat._id} value={cat._id}>
                        {parent ? `${parent.name} → ${cat.name}` : cat.name}
                      </option>
                    );
                  })}
                </select>
                {errors.categoryId && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <X size={12} />
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              {/* Base Price */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-600">
                  Base Price ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("basePrice", {
                      required: "Base Price is required",
                      min: { value: 0, message: "Price must be positive" },
                    })}
                    className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all ${
                      errors.basePrice
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.basePrice && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <X size={12} />
                    {errors.basePrice.message}
                  </p>
                )}
              </div>

              {/* Brand */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-600">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("brand", {
                    required: "Brand is required",
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all ${
                    errors.brand
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Enter brand name"
                />
                {errors.brand && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <X size={12} />
                    {errors.brand.message}
                  </p>
                )}
              </div>

              {/* Status Flags */}
              <div className="flex items-center gap-6 pt-7">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("isBestseller")}
                    className="w-5 h-5 text-[#cc1f69] border-gray-300 rounded 
                 focus:ring-2 focus:ring-[#cc1f69] focus:ring-offset-0
                 transition-colors duration-200"
                  />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                    Is Bestseller
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("isFeatured")}
                    className="w-5 h-5 text-[#cc1f69] border-gray-300 rounded 
                 focus:ring-2 focus:ring-[#cc1f69] focus:ring-offset-0
                 transition-colors duration-200"
                  />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                    Is Featured
                  </span>
                </label>
              </div>
              {/* Discount */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-600">
                  Discount (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register("discount")}
                    className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all ${
                      errors.discount
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.discount && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <X size={12} />
                      {errors.discount.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#cc1f69] hover:bg-[#a91853] text-white px-6 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              >
                <Save size={18} />
                {isSubmitting ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>

        {/* Variants Update Section - Horizontal Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Layers size={20} className="text-[#cc1f69]" />
              Product Variants
            </h3>
          </div>

          <div className="p-6">
            {variants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {variants.map((variant, index) => (
                  <div
                    key={variant._id}
                    className="group bg-white hover:shadow-md border border-gray-200 rounded-xl p-4 transition-all duration-200 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#cc1f69]/10 to-[#cc1f69]/5 flex items-center justify-center">
                          <Edit3 size={16} className="text-[#cc1f69]" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          Variant #{index + 1}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onUpdateVariant(index)}
                        disabled={savingVariant === variant._id}
                        className="flex items-center gap-1.5 text-xs bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={14} />
                        {savingVariant === variant._id ? "Saving..." : "Save"}
                      </button>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">
                            Size
                          </label>
                          <input
                            type="text"
                            value={variant.size}
                            onChange={(e) =>
                              handleVariantChange(index, "size", e.target.value)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all bg-gray-50 hover:bg-white"
                            placeholder="Size"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">
                            Color
                          </label>
                          <input
                            type="text"
                            value={variant.color}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "color",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all bg-gray-50 hover:bg-white"
                            placeholder="Color"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={variant.price}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "price",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all bg-gray-50 hover:bg-white"
                            placeholder="Price"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-medium">
                            Stock
                          </label>
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "stock",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all bg-gray-50 hover:bg-white"
                            placeholder="Stock"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stock Status Indicator */}
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Status</span>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            parseInt(variant.stock) > 10
                              ? "bg-green-100 text-green-700"
                              : parseInt(variant.stock) > 0
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {parseInt(variant.stock) > 10
                            ? "In Stock"
                            : parseInt(variant.stock) > 0
                              ? "Low Stock"
                              : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-gray-50 rounded-full p-4 mb-4">
                  <Layers size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  No variants found for this product
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Variants can be added from the product details page
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
