import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    {
      icon: <FaFacebookF />,
      href: "https://www.facebook.com/groups/439867414711089/",
    },
    {
      icon: <FaInstagram />,
      href: "https://www.instagram.com/sheshine_o/?hl=en",
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h2 className="text-3xl font-bold text-white mb-4">
              She<span className="text-[#cc1f69]">Shine</span>
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Explore our exclusive collection of women’s products, from elegant
              fashion pieces and beauty essentials to everyday must-haves — all
              thoughtfully selected to celebrate confidence, comfort, and style.
            </p>
          </div>

          {/* Legal */}
          <div className="mt-8 md:mt-0">
            <h3 className="text-lg font-semibold text-[#cc1f69] tracking-wider uppercase mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to=""
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to=""
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to=""
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="mt-8 md:mt-0">
            <h3 className="text-lg font-semibold text-[#cc1f69] tracking-wider uppercase mb-5">
              Stay Connected
            </h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#cc1f69] transition-colors text-2xl"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} SheShine. All Rights Reserved.
            Made by Eng Eslam
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
