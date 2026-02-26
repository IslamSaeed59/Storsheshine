import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCategories, deleteCategory } from "../../../Services/api";
import Header from "../../../Layout/Admin/Header";
import {
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
} from "lucide-react";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const getParentName = (parentId) => {
    if (!parentId) return "Main Category";
    const parent = categories.find((c) => c._id === parentId);
    return parent ? parent.name : "Unknown Parent";
  };

  const toggleExpand = (categoryId) => {
    setExpanded((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        setCategories((prev) => prev.filter((category) => category._id !== id));
        toast.success("Category deleted successfully");
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category");
      }
    }
  };

  const renderRow = (category, level = 0) => {
    const children = categories.filter((c) => c.parentId === category._id);
    const hasChildren = children.length > 0;
    const isExpanded = expanded[category._id];

    return (
      <React.Fragment key={category._id}>
        <tr className="group hover:bg-gray-50/80 transition-all duration-200 ease-in-out">
          <td className="px-6 py-4 whitespace-nowrap">
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: `${level * 24}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(category._id)}
                  className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#cc1f69]/20"
                  aria-label={
                    isExpanded ? "Collapse category" : "Expand category"
                  }
                >
                  {isExpanded ? (
                    <ChevronDown
                      size={18}
                      className="transform transition-transform duration-200"
                    />
                  ) : (
                    <ChevronRight
                      size={18}
                      className="transform transition-transform duration-200"
                    />
                  )}
                </button>
              ) : (
                <div className="w-6"></div>
              )}
              <div className="flex items-center gap-2">
                {level === 0 ? (
                  <FolderOpen size={18} className="text-[#cc1f69]/60" />
                ) : (
                  <Folder size={16} className="text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-900 group-hover:text-[#cc1f69] transition-colors duration-200">
                  {category.name}
                </span>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                category.parentId
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {getParentName(category.parentId)}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="text-sm text-gray-500">
              {new Date(category.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
              {/* <button
                onClick={() =>
                  navigate(`/admin/category/update/${category._id}`)
                }
                className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                aria-label="Edit category"
              >
                <Edit size={18} />
              </button> */}
              <button
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                onClick={() => handleDelete(category._id)}
                aria-label="Delete category"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </td>
        </tr>
        {isExpanded && children.map((child) => renderRow(child, level + 1))}
      </React.Fragment>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#cc1f69] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm text-gray-500 animate-pulse">
          Loading categories...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Header
        title="Categories"
        buttonText="Create Category"
        navigation="/admin/category/create"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Parent Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length > 0 ? (
                categories
                  .filter((c) => !c.parentId)
                  .map((category) => renderRow(category))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <FolderOpen size={48} className="text-gray-300" />
                      <p className="text-sm text-gray-500">
                        No categories found
                      </p>
                      <p className="text-xs text-gray-400">
                        Create your first category to get started
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

export default Category;
