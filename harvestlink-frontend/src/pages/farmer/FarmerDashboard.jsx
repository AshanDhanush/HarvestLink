import React, { useState, useEffect, useRef } from "react";
import authService from "../../services/authService";
import productService from "../../services/productService";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  X,
  Plus,
  Edit,
  Upload,
  Phone,
  MapPin,
  Lock,
  Leaf,
  Store,
} from "lucide-react";
import logo from "../../assets/Logo-L_1@0.75x.png";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import orderService from "../../services/orderService";

// --- Colors ---
const colors = {
  primaryDark: "#1a4d2e",
  primaryLime: "#8cc63f",
  bgLight: "#f3f4f6",
};

// --- Sub-Components ---

const Sidebar = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  const navItems = [
    { id: "overview", icon: <LayoutDashboard size={20} />, label: "Overview" },
    { id: "my-products", icon: <ShoppingBag size={20} />, label: "My Products" },
    { id: "add-product", icon: <Plus size={20} />, label: "Add Product" },
    { id: "profile", icon: <User size={20} />, label: "Profile Settings" },
    {
      id: "change-password",
      icon: <Lock size={20} />,
      label: "Change Password",
    },
  ];

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 z-30 h-screen w-64 bg-white text-green-800 
        transform transition-transform duration-300 ease-in-out border-r border-gray-100
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="h-16 flex items-center justify-between px-6 font-bold text-xl border-b border-gray-100">
          <img
            src={logo}
            alt="HarvestLink Logo"
            className="h-8 md:h-10 w-auto object-contain"
          />
          <button
            className="md:hidden text-gray-500"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg duration-200 group font-sans text-left ${
                currentView === item.id
                  ? "font-bold"
                  : "hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium"
              }`}
              style={
                currentView === item.id
                  ? {
                      backgroundColor: colors.primaryLime,
                      color: colors.primaryDark,
                    }
                  : undefined
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-gray-600"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const Header = ({ user, isProfileOpen, setIsProfileOpen, toggleSidebar }) => (
  <header className="h-16 bg-white shadow-sm fixed top-0 right-0 left-0 md:left-64 z-10 flex items-center justify-between px-4 md:px-6 transition-all duration-300">
    <button className="md:hidden text-gray-600 p-2" onClick={toggleSidebar}>
      <Menu size={24} />
    </button>

    <div className="flex items-center gap-6 ml-auto">
      <Link to="/shop" className="hidden md:flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition mr-4">
        <Store size={20} />
        <span>Back to Shop</span>
      </Link>
      <div className="relative">
        <button className="relative p-2 text-gray-600 hover:text-green-800 transition">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>

      <div className="relative">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold border border-green-200">
            {user?.firstName?.[0] || "F"}
          </div>
          <div className="hidden md:block text-sm text-left">
            <p className="font-bold text-gray-700 group-hover:text-green-800 transition">
              {user?.firstName || "Farmer"}
            </p>
            <p className="text-gray-400 text-xs font-medium">Farmer</p>
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition transform ${isProfileOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50 animate-fade-in-down">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-bold text-gray-800">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                authService.logout();
                window.location.href = "/login";
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 mt-1"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  </header>
);

// --- Views ---

const Overview = ({ user, setCurrentView }) => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    rating: 4.8, // Mocked for now
  });
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Products (Critical)
        try {
          const products = await productService.getAllProducts();
          // Filter for current user (Case-insensitive)
          const myProducts = products.filter((p) => {
             const pName = (p.farmerName || "").toLowerCase().trim();
             const uName = (user?.firstName || "").toLowerCase().trim();
             const uEmail = (user?.email || "").toLowerCase().trim();
             return pName === uName || pName === uEmail; 
          });

          setStats(prev => ({ ...prev, products: myProducts.length }));
        } catch (e) {
          console.error("Error fetching products:", e);
        }

        // 2. Fetch Orders
        try {
          const orders = await orderService.getOrders();
          setStats(prev => ({ ...prev, orders: orders.length })); // simplified logic
          setRecentOrders(orders.slice(0, 5));
        } catch (e) {
           console.error("Error fetching orders:", e);
        }

        // 3. Fetch Top Selling
        try {
          const topSelling = await orderService.getTopSellingProducts();
          setTopProducts(topSelling.slice(0, 4));
        } catch (e) {
           console.error("Error fetching top selling:", e);
        }

      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-green-100 max-w-xl">
            Here's what's happening with your harvest today. You have {stats.orders} new orders to process.
          </p>
          <button 
            onClick={() => setCurrentView('add-product')}
            className="mt-6 bg-white text-green-800 px-6 py-2 rounded-lg font-bold hover:bg-green-50 transition shadow-sm flex items-center gap-2"
          >
            <Plus size={18} /> Add New Product
          </button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <Leaf size={200} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Package size={24} />
            </div>
            <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">+2 new</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.products}</h3>
          <p className="text-gray-500 text-sm font-medium">Active Products</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <ShoppingBag size={24} />
            </div>
            <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-bold">12 pending</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.orders}</h3>
          <p className="text-gray-500 text-sm font-medium">Total Orders</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <Leaf size={24} />
            </div>
            <span className="text-gray-400 text-xs">Last 30 days</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats.rating}</h3>
          <p className="text-gray-500 text-sm font-medium">Average Rating</p>
        </div>
        
         <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <ShoppingBag size={24} />
            </div>
             <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs font-bold">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">LKR {stats.revenue}</h3>
          <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
            <button className="text-green-700 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id || Math.random()} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">#{order.id ? order.id.substring(0, 6) : '---'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customerName || "Customer"}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                          {order.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800 text-right">
                        LKR {order.totalAmount || "0.00"}
                      </td>
                    </tr>
                  ))
                ) : (
                   <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-sm">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Top Selling Products</h3>
            <button className="text-green-700 text-sm font-bold hover:underline">View Reports</button>
          </div>
           <div className="p-6 space-y-6">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {/* Placeholder for product image if available in DTO */}
                    <div className="h-full w-full bg-green-100 flex items-center justify-center text-green-600">
                      <Package size={24} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{product.productName}</h4>
                    <p className="text-sm text-gray-500">{product.category || "Category"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">LKR {product.price} / Kg</p>
                    <p className="text-xs text-green-600 font-bold">{product.totalSold} sold</p>
                  </div>
                </div>
              ))
            ) : (
               <div className="text-center text-gray-500 py-8">No top products data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MyProductsView = ({ user, onEdit, onViewChange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAllProducts();
        // Filter for current user (Frontend filtering)
        const myProducts = allProducts.filter((p) => {
             const pName = (p.farmerName || "").toLowerCase().trim();
             const uName = (user?.firstName || "").toLowerCase().trim();
             const uEmail = (user?.email || "").toLowerCase().trim();
             return pName === uName || pName === uEmail; 
        });
      setProducts(myProducts);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        alert("Product deleted successfully.");
      } catch (error) {
        console.error("Error deleting product", error);
        alert("Failed to delete product.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBag size={24} className="text-green-600" />
          My Products
        </h2>
        <button
          onClick={() => onViewChange("add-product")}
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition font-bold flex items-center gap-2"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Price (per Kg)</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                 <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading products...</td></tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">
                      {product.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                           {/* Placeholder image logic */}
                           <Package size={20} />
                        </div>
                        <span className="font-bold text-gray-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 bg-opacity-50">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">
                      LKR {product.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.quantity} Kg
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Package size={48} className="text-gray-300" />
                      <p>You haven't added any products yet.</p>
                      <button 
                        onClick={() => onViewChange("add-product")}
                        className="text-green-700 font-bold hover:underline"
                      >
                        Add your first product
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AddProductView = ({ user, productToEdit, onProductSaved }) => {
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    farmerName: user?.firstName || "",
    location: user?.address || "",
    description: "",
    price: "",
    quantity: "",
    expiryDate: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (productToEdit) {
      setProductData({
        name: productToEdit.name || "",
        category: productToEdit.category || "",
        farmerName: productToEdit.farmerName || user?.firstName || "",
        location: productToEdit.location || user?.address || "",
        description: productToEdit.description || "",
        price: productToEdit.price || "",
        quantity: productToEdit.quantity || "",
        expiryDate: productToEdit.expiryDate ? new Date(productToEdit.expiryDate).toISOString().split('T')[0] : "",
      });
      // Handle image preview if URL exists (assuming backend might return image URL or base64)
      // For now, we reset image/preview unless we have a clear way to show existing image
    }
  }, [productToEdit, user]);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (productToEdit) {
        // Update logic
        await productService.updateProduct(productToEdit.id, productData);
        setMessage("Product updated successfully!");
        onProductSaved(); 
      } else {
        // Create logic
        await productService.createProduct(productData, image);
        setMessage("Product created successfully!");
        setProductData({
          name: "",
          category: "",
          farmerName: user?.firstName || "",
          location: user?.address || "",
          description: "",
          price: "",
          quantity: "",
          expiryDate: "",
        });
        setImage(null);
        setPreview(null);
      }
    } catch (error) {
      setMessage(`Error ${productToEdit ? "updating" : "creating"} product. Please try again.`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        {productToEdit ? <Edit size={24} className="text-blue-600" /> : <Plus size={24} className="text-green-600" />}
        {productToEdit ? "Edit Product" : "Add New Harvest"}
      </h2>

      {message && (
        <div
          className={`p-4 mb-6 rounded-xl flex items-center gap-3 ${message.includes("Error") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}
        >
          <div
            className={`h-6 w-6 rounded-full flex items-center justify-center ${message.includes("Error") ? "bg-red-200" : "bg-green-200"}`}
          >
            {message.includes("Error") ? <X size={14} /> : <Leaf size={14} />}
          </div>
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image Upload */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Product Image
            </label>
            <div
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition overflow-hidden relative group"
              onClick={handleImageClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleImageClick();
                }
              }}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <p className="text-white font-bold text-sm flex items-center gap-2">
                      <Edit size={16} /> Change Image
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                    <Upload size={24} />
                  </div>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-bold text-green-600">
                      Click to upload
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    SVG, PNG, JPG (Max 2MB)
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
                required={!preview && !productToEdit} // Not required if editing (might keep old image)
              />
            </div>
            {productToEdit && !preview && (
                 <p className="text-xs text-gray-500 mt-2 text-center">Leave empty to keep existing image</p>
            )}
          </div>

          {/* Right Column: Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleChange}
                  placeholder="e.g. Fresh Carrots"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Price (LKR per Kg)
                </label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Quantity (Kg)
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={productData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Farmer Name
                </label>
                <input
                  type="text"
                  name="farmerName"
                  value={productData.farmerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
                  readOnly 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    type="text"
                    name="location"
                    value={productData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={productData.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your product details..."
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium resize-none"
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`text-white py-3 px-8 rounded-lg transition shadow-lg font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${productToEdit ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-green-700 hover:bg-green-800 shadow-green-200'}`}
          >
            {loading ? "Saving..." : (productToEdit ? "Update Product" : "Publish Product")}
            {!loading && (productToEdit ? <Edit size={18} /> : <Leaf size={18} />)}
          </button>
        </div>
      </form>
    </div>
  );
};

const ProfileView = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    contactNo: user?.contactNo || "",
    address: user?.address || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  // Placeholder for save logic
  const handleSave = (e) => {
    e.preventDefault();
    // Simulate API call
    console.log("Saving profile", formData);
    setIsEditing(false);
    alert("Profile updated successfully! (Mock)");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <User size={24} className="text-green-600" />
          My Profile
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-bold text-sm hover:bg-green-100 transition flex items-center gap-2"
          >
            <Edit size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-green-50 flex items-center gap-6">
          <div className="h-24 w-24 bg-white rounded-full border-4 border-white shadow-sm flex items-center justify-center text-3xl font-bold text-green-700">
            {user?.firstName?.[0] || "U"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-gray-500 font-medium">
              {user?.role || "Farmer"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 disabled:text-gray-500 disabled:bg-gray-50 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 disabled:text-gray-500 disabled:bg-gray-50 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled // Email is usually immutable or requires special verification
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Contact Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  type="text"
                  value={formData.contactNo}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNo: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 disabled:text-gray-500 disabled:bg-gray-50 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 disabled:text-gray-500 disabled:bg-gray-50 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-green-700 text-white font-bold hover:bg-green-800 transition shadow-lg shadow-green-200"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const ChangePasswordView = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    // API call logic here
    alert("Password change functionality simulated.");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Lock size={24} className="text-green-600" />
        Change Password
      </h2>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:bg-white focus:ring-0 transition font-medium"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 transition shadow-lg shadow-green-200"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Layout ---
const FarmerDashboard = () => {
  const [searchParams] = useSearchParams();
  const viewParam = searchParams.get("view");

  useEffect(() => {
    if (viewParam) {
      setCurrentView(viewParam);
    }
  }, [viewParam]);
  const [currentView, setCurrentView] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const view = searchParams.get("view");
    if (view) {
      setCurrentView(view);
      // Clear editing state when view changes from URL
      if (view !== 'add-product') {
        setEditingProduct(null);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setCurrentView('add-product');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'add-product') {
        setEditingProduct(null); // Clear editing if manually adding new
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return <Overview user={user} setCurrentView={handleViewChange} />;
      case "my-products":
        return <MyProductsView user={user} onEdit={handleEditProduct} onViewChange={handleViewChange} />;
      case "add-product":
        return <AddProductView user={user} productToEdit={editingProduct} onProductSaved={() => setCurrentView('my-products')} />;
      case "profile":
        return <ProfileView user={user} />;
      case "change-password":
        return <ChangePasswordView />;
      default:
        return <Overview user={user} setCurrentView={handleViewChange} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 md:ml-64 flex flex-col transition-all duration-300">
        <Header
          user={user}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 p-6 mt-16 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboard;
