import React, { useEffect, useState } from "react";
import { getCategories } from "../../../Services/api";
import {
  Search,
  Filter,
  Heart,
  Sparkles,
  X,
  Check,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const ProductsSidBar = ({ onFilterChange, activeFilters = {} }) => {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [filters, setFilters] = useState({
    categoryId: activeFilters.categoryId || "",
    minPrice: activeFilters.minPrice || "",
    maxPrice: activeFilters.maxPrice || "",
    search: activeFilters.search || "",
  });

  useEffect(() => {
    setFilters({
      categoryId: activeFilters.categoryId || "",
      minPrice: activeFilters.minPrice || "",
      maxPrice: activeFilters.maxPrice || "",
      search: activeFilters.search || "",
    });
  }, [activeFilters]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const allCategories = response.data || [];

        // Organize categories into parent-child structure
        const mainCategories = allCategories.filter((cat) => !cat.parentId);
        const organizedCategories = mainCategories.map((mainCat) => ({
          ...mainCat,
          subCategories: allCategories.filter(
            (cat) => cat.parentId === (mainCat.id || mainCat._id),
          ),
        }));

        setCategories(organizedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryClick = (categoryId) => {
    const newFilters = {
      ...filters,
      categoryId: filters.categoryId === categoryId ? "" : categoryId,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleExpanded = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const clearSearch = () => {
    const newFilters = { ...filters, search: "" };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      categoryId: "",
      minPrice: "",
      maxPrice: "",
      search: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="">
      {/* Header with gradient */}
      <div className="bg-white p-5  border-pink-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <Filter size={16} className="text-pink-500" />
            </div>
            <h3 className="font-semibold text-gray-800">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm"
            >
              <span>Clear all</span>
              <Sparkles size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Search with feminine styling */}
      <div className="p-5 border-b border-pink-100">
        <div className="relative">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="Search products..."
            className="w-full pl-10 pr-8 py-2.5 text-sm border border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 bg-pink-50/30 placeholder-pink-400 text-gray-700 transition-all"
          />
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400"
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-300 hover:text-pink-500 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300"></div>

      {/* Categories with feminine styling */}
      <div className="p-5 border-b border-pink-100">
        <h4 className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 uppercase tracking-wider mb-3 flex items-center gap-1">
          Categories
        </h4>
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-pink-200">
          <button
            onClick={() => handleCategoryClick("")}
            className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-all flex items-center justify-between group ${
              filters.categoryId === ""
                ? "bg-pink-50 text-pink-600 font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-pink-500"
            }`}
          >
            <span className="flex items-center gap-2">All Categories</span>
            {filters.categoryId === "" && (
              <Check size={14} className="text-pink-500" />
            )}
          </button>
          {categories.map((category) => {
            const categoryId = category.id || category._id;
            const isExpanded = expandedCategories[categoryId];
            const hasSubcategories =
              category.subCategories && category.subCategories.length > 0;

            return (
              <div key={categoryId}>
                <button
                  onClick={() => {
                    if (hasSubcategories) {
                      toggleExpanded(categoryId);
                    } else {
                      handleCategoryClick(categoryId);
                    }
                  }}
                  className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-all flex items-center justify-between group ${
                    filters.categoryId === categoryId
                      ? "bg-pink-50 text-pink-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-pink-500"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {category.name}
                  </span>
                  {hasSubcategories ? (
                    isExpanded ? (
                      <ChevronDown size={14} className="text-pink-500" />
                    ) : (
                      <ChevronRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 text-pink-300 transition-opacity"
                      />
                    )
                  ) : filters.categoryId === categoryId ? (
                    <Check size={14} className="text-pink-500" />
                  ) : (
                    <ChevronRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 text-pink-300 transition-opacity"
                    />
                  )}
                </button>

                {/* Subcategories */}
                {hasSubcategories && isExpanded && (
                  <div className="ml-4 space-y-1 mt-1">
                    {category.subCategories.map((subCategory) => {
                      const subCategoryId = subCategory.id || subCategory._id;
                      return (
                        <button
                          key={subCategoryId}
                          onClick={() => handleCategoryClick(subCategoryId)}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all flex items-center justify-between group ${
                            filters.categoryId === subCategoryId
                              ? "bg-pink-100 text-pink-600 font-semibold"
                              : "text-gray-500 hover:bg-pink-50 hover:text-pink-500"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-pink-300 rounded-full"></span>
                            {subCategory.name}
                          </span>
                          {filters.categoryId === subCategoryId && (
                            <Check size={12} className="text-pink-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300"></div>

      {/* Price Range with feminine styling */}
      <div className="p-5 bg-gradient-to-b from-white to-pink-50/30">
        <h4 className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 uppercase tracking-wider mb-3 flex items-center gap-1">
          <Sparkles size={12} className="text-pink-400" />
          Price Range
        </h4>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-pink-400 text-xs">
                $
              </span>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full pl-6 pr-2 py-2 text-sm border border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 bg-white placeholder-pink-300 text-gray-700"
                min="0"
              />
            </div>
          </div>
          <span className="text-pink-300 font-medium">—</span>
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-pink-400 text-xs">
                $
              </span>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleInputChange}
                placeholder="Any"
                className="w-full pl-6 pr-2 py-2 text-sm border border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 bg-white placeholder-pink-300 text-gray-700"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Quick price suggestions */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => {
              const newFilters = { ...filters, minPrice: "0", maxPrice: "250" };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
            className="flex-1 text-xs bg-white border border-pink-200 text-pink-500 py-1.5 rounded-xl hover:bg-pink-50 transition-colors"
          >
            Under $250
          </button>
          <button
            onClick={() => {
              const newFilters = {
                ...filters,
                minPrice: "250",
                maxPrice: "500",
              };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
            className="flex-1 text-xs bg-white border border-pink-200 text-pink-500 py-1.5 rounded-xl hover:bg-pink-50 transition-colors"
          >
            $250 - $500
          </button>
          <button
            onClick={() => {
              const newFilters = { ...filters, minPrice: "500", maxPrice: "" };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
            className="flex-1 text-xs bg-white border border-pink-200 text-pink-500 py-1.5 rounded-xl hover:bg-pink-50 transition-colors"
          >
            $500+
          </button>
        </div>
      </div>

      {/* Decorative element */}
      <div className="h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300"></div>
    </div>
  );
};

export default ProductsSidBar;
