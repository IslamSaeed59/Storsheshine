import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // ← ADD THIS
import ProductsSidBar from "./ProductsSidBar";
import ProductsGrid from "./ProductsGrid";
import { getProducts } from "../../../Services/api";
import {
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const PRODUCTS_PER_PAGE = 25;

const UserProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // ← ADD THIS
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [initialFilterApplied, setInitialFilterApplied] = useState(false); // ← ADD

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit] = useState(PRODUCTS_PER_PAGE);

  // ========================
  // READ URL PARAMS ON MOUNT
  // ========================
  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const initialFilters = {};
    if (categoryId) initialFilters.categoryId = categoryId;
    if (search) initialFilters.search = search;
    if (minPrice) initialFilters.minPrice = minPrice;
    if (maxPrice) initialFilters.maxPrice = maxPrice;

    const hasInitialFilters = Object.keys(initialFilters).length > 0;

    if (hasInitialFilters) {
      setActiveFilters(initialFilters);
      setInitialFilterApplied(true);
      // Fetch all products and apply filter client-side
      fetchAllAndFilter(initialFilters);
    } else {
      setInitialFilterApplied(true);
      fetchProducts(1);
    }
  }, []); // Only on mount

  // ========================
  // PAGE CHANGE EFFECT
  // ========================
  useEffect(() => {
    if (!initialFilterApplied) return; // Skip until initial load is done

    const hasFilters = Object.keys(activeFilters).some(
      (key) => activeFilters[key],
    );

    // Only fetch from server if NO filters (server-side pagination)
    if (!hasFilters) {
      fetchProducts(currentPage);
    }
  }, [currentPage]);

  // ========================
  // SYNC FILTERS → URL
  // ========================
  const syncFiltersToUrl = (filters) => {
    const params = new URLSearchParams();
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.search) params.set("search", filters.search);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    setSearchParams(params, { replace: true });
  };

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit };
      const response = await getProducts(params);
      const fetchedProducts = response.data.products || [];
      const pagination = response.data.pagination || {};

      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      setTotalPages(pagination.totalPages || 1);
      setTotalProducts(pagination.totalProducts || fetchedProducts.length);
      setCurrentPage(pagination.currentPage || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (filters, productList = products) => {
    let result = [...productList];

    if (filters.categoryId) {
      result = result.filter((p) => {
        const categoryId = p.Category?._id;
        return String(categoryId) === String(filters.categoryId);
      });
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchLower) ||
          p.brand?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower),
      );
    }

    if (filters.minPrice && !isNaN(parseFloat(filters.minPrice))) {
      result = result.filter(
        (p) => parseFloat(p.basePrice) >= parseFloat(filters.minPrice),
      );
    }

    if (filters.maxPrice && !isNaN(parseFloat(filters.maxPrice))) {
      result = result.filter(
        (p) => parseFloat(p.basePrice) <= parseFloat(filters.maxPrice),
      );
    }

    setTotalProducts(result.length);
    setTotalPages(Math.ceil(result.length / limit) || 1);

    const startIndex = (currentPage - 1) * limit;
    const paginatedResult = result.slice(startIndex, startIndex + limit);

    setFilteredProducts(paginatedResult);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    syncFiltersToUrl(filters); // ← Keep URL in sync

    const hasFilters = Object.keys(filters).some((key) => filters[key]);

    if (hasFilters) {
      fetchAllAndFilter(filters);
    } else {
      fetchProducts(1);
    }
  };

  const fetchAllAndFilter = async (filters) => {
    setLoading(true);
    try {
      const response = await getProducts();
      const allProducts = response.data.products || [];
      setProducts(allProducts);
      applyFilters(filters, allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setActiveFilters({});
    setCurrentPage(1);
    setSearchParams({}, { replace: true }); // ← Clear URL params
    fetchProducts(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);

    const hasFilters = Object.keys(activeFilters).some(
      (key) => activeFilters[key],
    );

    if (hasFilters) {
      const startIndex = (page - 1) * limit;
      let result = [...products];

      if (activeFilters.categoryId) {
        result = result.filter(
          (p) => String(p.Category?._id) === String(activeFilters.categoryId),
        );
      }
      if (activeFilters.search) {
        const searchLower = activeFilters.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name?.toLowerCase().includes(searchLower) ||
            p.brand?.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower),
        );
      }
      if (
        activeFilters.minPrice &&
        !isNaN(parseFloat(activeFilters.minPrice))
      ) {
        result = result.filter(
          (p) => parseFloat(p.basePrice) >= parseFloat(activeFilters.minPrice),
        );
      }
      if (
        activeFilters.maxPrice &&
        !isNaN(parseFloat(activeFilters.maxPrice))
      ) {
        result = result.filter(
          (p) => parseFloat(p.basePrice) <= parseFloat(activeFilters.maxPrice),
        );
      }

      setFilteredProducts(result.slice(startIndex, startIndex + limit));
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      const end = Math.min(totalPages, start + maxVisible - 1);
      const adjustedStart = Math.max(1, end - maxVisible + 1);

      if (adjustedStart > 1) {
        pages.push(1);
        if (adjustedStart > 2) pages.push("...");
      }

      for (let i = adjustedStart; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const hasActiveFilters = Object.keys(activeFilters).some(
    (key) => activeFilters[key],
  );

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalProducts);

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-gray-50 overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-0 w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="h-full overflow-y-auto relative">
          <div className="lg:hidden absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-pink-500 border border-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          <ProductsSidBar
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters} // ← Sidebar receives URL-based filters too
          />
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto w-full relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Our Products
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {totalProducts > 0 ? (
                    <>
                      Showing{" "}
                      <span className="font-semibold text-gray-800">
                        {startItem}-{endItem}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-800">
                        {totalProducts}
                      </span>{" "}
                      products
                    </>
                  ) : (
                    "Discover our collection of premium products"
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all shadow-sm"
                >
                  <Filter size={18} />
                  <span>Filters</span>
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#cc1f69] hover:text-[#b01858] font-medium flex items-center gap-1 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-[#cc1f69] transition-all shadow-sm"
                  >
                    <span>Clear filters</span>
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#cc1f69]"></div>
              <p className="mt-4 text-gray-500">Loading products...</p>
            </div>
          )}

          {!loading && <ProductsGrid products={filteredProducts} />}

          {!loading && totalPages > 1 && (
            <div className="mt-8 mb-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-600 order-2 sm:order-1">
                  Page{" "}
                  <span className="font-semibold text-gray-800">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-pink-50 hover:text-[#cc1f69] hover:border-pink-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronsLeft size={18} />
                  </button>

                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-pink-50 hover:text-[#cc1f69] hover:border-pink-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`dots-${index}`}
                          className="px-2 py-1 text-gray-400 text-sm"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${
                            currentPage === page
                              ? "bg-[#cc1f69] text-white shadow-md shadow-pink-200"
                              : "border border-gray-200 text-gray-600 hover:bg-pink-50 hover:text-[#cc1f69] hover:border-pink-200"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <span className="sm:hidden px-3 py-1 text-sm font-medium text-gray-700">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-pink-50 hover:text-[#cc1f69] hover:border-pink-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>

                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-pink-50 hover:text-[#cc1f69] hover:border-pink-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronsRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProducts;
