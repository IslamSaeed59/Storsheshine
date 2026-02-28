import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getProducts,
  deleteProduct,
  searchProducts,
  searchProductsByCategory,
  getCategories,
} from "../../../Services/api";
import Header from "../../../Layout/Admin/Header";
import { Edit, Trash2, Eye, Search } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((product) => product._id !== id));
        toast.success("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (selectedCategory) {
      setSelectedCategory("");
    }

    if (query.trim() === "") {
      fetchProducts();
      return;
    }

    try {
      const response = await searchProducts(query);
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSearchTerm("");
    setLoading(true);

    try {
      if (categoryId === "") {
        await fetchProducts();
      } else {
        const response = await searchProductsByCategory(categoryId);
        setProducts(response.data || []);
      }
    } catch (error) {
      console.error("Error filtering products:", error);
      toast.error("Failed to filter products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc1f69]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header
        title="Products"
        buttonText="Create Product"
        navigation="/admin/products/create"
      />

      {/* Search Bar */}
      <div className="mx-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative max-w-md group w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#cc1f69] transition-colors duration-200" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] 
                 hover:border-gray-300 transition-all duration-200 sm:text-sm"
            placeholder="Search products by name, brand or description..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Category Filter */}
        <div className="relative w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="block w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20 focus:border-[#cc1f69] hover:border-gray-300 transition-all duration-200 sm:text-sm appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mx-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Base Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50/80 transition-colors duration-150 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Image with improved styling */}
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
                          {product.images ? (
                            <img
                              src={
                                Array.isArray(product.images)
                                  ? product.images[0]
                                  : product.images
                              }
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                              alt={product.name}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.innerHTML =
                                  '<div class="h-full w-full flex items-center justify-center text-gray-400 text-sm font-medium">' +
                                  product.name.charAt(0).toUpperCase() +
                                  "</div>";
                              }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm font-medium">
                              {product.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Text content with improved spacing */}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 leading-5 mb-1 group-hover:text-[#cc1f69] transition-colors duration-200">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1 leading-4">
                            {product.description || (
                              <span className="italic text-gray-400">
                                No description
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {product.Category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        ${parseFloat(product.basePrice).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {new Date(product.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/product/${product._id}`)
                          }
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/products/update/${product._id}`)
                          }
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">
                        No products found
                      </p>
                      <p className="text-sm text-gray-400">
                        Try adjusting your search or create a new product
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
  );
};

export default Products;
