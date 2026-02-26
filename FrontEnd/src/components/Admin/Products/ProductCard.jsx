import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, createVariant } from "../../../Services/api";
import Header from "../../../Layout/Admin/Header";
import { toast } from "react-toastify";
import {
  Package,
  Plus,
  Save,
  X,
  ArrowLeft,
  Tag,
  Layers,
  Calendar,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";

const ProductCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [newVariant, setNewVariant] = useState({
    size: "",
    color: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id);
      console.log("Product Response:", response.data);
      setProduct(response.data);
      setImageError(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateVariant = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...newVariant,
        productId: id,
        color: newVariant.color.split(",").map((c) => c.trim()),
        price: parseFloat(newVariant.price),
        stock: parseInt(newVariant.stock),
      };

      await createVariant(payload);
      toast.success("Variant added successfully");
      setShowVariantForm(false);
      setNewVariant({ size: "", color: "", price: "", stock: "" });
      fetchProduct();
    } catch (error) {
      console.error("Error creating variant:", error);
      toast.error(error.response?.data?.message || "Failed to add variant");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
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

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-50 rounded-full p-6 mb-4">
          <Package size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Product not found
        </h2>
        <p className="text-gray-500 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 text-[#cc1f69] hover:text-[#a91853] transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Header
        title={product.name}
        buttonText="Back to Products"
        navigation="/admin/products"
      />

      {/* Product Details Card with Image */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Package size={20} className="text-[#cc1f69]" />
              Product Details
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={16} className="text-gray-400" />
              <span>
                Created{" "}
                {new Date(product.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Image Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border-2 border-gray-200 shadow-sm">
                  {product.image && !imageError ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                      <ImageIcon size={64} className="text-gray-300 mb-3" />
                      <p className="text-sm text-gray-400 font-medium">
                        No image available
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {imageError
                          ? "Failed to load image"
                          : "Image not uploaded"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Tag size={16} className="text-gray-400" />
                  Description
                </div>
                <p className="text-gray-800 bg-gray-50 rounded-lg p-4 border border-gray-100 leading-relaxed">
                  {product.description || "No description provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm border border-blue-200 font-medium">
                    {product.Category?.name || "Uncategorized"}
                  </div>
                </div>

                <div className="space-y-1 bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-100">
                  <p className="text-sm font-medium text-gray-500">Brand</p>
                  <p className="text-gray-800 font-semibold text-lg">
                    {product.brand || "—"}
                  </p>
                </div>

                <div className="space-y-1 bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-100">
                  <p className="text-sm font-medium text-gray-500">
                    Base Price
                  </p>
                  <p className="text-gray-800 font-semibold text-lg flex items-center gap-1">
                    <DollarSign size={18} className="text-green-600" />
                    {parseFloat(product.basePrice).toFixed(2)}
                  </p>
                </div>

                <div className="space-y-1 bg-gradient-to-br from-orange-50 to-white p-4 rounded-lg border border-orange-100">
                  <p className="text-sm font-medium text-gray-500">
                    Total Variants
                  </p>
                  <p className="text-gray-800 font-semibold text-lg">
                    {product.ProductVariants?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Layers size={20} className="text-[#cc1f69]" />
              Product Variants
            </h3>
            <button
              onClick={() => setShowVariantForm(!showVariantForm)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                showVariantForm
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-[#cc1f69] text-white hover:bg-[#a91853]"
              }`}
            >
              {showVariantForm ? <X size={18} /> : <Plus size={18} />}
              <span className="text-sm font-medium">
                {showVariantForm ? "Cancel" : "Add Variant"}
              </span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Add Variant Form */}
          {showVariantForm && (
            <form
              onSubmit={handleCreateVariant}
              className="mb-8 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <h4 className="text-base font-medium mb-4 text-gray-700 flex items-center gap-2">
                <Plus size={18} className="text-green-600" />
                New Variant Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-600">
                    Size <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={newVariant.size}
                    onChange={handleVariantChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all"
                    placeholder="e.g., M, XL, 42"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-600">
                    Colors (comma separated)
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={newVariant.color}
                    onChange={handleVariantChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all"
                    placeholder="e.g., Red, Blue, Green"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-600">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    value={newVariant.price}
                    onChange={handleVariantChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-600">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={newVariant.stock}
                    onChange={handleVariantChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Save size={18} />
                  {submitting ? "Saving..." : "Save Variant"}
                </button>
              </div>
            </form>
          )}

          {/* Variants Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {product.ProductVariants &&
                product.ProductVariants.length > 0 ? (
                  product.ProductVariants.map((variant, index) => (
                    <tr
                      key={variant._id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {variant.size}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {Array.isArray(variant.color) ? (
                            variant.color.map((c, i) => (
                              <span
                                key={i}
                                className="inline-block w-5 h-5 rounded-full border-2 border-black shadow-sm"
                                style={{
                                  backgroundColor: c.toLowerCase(),
                                }}
                                title={c}
                              ></span>
                            ))
                          ) : (
                            <span
                              className="inline-block w-5 h-5 rounded-full border-2 border-black shadow-sm"
                              style={{
                                backgroundColor: variant.color.toLowerCase(),
                              }}
                              title={variant.color}
                            ></span>
                          )}
                          <span className="text-sm text-gray-700">
                            {Array.isArray(variant.color)
                              ? variant.color.join(", ")
                              : variant.color}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-600">
                          ${parseFloat(variant.price).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            variant.stock > 10
                              ? "text-green-600"
                              : variant.stock > 0
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {variant.stock} units
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Layers size={40} className="text-gray-300" />
                        <p className="text-sm text-gray-500">
                          No variants found for this product
                        </p>
                        <p className="text-xs text-gray-400">
                          Click "Add Variant" to create your first variant
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
