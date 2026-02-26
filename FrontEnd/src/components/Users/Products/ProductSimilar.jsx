import { useEffect, useState } from "react";
import { getProductsByCategory } from "../../../Services/api";
import ProductsGrid from "./ProductsGrid";
import { Sparkles } from "lucide-react";

const ProductSimilar = ({ categoryId, currentProductId }) => {
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!categoryId) return;

      try {
        const response = await getProductsByCategory(categoryId);
        console.log("Similar Products Response:", response.data);
        const products = response.data || [];

        // Filter out the current product
        const filtered = products.filter((p) => p._id !== currentProductId);

        // Shuffle and take 4 random products
        const randomSelection = filtered
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);

        setSimilarProducts(randomSelection);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };

    fetchSimilar();
  }, [categoryId, currentProductId]);

  if (similarProducts.length === 0) return null;

  return (
    <div className="py-16 bg-gradient-to-b from-white to-pink-50/30 border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center justify-center p-3 bg-pink-100 rounded-full mb-4 shadow-sm">
            <Sparkles className="text-pink-500" size={24} />
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            You Might Also Like
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover more items that complement your style
          </p>
        </div>
        <ProductsGrid products={similarProducts} />
      </div>
    </div>
  );
};

export default ProductSimilar;
