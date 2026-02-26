import React, { useEffect, useState } from "react";
import { getCategories } from "../../../../Services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const allCategories = response.data || [];
        const mainCategories = allCategories.filter((cat) => !cat.parentId);
        const categoriesWithSubs = mainCategories.map((cat) => ({
          ...cat,
          subCategories: allCategories.filter(
            (sub) => sub.parentId === (cat._id || cat.id),
          ),
        }));
        setCategories(categoriesWithSubs);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900"
            style={{ color: "#cc1f69" }}
          >
            Shop by Category
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Discover a wide range of products based on different categories.
          </p>
        </motion.div>

        {categories.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {categories.map((category) => (
              <motion.div
                key={category._id || category.id}
                variants={itemVariants}
                className="group cursor-pointer text-center"
                onClick={() => {
                  const targetId =
                    category.subCategories && category.subCategories.length > 0
                      ? category.subCategories[0]._id ||
                        category.subCategories[0].id
                      : category._id || category.id;
                  navigate(`/products?categoryId=${targetId}`);
                }}
              >
                <div className="relative overflow-hidden rounded-full w-48 h-48 mx-auto mb-4 shadow-lg">
                  <img
                    src={
                      category.image || "https://via.placeholder.com/400x500"
                    }
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 rounded-full" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#cc1f69] transition-colors">
                  {category.name}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Category;
