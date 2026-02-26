import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { getProducts } from "../../../../Services/api";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Bestsellers = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const response = await getProducts();
        const filtered = (response.data.products || []).filter(
          (item) => item.isBestseller,
        );
        setBestsellers(filtered);
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
      }
    };
    fetchBestsellers();
  }, []);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900"
            style={{ color: "#cc1f69" }}
          >
            Our Bestsellers
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Discover the styles our customers love the most.
          </p>
        </motion.div>

        {bestsellers.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8"
          >
            {bestsellers.map((product) => (
              <motion.div
                key={product._id || product.id}
                variants={itemVariants}
                className="group relative cursor-pointer"
                onClick={() =>
                  navigate(`/Product/${product._id || product.id}`)
                }
              >
                <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-center object-cover transition-all duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* <button className="p-3 bg-white rounded-full text-gray-700 hover:bg-[#cc1f69] hover:text-white transition-colors">
                      <ShoppingCart size={20} />
                    </button>
                    <button className="p-3 bg-white rounded-full text-gray-700 hover:bg-[#cc1f69] hover:text-white transition-colors">
                      <Heart size={20} />
                    </button> */}
                  </div>
                </div>
                <h3 className="mt-3 text-sm text-gray-700 text-center sm:text-left">
                  {product.name}
                </h3>
                <div className="mt-1 flex items-center justify-center sm:justify-start gap-2">
                  {product.discount > 0 ? (
                    <>
                      <span className="text-base font-medium text-[#cc1f69]">
                        $
                        {(
                          parseFloat(product.basePrice) *
                          (1 - product.discount / 100)
                        ).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${parseFloat(product.basePrice).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-base font-medium text-gray-900">
                      ${parseFloat(product.basePrice).toFixed(2)}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Bestsellers;
