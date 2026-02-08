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
} from "lucide-react";
import logo from "../../assets/Logo-L_1@0.75x.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

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
    { id: "add-harvest", icon: <Package size={20} />, label: "Add Harvest" },
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

const Overview = ({ user }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl p-8 text-white shadow-lg">
      <h1 className="text-3xl font-bold mb-2">
        Welcome back, {user?.firstName}!
      </h1>
      <p className="text-green-100">
        Manage your harvest, track sales, and update your profile all in one
        place.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
          <Package size={24} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">12</h3>
        <p className="text-gray-500 text-sm">Active Listings</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
          <ShoppingBag size={24} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">24</h3>
        <p className="text-gray-500 text-sm">Orders Completed</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
        <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600">
          <Leaf size={24} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">4.8</h3>
        <p className="text-gray-500 text-sm">Average Rating</p>
      </div>
    </div>
  </div>
);

const AddHarvestView = ({ user }) => {
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
    } catch (error) {
      setMessage("Error creating product. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Plus size={24} className="text-green-600" />
        Add New Harvest
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
                required={!preview}
              />
            </div>
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
                  Price (LKR)
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
                  readOnly // Assumption: Farmer name is auto-filled and read-only usually, but can be editable if needed
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
            className="bg-green-700 text-white py-3 px-8 rounded-lg hover:bg-green-800 transition shadow-lg shadow-green-200 font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing..." : "Publish Product"}
            {!loading && <Leaf size={18} />}
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
  const [currentView, setCurrentView] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const view = searchParams.get("view");
    if (view) {
      setCurrentView(view);
    }
  }, [searchParams]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return <Overview user={user} />;
      case "add-harvest":
        return <AddHarvestView user={user} />;
      case "profile":
        return <ProfileView user={user} />;
      case "change-password":
        return <ChangePasswordView />;
      default:
        return <Overview user={user} />;
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
