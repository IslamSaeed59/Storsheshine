import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Menu, X, Sparkles, LayoutDashboard, LogOut } from "lucide-react";
import { toast } from "react-toastify";

const PromotionalBar = () => {
  const text =
    "✨ Today’s deal: Buy X and get Y% off! 💅 New arrivals just landed — check them out! 🎁 Free shipping on all orders over $50! 🔥 Limited time offer — don’t miss out!";

  return (
    <div className="relative bg-[#cc1f69] text-white text-sm font-semibold overflow-hidden w-full h-10 flex items-center">
      <motion.div
        className="absolute flex items-center gap-12 whitespace-nowrap"
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          ease: "linear",
          duration: 15, // السرعة
          repeat: Infinity,
        }}
      >
        {[...Array(1)].map((_, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-3 px-6 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 flex-shrink-0" />
            <span className="whitespace-nowrap">{text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const UserTopBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    toast.dark("Logout successful!");
  };

  const toggleFavoriteSidebar = () => {
    setIsFavoriteOpen(!isFavoriteOpen);
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    // { name: "Bags", path: "/products/bags" },
    // { name: "Dresses", path: "/products/dresses" },
    // { name: "Sale", path: "/sale" },
  ];

  const activeLinkStyle = {
    color: "#cc1f69",
    textDecoration: "underline",
    textUnderlineOffset: "8px",
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* <PromotionalBar /> */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl font-bold tracking-wider">
              She<span style={{ color: "#cc1f69" }}>shine</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
                className="text-gray-600 hover:text-[#cc1f69] text-sm font-medium transition-colors duration-300"
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Icons and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* <button
              onClick={toggleFavoriteSidebar}
              className="text-gray-500 hover:text-[#cc1f69] transition-colors"
            >
              <Heart size={22} />
            </button>
            <Link
              to="/cart"
              className="relative text-gray-500 hover:text-[#cc1f69] transition-colors"
            >
              <ShoppingBag size={22} />
              <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-[#cc1f69] text-white text-xs font-bold">
                3
              </span>
            </Link>
            <Link
              to={user?.id ? `/Profile/${user.id}` : "/Profile/guest"}
              className="hidden sm:block text-gray-500 hover:text-[#cc1f69] transition-colors"
            >
              <User size={22} />
            </Link> */}

            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-500 hover:text-[#cc1f69] transition-colors"
                title="Admin Dashboard"
              >
                <LayoutDashboard size={22} />
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="hidden lg:block text-gray-500 hover:text-[#cc1f69] transition-colors"
            >
              <LogOut size={22} />
            </button>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-[#cc1f69] transition-colors"
              >
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#cc1f69] hover:bg-gray-50"
              >
                {link.name}
              </NavLink>
            ))}
            <NavLink
              to={user?.id ? `/Profile/${user.id}` : "/Profile/guest"}
              onClick={() => setIsMenuOpen(false)}
              className="sm:hidden block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#cc1f69] hover:bg-gray-50"
            >
              Profile
            </NavLink>

            {user && user.role === "admin" && (
              <NavLink
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="sm:hidden block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#cc1f69] hover:bg-gray-50"
              >
                Admin Dashboard
              </NavLink>
            )}
            <button
              onClick={handleLogout}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#cc1f69] hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default UserTopBar;
