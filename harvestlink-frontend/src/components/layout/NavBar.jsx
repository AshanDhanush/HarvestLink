import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import logo from "../../assets/Logo-L_1@0.75x.png";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 h-24 flex items-center justify-between">
        
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="HarvestLink Logo"
            className="h-10 md:h-14 w-auto object-contain"
          />
        </Link>

        <div className="hidden md:flex flex-1 pt-4 max-w-xl mx-8">
          <div className="w-full flex items-center border border-bg-harvest-dark rounded-full bg-white">
            
            <button className="flex items-center gap-2 bg-harvest-dark text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-opacity-90 transition shrink-0">
              All Categories <ChevronDown size={14} />
            </button>

           
            <input
              type="text"
              className="flex-1 px-4 py-2 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
              placeholder="Search for fresh produce..."
            />

           
            <div className="pr-4">
              <Search className="text-gray-400 w-5 h-5 hover:text-harvest-primary cursor-pointer transition" />
            </div>
          </div>
        </div>

        
        <div className="hidden md:flex pt-4 items-center gap-6">
          <Link
            to="/"
            className="text-harvest-text font-medium hover:text-harvest-primary transition"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-harvest-text font-medium hover:text-harvest-primary transition"
          >
            Shop
          </Link>
          <Link
            to="/about"
            className="text-harvest-text font-medium hover:text-harvest-primary transition"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-harvest-text font-medium hover:text-harvest-primary transition"
          >
            Contact
          </Link>

          <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
            <button className="p-2 rounded-full hover:bg-gray-100 text-harvest-dark transition">
              <Heart className="w-6 h-6" />
            </button>
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-gray-100 text-harvest-dark relative transition"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-harvest-primary text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
            <Link
              to="/login"
              className="p-2 rounded-full hover:bg-gray-100 text-harvest-dark transition"
            >
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>

       
        <button
          className="md:hidden p-2 text-harvest-text"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

    
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4">
       
          <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-gray-50">
            <input
              type="text"
              className="w-full bg-transparent outline-none px-2"
              placeholder="Search..."
            />
            <Search className="text-gray-400 w-5 h-5" />
          </div>

          <div className="flex flex-col gap-2">
            <Link to="/" className="py-2 text-harvest-text font-medium">
              Home
            </Link>
            <Link to="/shop" className="py-2 text-harvest-text font-medium">
              Shop
            </Link>
            <Link to="/about" className="py-2 text-harvest-text font-medium">
              About
            </Link>
            <Link to="/contact" className="py-2 text-harvest-text font-medium">
              Contact
            </Link>
            <hr className="border-gray-100 my-2" />
            <Link
              to="/login"
              className="py-2 text-harvest-text font-medium flex items-center gap-2"
            >
              <User size={18} /> Login / Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
