import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createCategory,
  getCategories,
  uploadCategoryImage,
} from "../../../Services/api";
import { FiUpload, FiX } from "react-icons/fi";

const CreateCategory = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
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

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageUpload = async (categoryName) => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("categoryName", categoryName || "categories");
    formData.append("categoryImage", imageFile);

    try {
      setUploading(true);
      const response = await uploadCategoryImage(formData);
      console.log("✅ Upload response:", response.data);
      return response.data.imageUrl;
    } catch (error) {
      console.error("❌ Upload error:", error);
      toast.error("Image upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        console.log(response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  console.log("Categories:", categories);
  const onSubmit = async (data) => {
    if (!imageFile) {
      toast.error("Please upload a category image");
      return;
    }

    const imageUrl = await handleImageUpload(data.name);
    if (!imageUrl) return;

    try {
      const payload = {
        ...data,
        parentId: data.parentId || null,
        image: imageUrl,
      };
      await createCategory(payload);
      toast.success("Category created successfully");
      navigate("/admin/category");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create New Category
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cc1f69] focus:border-transparent outline-none transition-all ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter category name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Category (Optional)
          </label>
          <select
            {...register("parentId")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cc1f69] focus:border-transparent outline-none transition-all"
          >
            <option value="">None (Main Category)</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Image
          </label>

          {!imagePreview ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#cc1f69] hover:bg-pink-50 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-10 h-10 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold text-[#cc1f69]">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          ) : (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#cc1f69] hover:bg-[#a91853] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc1f69] focus:ring-offset-2 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
