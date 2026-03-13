import React, { useEffect, useState } from "react";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  // Using some mock data for the design phase since there's no cart logic provided yet
  const [cartItems, setCartItems] = useState([
    {
      _id: "1",
      name: "Elegant Silk Blouse",
      brand: "LUMIERE",
      price: 1200,
      image: "https://images.unsplash.com/photo-1550614000-4b95d466ee8b?q=80&w=2670&auto=format&fit=crop",
      quantity: 1,
      variant: { size: "M", color: "Cream" }
    },
    {
      _id: "2",
      name: "Tailored Trousers",
      brand: "ESSENTIALS",
      price: 1850,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2574&auto=format&fit=crop",
      quantity: 1,
      variant: { size: "S", color: "Black" }
    }
  ]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => item._id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item._id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 50; // Free shipping over 2000 EGP
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-serif font-medium text-gray-900 flex items-center gap-2">
                Your Bag <span className="text-sm font-sans text-gray-400 font-normal">({cartItems.length})</span>
              </h2>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-900 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-gray-300" strokeWidth={1} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">Your bag is empty</h3>
                    <p className="text-gray-500 text-sm">Discover our latest arrivals and elevate your wardrobe.</p>
                  </div>
                  <button 
                    onClick={() => {
                      onClose();
                      navigate('/Products');
                    }}
                    className="mt-4 px-8 py-3 bg-gray-900 text-white text-xs tracking-[0.2em] uppercase hover:bg-primary transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4 group">
                      {/* Item Image */}
                      <div className="w-24 aspect-[3/4] bg-gray-50 overflow-hidden cursor-pointer" onClick={() => { onClose(); navigate(`/Product/${item._id}`); }}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">{item.brand}</p>
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary cursor-pointer transition-colors" onClick={() => { onClose(); navigate(`/Product/${item._id}`); }}>
                              {item.name}
                            </h4>
                          </div>
                          <button 
                            onClick={() => removeItem(item._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="text-xs text-gray-500 mb-3 space-x-2">
                          {item.variant.color && <span>Color: {item.variant.color}</span>}
                          {item.variant.color && item.variant.size && <span className="text-gray-300">|</span>}
                          {item.variant.size && <span>Size: {item.variant.size}</span>}
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-gray-200 h-8 max-w-[90px]">
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                            >
                              <Minus size={12} strokeWidth={2} />
                            </button>
                            <span className="flex-1 text-center text-xs font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                            >
                              <Plus size={12} strokeWidth={2} />
                            </button>
                          </div>
                          
                          <span className="text-sm font-medium text-gray-900">
                            EGP {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-6 space-y-6">
                
                {/* Free Shipping Progress Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-600">Free Shipping Progress</span>
                    {subtotal >= 2000 ? (
                      <span className="text-green-600">You achieved free shipping!</span>
                    ) : (
                      <span className="text-gray-400">EGP {(2000 - subtotal).toFixed(2)} away</span>
                    )}
                  </div>
                  <div className="h-1 bg-gray-200 w-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${subtotal >= 2000 ? 'bg-green-500' : 'bg-gray-900'}`}
                      style={{ width: `${Math.min((subtotal / 2000) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200/50">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>EGP {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `EGP ${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium text-gray-900 pt-3 border-t border-gray-200/50">
                    <span>Total</span>
                    <span>EGP {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full h-14 bg-gray-900 hover:bg-primary text-white text-xs tracking-[0.2em] font-medium uppercase transition-colors flex items-center justify-center gap-2 group">
                    Checkout Securely
                    <ArrowRight size={16} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={onClose}
                    className="w-full h-12 bg-white border border-gray-200 hover:border-gray-900 text-gray-900 text-xs tracking-widest font-medium uppercase transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
