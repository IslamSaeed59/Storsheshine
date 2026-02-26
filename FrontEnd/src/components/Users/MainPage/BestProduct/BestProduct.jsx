import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Eye } from "lucide-react";
import { getProducts } from "../../../../Services/api";
import { useNavigate } from "react-router-dom";

const BestProduct = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await getProducts();
        const featured = (response.data.products || []).find(
          (item) => item.isFeatured,
        );
        console.log(" Featured Product:", featured);
        setProduct(featured);
      } catch (error) {
        console.error("Error fetching featured product:", error);
      }
    };
    fetchFeatured();
  }, []);

  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const increaseQuantity = () => setQuantity((prev) => prev + 1);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (!product) return null;

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#cc1f69]/10 px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-[#cc1f69] rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-[#cc1f69]">
              LIMITED TIME OFFER
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#cc1f69] to-[#a91853] bg-clip-text text-transparent">
              Deal of the Day
            </span>
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600">
            Don't miss out on this exclusive offer, available for a limited time
            only.
          </p>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl"
        >
          <div className="relative h-80 md:h-full">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
              {product.name}
            </h2>
            <div className="mt-3 flex items-center gap-3">
              {product.discount > 0 ? (
                <>
                  <p
                    className="text-3xl font-semibold"
                    style={{ color: "#cc1f69" }}
                  >
                    $
                    {(
                      parseFloat(product.basePrice) *
                      (1 - product.discount / 100)
                    ).toFixed(2)}
                  </p>
                  <p className="text-xl text-gray-500 line-through font-medium">
                    ${parseFloat(product.basePrice).toFixed(2)}
                  </p>
                </>
              ) : (
                <p
                  className="text-3xl font-semibold"
                  style={{ color: "#cc1f69" }}
                >
                  ${parseFloat(product.basePrice).toFixed(2)}
                </p>
              )}
            </div>
            <p className="text-gray-600 mt-5 text-base leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8 flex items-center gap-6">
              <span className="text-sm font-medium text-gray-700">
                Quantity:
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span className="text-xl font-bold w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate(`/Product/${product._id || product.id}`)}
              className="w-full mt-10 bg-[#cc1f69] text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-3
                       hover:bg-[#a91853] transition-all duration-300 transform hover:scale-105 
                       focus:outline-none focus:ring-2 focus:ring-[#cc1f69] focus:ring-opacity-75 shadow-md hover:shadow-lg"
              aria-label="View product"
            >
              <Eye size={22} />
              View Product
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BestProduct;
