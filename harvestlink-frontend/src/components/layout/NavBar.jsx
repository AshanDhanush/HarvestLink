import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import logo from "../../assets/Logo-L_1@0.75x.png";
import authService from "../../services/authService";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const profileRef = useRef(null);
  const categoryRef = useRef(null);

  const categories = ["All Categories", "Vegetables", "Fruits", "Grains", "Spices"];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "All Categories") {
      params.append("category", selectedCategory);
    }
    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }
    navigate(`/shop?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Check for logged-in user on component mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsProfileOpen(false);
    navigate("/login");
  };

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
          <div className="w-full flex items-center border border-bg-harvest-dark rounded-full bg-white relative">
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-2 bg-harvest-dark text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-opacity-90 transition shrink-0"
              >
                {selectedCategory} <ChevronDown size={14} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsCategoryOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:text-harvest-primary transition ${selectedCategory === category ? "text-harvest-primary font-medium" : "text-gray-700"
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              className="flex-1 px-4 py-2 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
              placeholder={
                selectedCategory === "All Categories"
                  ? "Search for fresh produce..."
                  : `Search for ${selectedCategory.toLowerCase()}...`
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <div className="pr-4">
              <Search
                className="text-gray-400 w-5 h-5 hover:text-harvest-primary cursor-pointer transition"
                onClick={handleSearch}
              />
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
            <Link to="/wishlist" className="p-2 rounded-full hover:bg-gray-100 text-harvest-dark transition relative">
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-gray-100 text-harvest-dark relative transition"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-harvest-primary text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            </Link>

            {/* User Profile Dropdown Logic */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 text-harvest-dark transition flex items-center focus:outline-none"
                >
                  <User className="w-6 h-6" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.name || user.username || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>

                    </div>



                    {(user.role === 'FARMER' || user.role === 'Farmer') ? (
                      <>
                        <Link
                          to="/farmer/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-harvest-primary transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <Link
                          to="/farmer/dashboard?view=add-harvest"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-harvest-primary transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <LayoutDashboard size={16} /> Add Product
                        </Link>
                        <Link
                          to="/farmer/dashboard?view=profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-harvest-primary transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User size={16} /> Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-harvest-primary transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <ShoppingCart size={16} /> Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-harvest-primary transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Heart size={16} /> Wishlist
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/orders"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-harvest-primary transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <ShoppingCart size={16} /> Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-harvest-primary transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Heart size={16} /> Wishlist
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-harvest-primary transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User size={16} /> Profile
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-full hover:bg-gray-100 text-harvest-dark transition"
              >
                <User className="w-6 h-6" />
              </Link>
            )}
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

            {/* Mobile Menu User Options */}
            {user ? (
              <>
                <div className="border-b border-gray-100 pb-2 mb-2">
                  <p className="px-2 text-sm font-semibold text-gray-800">{user.firstName || user.name || "User"}</p>
                  <p className="px-2 text-xs text-gray-500">{user.email}</p>
                </div>

                {(user.role === 'FARMER' || user.role === 'Farmer') ? (
                  <>
                    <Link
                      to="/farmer/dashboard"
                      className="py-2 text-harvest-text font-medium flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link
                      to="/farmer/dashboard?view=add-harvest"
                      className="py-2 text-harvest-text font-medium flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard size={18} /> Add Product
                    </Link>
                    <Link
                      to="/orders"
                      className="py-2 text-harvest-text font-medium flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart size={18} /> Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="py-2 text-harvest-text font-medium flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart size={18} /> Wishlist
                    </Link>
                    <Link
                      to="/farmer/dashboard?view=profile"
                      className="py-2 text-harvest-text font-medium flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} /> Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/orders"
                      className="py-2 text-harvest-text font-medium flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart size={18} /> Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="py-2 text-harvest-text font-medium flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart size={18} /> Wishlist
                    </Link>
                    <Link
                      to="/profile"
                      className="py-2 text-harvest-text font-medium flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} /> Profile
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="py-2 text-red-600 font-medium flex items-center gap-2 text-left"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="py-2 text-harvest-text font-medium flex items-center gap-2"
              >
                <User size={18} /> Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
