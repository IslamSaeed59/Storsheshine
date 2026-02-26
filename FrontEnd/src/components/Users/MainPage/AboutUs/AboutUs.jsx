import React from "react";
import { motion } from "framer-motion";
import {
  FaApple,
  FaGoogle,
  FaMicrosoft,
  FaAmazon,
  FaFacebook,
} from "react-icons/fa";

// Placeholder for the large background image
const aboutImageUrl =
  "https://images.unsplash.com/photo-1483181957632-8bda974cbc91?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470";

const AboutUs = () => {
  return (
    <section className="relative grid lg:grid-cols-2 min-h-screen bg-white">
      {/* Left Side: Text Content */}
      <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            About Us
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-[#cc1f69] mt-2 mb-6">
            Where Vision Meets Innovation
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Built with a deep understanding of women’s needs and style, our
            mission is to empower every girl and woman through carefully
            selected fashion, beauty, and lifestyle products. We are passionate
            about delivering quality, elegance, and confidence in every piece we
            offer — because you deserve to feel your absolute best every day.
          </p>
        </motion.div>
      </div>

      {/* Right Side: Background Image */}
      <div className="relative h-64 lg:h-full">
        <img
          src={aboutImageUrl}
          alt="A modern team collaborating in a bright office"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </section>
  );
};

export default AboutUs;
