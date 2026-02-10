
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import axios from 'axios';
import authService from "../../services/authService";
import productService from "../../services/productService";
import orderService from "../../services/orderService";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Leaf,
  // New Icons for CRUD
  Plus,
  Edit,
  Trash2,
  X,
  MapPin,
  Phone,
  Sprout // Added for logo placeholder
} from "lucide-react";
import logo from "../../assets/Logo-L_1@0.75x.png";

// --- Colors ---
const colors = {
  primaryDark: "#1a4d2e",
  primaryLime: "#8cc63f",
  bgLight: "#f3f4f6",
};

// Helpers for farmer ID generation: F001, F002, ...
const formatFarmerId = (num) => `F${String(num).padStart(3, '0')}`;
const getNextFarmerNumber = (farmers) => {
  let max = 0;
  for (const f of farmers) {
    if (!f || f.id == null) continue;
    const id = String(f.id);
    if (id.startsWith('F')) {
      const n = parseInt(id.slice(1), 10);
      if (!Number.isNaN(n) && n > max) max = n;
    } else {
      const n = parseInt(id, 10);
      if (!Number.isNaN(n) && n > max) max = n;
    }
  }
  return max + 1;
};

const displayFarmerId = (id) => {
  if (!id && id !== 0) return '';
  const s = String(id);
  if (s.startsWith('F')) {
    const num = parseInt(s.slice(1), 10);
    if (Number.isNaN(num)) return s;
    return `F${String(num).padStart(3, '0')}`;
  }
  const n = parseInt(s, 10);
  if (!Number.isNaN(n)) return `F${String(n).padStart(3, '0')}`;
  return s;
};

// --- Business ID helpers (B001, B002, ...)
const formatBusinessId = (num) => `B${String(num).padStart(3, '0')}`;
const getNextBusinessNumber = (businesses) => {
  let max = 0;
  for (const b of businesses) {
    if (!b || b.id == null) continue;
    const id = String(b.id);
    if (id.startsWith('B')) {
      const n = parseInt(id.slice(1), 10);
      if (!Number.isNaN(n) && n > max) max = n;
    } else {
      const n = parseInt(id, 10);
      if (!Number.isNaN(n) && n > max) max = n;
    }
  }
  return max + 1;
};

const displayBusinessId = (id) => {
  if (!id && id !== 0) return '';
  const s = String(id);
  if (s.startsWith('B')) {
    const num = parseInt(s.slice(1), 10);
    if (Number.isNaN(num)) return s;
    return `B${String(num).padStart(3, '0')}`;
  }
  const n = parseInt(s, 10);
  if (!Number.isNaN(n)) return `B${String(n).padStart(3, '0')}`;
  return s;
};

// No mock data - all data will be fetched from APIs





const initialFarmersData = [];
// --- MOCK DATA (Businesses CRUD Backend Simulation) ---
const initialBusinessesData = [];

// === Components ===

// 1. Sidebar Component
const Sidebar = ({ currentView, setCurrentView, onLogout }) => {
  const navItems = [
    { id: "overview", icon: <LayoutDashboard size={20} />, label: "Overview" },
    { id: "farmers", icon: <Users size={20} />, label: "Farmers" },
    { id: "businesses", icon: <Users size={20} />, label: "Businesses" },
    { id: "products", icon: <Package size={20} />, label: "Products" },
    { id: "orders", icon: <ShoppingBag size={20} />, label: "Orders" },
    { id: "settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <aside className={`w-64 bg-white text-green-800 flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300 font-sans`}>
     
      <div className="h-16 flex items-center px-6 font-bold text-xl border-b border-[#ffffff20]">
        <img
          src={logo}
          alt="HarvestLink Logo"
          className="h-10 md:h-14 w-auto object-contain"
        />
      </div>
      

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg duration-200 group font-sans text-left ${
              currentView === item.id
                ? 'font-bold'
                : 'hover:bg-green-400 text-gray-700 hover:text-green-700 font-medium'
            }`}
            style={
              currentView === item.id
                ? { backgroundColor: colors.primaryLime, color: colors.primaryDark }
                : undefined
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#ffffff20]">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-green-400 hover:text-green-700 transition-colors font-medium"
          style={{ color: colors.primaryDark }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};


// Toast Notification Component
const ToastNotification = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification || !isVisible) return null;

  return (
    <div className={`fixed top-6 right-6 p-4 rounded-lg shadow-lg border-l-4 font-sans z-[100] animate-fade-in ${
      notification.type === 'success'
        ? 'bg-green-50 border-green-500 text-green-800'
        : 'bg-blue-50 border-blue-500 text-blue-800'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
        }`}>
          <span className="text-white text-sm font-bold">✓</span>
        </div>
        <span className="font-medium text-sm">{notification.message}</span>
      </div>
    </div>
  );
};

const NotificationPanel = ({ isOpen, notifications, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute right-6 top-16 w-80 bg-white rounded-xl shadow-lg border border-gray-100 max-h-96 overflow-y-auto z-50">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Notifications</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          <p>No notifications yet</p>
        </div>
      ) : (
        <div>
          {notifications.map((notif, idx) => (
            <div key={idx} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = ({ admin = {}, isProfileOpen, setIsProfileOpen, isNotificationPanelOpen, setIsNotificationPanelOpen, notifications, notificationCount, onLogout }) => (
  <header className="h-16 bg-white shadow-sm fixed top-0 right-0 left-64 z-10 flex items-center justify-end px-6 transition-all duration-300 font-sans">
    <div className="flex items-center gap-6">
      <div className="relative">
        <button
          onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
          className="cursor-pointer relative group"
        >
          <Bell size={20} className="text-gray-600 hover:text-emerald-800 transition" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold">
              {notificationCount}
            </span>
          )}
        </button>
        <NotificationPanel
          isOpen={isNotificationPanelOpen}
          notifications={notifications}
          onClose={() => setIsNotificationPanelOpen(false)}
        />
      </div>

      <div className="relative">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <img
            src="https://i.pravatar.cc/150?img=68"
            alt="Admin Profile"
            className={`h-9 w-9 rounded-full border-2 border-gray-200 group-hover:border-lime-400 transition`}
          />
          <div className="hidden md:block text-sm text-left font-sans">
            <p className="font-bold text-gray-700 group-hover:text-emerald-800">
              {admin.name || 'Admin User'}
            </p>
            <p className="text-gray-400 text-xs font-medium">{admin.role || 'Super Admin'}</p>
          </div>
          <ChevronDown size={16} className={`text-gray-400 group-hover:text-emerald-800 transition transform ${isProfileOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* Profile Dropdown */}
        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-50">
            {/* Profile Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <img
                src="https://i.pravatar.cc/150?img=68"
                alt="Admin Profile"
                className="h-14 w-14 rounded-full border-2 border-gray-200"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{admin.name || 'Admin User'}</p>
                <p className="text-gray-500 text-xs mb-1">{admin.email || 'admin@harvestlink.com'}</p>
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-3">
              <button 
                onClick={onLogout}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </header>
);

// 3. Stats Card Component
const StatsCard = ({ item }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden font-sans">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{item.title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-lime-100`} style={{ color: colors.primaryDark }}>
        {item.icon}
      </div>
    </div>
    <div className={`flex items-center text-sm font-bold ${item.isPositive ? "text-green-500" : "text-red-500"}`}>
      {item.isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
      <span>{item.change}</span>
      <span className="text-gray-400 ml-2 font-medium">vs last month</span>
    </div>
  </div>
);

// 4. Recent Orders Table
const RecentOrdersTable = ({ orders = [], onViewAll }) => {
  const displayOrders = orders && orders.length > 0 ? orders.slice(0, 5) : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-sans">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
        <button onClick={() => onViewAll?.()} className={`text-sm text-emerald-800 font-bold hover:underline`}>
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-bold">Order ID</th>
              <th className="px-6 py-4 font-bold">Customer</th>
              <th className="px-6 py-4 font-bold">Items</th>
              <th className="px-6 py-4 font-bold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayOrders.map((order) => {
              const itemsDisplay = order.productNames && order.productNames.length > 0
                ? order.productNames.map((name, i) => `${name} (${order.quantity?.[i] || 0})`).join(", ")
                : order.items || "-";
              
              return (
                <tr key={order.disID || order.id} className="hover:bg-gray-50 transition font-medium">
                  <td className="px-6 py-4 text-gray-800">{order.disID || order.id || "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{order.customerName || order.customer || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{itemsDisplay}</td>
                  <td className="px-6 py-4 text-gray-800">LKR {order.totalPrice || order.total || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 5. Top Products Widget
const TopProductsWidget = ({ products = [] }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 font-sans">
    <h2 className="text-lg font-bold text-gray-800 mb-4">Top Selling Produce</h2>
    <div className="space-y-4">
      {products && products.length > 0 ? (
        products.map((product, i) => (
          <div key={product.productId || i} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Leaf size={18} className={`text-emerald-800`} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{product.productName || product.name || 'Unknown Product'}</p>
                <p className="text-xs text-gray-400 font-medium">{product.totalSold} sold</p>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-green-500" />
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No products available</p>
      )}
    </div>
  </div>
);

// 6. Farmer Modal (Fixed for No-useEffect Error)
const FarmerModal = ({ isOpen, onClose, onSave, editingFarmer }) => {
  const [formData, setFormData] = useState(
    editingFarmer || {
      firstName: "",
      lastName: "",
      email: "",
      contactNo: "",
      address: "",
      role: "FARMER",
      password: "",
      confirmPassword: "",
    }
  );

  useEffect(() => {
    Promise.resolve().then(() => {
      setFormData(editingFarmer || { firstName: "", lastName: "", email: "", contactNo: "", address: "", role: "FARMER", password: "", confirmPassword: "" });
    });
  }, [editingFarmer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || (!formData.email && !formData.contactNo)) {
      alert("First name and either email or contact number are required!");
      return;
    }

    // When creating a new farmer, password is required and must match
    if (!editingFarmer) {
      if (!formData.password) {
        alert('Password is required when creating a new farmer');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert('Password and Confirm Password do not match');
        return;
      }
    } else {
      // when editing, require both password and confirmPassword and ensure they match
      if (!formData.password || !formData.confirmPassword) {
        alert('Password and Confirm Password are required when editing a farmer');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert('Password and Confirm Password do not match');
        return;
      }
    }

    const payload = { ...formData };
    // ensure role is fixed to uppercase FARMER and remove any status field
    payload.role = 'FARMER';
    if (payload.status) delete payload.status;
    // only send password if provided
    if (!payload.password) delete payload.password;
    delete payload.confirmPassword;

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-50 flex justify-center items-center font-sans">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100" style={{ backgroundColor: colors.bgLight }}>
          <h3 className="text-lg font-bold text-gray-800">{editingFarmer ? "Edit Farmer" : "Add New Farmer"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                placeholder="e.g., Sunil"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                placeholder="e.g., Perera"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                placeholder="example@domain.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                  placeholder="07X-XXXXXXX"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                placeholder="e.g., Dambulla"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role || 'Farmer'}
                readOnly
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold transition">
              Cancel
            </button>
            <button type="submit" className={`px-6 py-2 rounded-lg text-white hover:bg-opacity-90 font-bold transition flex items-center gap-2`} style={{ backgroundColor: colors.primaryDark }}>
              {editingFarmer ? <Edit size={18} /> : <Plus size={18} />}
              {editingFarmer ? "Update Farmer" : "Save Farmer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 6b. Business Modal (match Farmer form)
const BusinessModal = ({ isOpen, onClose, onSave, editingBusiness }) => {
  const [formData, setFormData] = useState(
    editingBusiness || {
      firstName: "",
      lastName: "",
      email: "",
      contactNo: "",
      address: "",
      role: "Buyer",
      password: "",
      confirmPassword: "",
    }
  );

  useEffect(() => {
    Promise.resolve().then(() => {
      setFormData(
        editingBusiness || {
          firstName: "",
          lastName: "",
          email: "",
          contactNo: "",
          address: "",
          role: "Buyer",
          password: "",
          confirmPassword: "",
        }
      );
    });
  }, [editingBusiness]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || (!formData.email && !formData.contactNo)) {
      alert("First name and either email or contact number are required!");
      return;
    }

    if (!editingBusiness) {
      if (!formData.password) {
        alert('Password is required when creating a new business');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert('Password and Confirm Password do not match');
        return;
      }
    } else {
      if (formData.password && formData.password !== formData.confirmPassword) {
        alert('Password and Confirm Password do not match');
        return;
      }
    }

    const payload = { ...formData };
    payload.role = String(formData.role || 'BUYER').toUpperCase();
    if (!payload.password) delete payload.password;
    delete payload.confirmPassword;

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-50 flex justify-center items-center font-sans">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100" style={{ backgroundColor: colors.bgLight }}>
          <h3 className="text-lg font-bold text-gray-800">{editingBusiness ? "Edit Business" : "Add New Business"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                placeholder="e.g., John"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                placeholder="e.g., Smith"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                placeholder="example@domain.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                  placeholder="07X-XXXXXXX"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-lime-400 focus:bg-white focus:ring-0 transition font-medium"
                placeholder="e.g., Colombo"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role || 'BUYER'}
                readOnly
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold transition">
              Cancel
            </button>
            <button type="submit" className={`px-6 py-2 rounded-lg text-white hover:bg-opacity-90 font-bold transition flex items-center gap-2`} style={{ backgroundColor: colors.primaryDark }}>
              {editingBusiness ? <Edit size={18} /> : <Plus size={18} />}
              {editingBusiness ? "Update Business" : "Save Business"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 7. Farmers CRUD Section
const FarmersCRUDSection = ({ farmers, onAddClick, onEditClick, onDeleteClick }) => {
 

  

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Farmers Management</h1>
          <p className="text-gray-500 text-sm font-medium">Manage your farmer network, add new profiles, or update existing ones.</p>
        </div>
        <button onClick={onAddClick} className={`flex items-center gap-2 text-white px-5 py-3 rounded-lg hover:bg-opacity-90 transition font-bold shadow-sm`} style={{ backgroundColor: colors.primaryDark }}>
          <Plus size={20} />
          <span>Add New Farmer</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Contact</th>
                <th className="px-6 py-4 font-bold">Address</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {farmers.length > 0 ? (
                farmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-gray-50 transition font-medium">
                    <td className="px-6 py-4 text-gray-600">#{displayFarmerId(farmer.id)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full bg-lime-200 flex items-center justify-center font-bold`} style={{ color: colors.primaryDark }}>
                          {farmer.firstName ? farmer.firstName.charAt(0) : 'F'}
                        </div>
                        <span className="text-gray-800 font-bold">{`${farmer.firstName || ''} ${farmer.lastName || ''}`.trim()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{farmer.email || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{farmer.contactNo || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        {farmer.address || '-'}
                      </div>
                    </td>
                        <td className="px-6 py-4 text-gray-600">{farmer.role ? String(farmer.role).toUpperCase() : 'FARMER'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onEditClick(farmer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => onDeleteClick(farmer.email)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500 font-medium">
                    No farmers found. Click "Add New Farmer" to start.
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

// 8. Businesses CRUD Section
const BusinessesCRUDSection = ({ businesses, onAddClick, onEditClick, onDeleteClick }) => {
  

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Businesses Management</h1>
          <p className="text-gray-500 text-sm font-medium">Manage registered businesses and partners.</p>
        </div>
        <button onClick={onAddClick} className={`flex items-center gap-2 text-white px-5 py-3 rounded-lg hover:bg-opacity-90 transition font-bold shadow-sm`} style={{ backgroundColor: colors.primaryDark }}>
          <Plus size={20} />
          <span>Add New Business</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Contact</th>
                <th className="px-6 py-4 font-bold">Address</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {businesses.length > 0 ? (
                businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition font-medium">
                    <td className="px-6 py-4 text-gray-600">#{b.id}</td>
                    <td className="px-6 py-4 text-gray-800 font-bold">{`${b.firstName || ''} ${b.lastName || ''}`.trim()}</td>
                    <td className="px-6 py-4 text-gray-600">{b.email}</td>
                    <td className="px-6 py-4 text-gray-600">{b.contactNo}</td>
                    <td className="px-6 py-4 text-gray-600">{b.address}</td>
                    <td className="px-6 py-4 text-gray-600">{b.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onEditClick(b)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => onDeleteClick(b.email)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 font-medium">
                    No businesses found. Click "Add New Business" to start.
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

// 9. Products CRUD Section
const ProductsCRUDSection = ({ products, onAddClick, onEditClick, onDeleteClick }) => {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
          <p className="text-gray-500 text-sm font-medium">Manage all agricultural products in the system.</p>
        </div>
        <button onClick={onAddClick} className={`flex items-center gap-2 text-white px-5 py-3 rounded-lg hover:bg-opacity-90 transition font-bold shadow-sm`} style={{ backgroundColor: colors.primaryDark }}>
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">Product Name</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Price</th>
                <th className="px-6 py-4 font-bold">Stock</th>
                <th className="px-6 py-4 font-bold">Farmer</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition font-medium">
                    <td className="px-6 py-4 text-gray-600">#{product.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full bg-lime-200 flex items-center justify-center font-bold`} style={{ color: colors.primaryDark }}>
                          {(product.name || product.productName || 'P').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-800 font-bold">{product.name || product.productName || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.category || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">Rs. {product.price || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{product.quantity || '0'} kg</td>
                    <td className="px-6 py-4 text-gray-600">{product.farmerName || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onEditClick(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => onDeleteClick(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500 font-medium">
                    No products found. Click "Add New Product" to start.
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

// 10. Orders CRUD Section
const OrdersCRUDSection = ({ orders = [] }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
      case "Delivered": return "bg-green-100 text-green-700";
      case "PENDING":
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "PROCESSING":
      case "Processing": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
          <p className="text-gray-500 text-sm font-medium">View and manage all customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Products</th>
                <th className="px-6 py-4 font-bold">Quantity</th>
                <th className="px-6 py-4 font-bold">Total Price</th>
                <th className="px-6 py-4 font-bold">Delivery Fee</th>
                <th className="px-6 py-4 font-bold">Delivery Address</th>
                <th className="px-6 py-4 font-bold">Order Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.disID || order.id} className="hover:bg-gray-50 transition font-medium">
                    <td className="px-6 py-4 text-gray-600">#{order.disID}</td>
                    <td className="px-6 py-4 text-gray-600">{order.customerName|| order.customer}</td>
                    <td className="px-6 py-4 text-gray-800 max-w-xs">
                      <div className="font-bold">{order.productNames?.join(", ") || "-"}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.quantity?.map((q) => `${q} unit`).join(", ") || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-bold">LKR {order.totalPrice || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">LKR {order.deliveryFees || "-"}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                        {order.deliveryAddress || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order.date || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status || "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500 font-medium">
                    No orders found.
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

// 15. Settings Component
const SettingsView = ({ admin, setAdmin }) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [savingMessage, setSavingMessage] = React.useState('');

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setSavingMessage('');

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const payload = {
        name: admin.name,
        email: admin.email,
        role: 'ADMIN',
      };

      const res = await fetch('http://localhost:8085/api/v1/admin/user/update', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      setSavingMessage('Profile updated successfully!');
      console.log('Profile Update Response:', data);
      
      setTimeout(() => setSavingMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setSavingMessage(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
        
        <div className="max-w-2xl space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <img
              src="https://i.pravatar.cc/150?img=68"
              alt="Profile"
              className="h-20 w-20 rounded-full border-2 border-gray-200"
            />
            <div>
              <button className="px-4 py-2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition font-medium text-sm">
                Change Avatar
              </button>
              <p className="text-gray-500 text-xs mt-2">Recommended size: 200x200px</p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Personal Information */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Full Name</label>
            <input
              type="text"
              value={admin.name || ''}
              onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-800"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Email Address</label>
            <input
              type="email"
              value={admin.email || ''}
              onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-800"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Role</label>
            <input
              type="text"
              value={admin.role || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <p className="text-gray-500 text-xs mt-2">Your role cannot be changed</p>
          </div>

          <hr className="border-gray-100" />

          {/* Save Status Message */}
          {savingMessage && (
            <div className={`p-3 rounded-lg ${savingMessage.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {savingMessage}
            </div>
          )}

          {/* Save Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-6 py-2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Layout Structure ---
export default function AdminDashboard() {
  const navigate = useNavigate(); // Hook for navigation
  const [currentView, setCurrentView] = useState("overview");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [admin, setAdmin] = useState({
    name: 'Admin User',
    role: 'Super Admin',
    email: 'admin@harvestlink.com'
  });

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // === CRUD State Management ===
  const [farmers, setFarmers] = useState(initialFarmersData);
  const [loadingFarmers, setLoadingFarmers] = useState(false);
  const [farmersError, setFarmersError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState(null);
  // Businesses state
  const [businesses, setBusinesses] = useState(initialBusinessesData);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [businessesError, setBusinessesError] = useState(null);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  // Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  // Revenue state
  const [revenueData, setRevenueData] = useState({
    currentMonthTotal: 450000,
    lastMonthTotal: 400000,
    percentageChange: 12.5,
  });
  // Total Farmers state
  const [totalFarmersData, setTotalFarmersData] = useState({
    TotalFarmers: 124,
    percentageChangeAccordingToMonth: 4.3,
  });
  // Total Businesses state
  const [totalBusinessesData, setTotalBusinessesData] = useState({
    TotalBusinesses: 58,
    percentageChangeAccordingToMonth: 2.1,
  });
  // Pending Orders state
  const [pendingOrdersData, setPendingOrdersData] = useState({
    PendingOrders: 32,
    percentageChangeAccordingToMonth: -5.0,
  });
  // Top Selling Products state
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  // Notification state
  const [notification, setNotification] = useState(null);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  // Previous values for change detection
  const [previousFarmersCount, setPreviousFarmersCount] = useState(124);
  const [previousBusinessesCount, setPreviousBusinessesCount] = useState(58);

  // Fetch farmers from backend on mount
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8085';
    let mounted = true;

    (async () => {
      // defer setState to avoid sync setState-in-effect lint
      await Promise.resolve();
      if (!mounted) return;
      setLoadingFarmers(true);
      setFarmersError(null);

      try {
        // get token from storage if available
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API_BASE}/api/v1/admin/get/farmers`, {
          method: 'GET',
          headers,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setFarmers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch farmers:', err);
        if (mounted) setFarmersError(err.message || 'Failed to load farmers');
      } finally {
        if (mounted) setLoadingFarmers(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Fetch businesses from backend on mount
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8085';
    let mounted = true;

    (async () => {
      await Promise.resolve();
      if (!mounted) return;
      setLoadingBusinesses(true);
      setBusinessesError(null);

      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API_BASE}/api/v1/admin/get/businesses`, {
          method: 'GET',
          headers,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setBusinesses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch businesses:', err);
        if (mounted) setBusinessesError(err.message || 'Failed to load businesses');
      } finally {
        if (mounted) setLoadingBusinesses(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Fetch products from backend on mount
  // Fetch products from backend on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      await Promise.resolve();
      if (!mounted) return;
      setLoadingProducts(true);
      setProductsError(null);

      try {
        const data = await productService.getAllProducts();
        if (mounted) setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        if (mounted) setProductsError(err.message || 'Failed to load products');
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Fetch orders from backend on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      await Promise.resolve();
      if (!mounted) return;
      setLoadingOrders(true);
      setOrdersError(null);

      try {
        const resData = await orderService.getOrders();
        const raw = Array.isArray(resData) ? resData : [];
        const normalized = raw.map((o) => {
          const customerName = o.customerName
            || o.customer
            || (o.customer && (o.customer.name || o.customer.fullName || o.customer.businessName))
            || o.user?.name
            || o.buyerName
            || ((o.customerFirstName || o.customerLastName) ? `${o.customerFirstName || ''} ${o.customerLastName || ''}`.trim() : undefined)
            || "N/A";

          return { ...o, customerName };
        });
        if (mounted) setOrders(normalized);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        if (mounted) setOrdersError(err.response?.data?.message || err.message || 'Failed to load orders');
      } finally {
        if (mounted) setLoadingOrders(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Fetch revenue data from backend
  useEffect(() => {
    let mounted = true;

    (async () => {
      await Promise.resolve();
      if (!mounted) return;

      try {
        const data = await orderService.getMonthlyRevenue();
        if (mounted && data) {
          setRevenueData(data);
        }
      } catch (err) {
        console.error('Failed to fetch revenue data:', err);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Fetch total farmers data - called on mount and via polling
  const fetchTotalFarmers = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('http://localhost:8085/api/v1/admin/get/farmers/total', {
        method: 'GET',
        headers,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data) {
        setTotalFarmersData({
          TotalFarmers: data.TotalFarmers ,
          percentageChangeAccordingToMonth: data.percentageChangeAccordingToMonth ,
        });
      }
    } catch (err) {
      console.error('Failed to fetch total farmers data:', err);
    }
  };

  // Fetch total businesses data - called on mount and via polling
  const fetchTotalBusinesses = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('http://localhost:8085/api/v1/admin/get/business/total', {
        method: 'GET',
        headers,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data) {
        setTotalBusinessesData({
          TotalBusinesses: data.TotalBuyers || data.TotalBusinesses || 58,
          percentageChangeAccordingToMonth: data.percentageChangeAccordingToMonth,
        });
      }
    } catch (err) {
      console.error('Failed to fetch total businesses data:', err);
    }
  };

  // Fetch total farmers data from backend on mount and poll every 3 seconds
  useEffect(() => {
    fetchTotalFarmers(); // Fetch on mount
    const interval = setInterval(fetchTotalFarmers, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch total businesses data from backend on mount and poll every 3 seconds
  useEffect(() => {
    fetchTotalBusinesses(); // Fetch on mount
    const interval = setInterval(fetchTotalBusinesses, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch pending orders data from backend on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      await Promise.resolve();
      if (!mounted) return;

      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        // Updated port from 8085 to 8080 to use User Service directly
        const res = await fetch('http://localhost:8080/api/v1/admin/get/orders/pending', {
          method: 'GET',
          headers,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log('Pending Orders API Response:', data);
        if (mounted && data) {
          setPendingOrdersData({
            PendingOrders: data.PendingOrders || 32,
            percentageChangeAccordingToMonth: data.percentageChangeAccordingToMonth || -5.0,
          });
        }
      } catch (err) {
        console.error('Failed to fetch pending orders data:', err);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Fetch top selling products from backend on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      await Promise.resolve();
      if (!mounted) return;

      try {
        const data = await orderService.getTopSellingProducts();
        
        if (mounted) {
          let productsArray = [];
          
          // Handle if response is a direct array
          if (Array.isArray(data)) {
            productsArray = data;
          }
          // Handle if response is an object with products/data property
          else if (data && typeof data === 'object') {
            if (Array.isArray(data.products)) {
              productsArray = data.products;
            } else if (Array.isArray(data.data)) {
              productsArray = data.data;
            } else if (Array.isArray(data.topSellingProducts)) {
              productsArray = data.topSellingProducts;
            }
          }
          
          setTopSellingProducts(productsArray);
        }
      } catch (err) {
        console.error('Failed to fetch top selling products:', err);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Track farmers count increase
  useEffect(() => {
    if (totalFarmersData) {
      const currentCount = totalFarmersData.TotalFarmers || 0;
      console.log('Farmers Check:', { currentCount, previousFarmersCount, shouldNotify: currentCount > previousFarmersCount });
      if (currentCount > previousFarmersCount && previousFarmersCount > 0) {
        console.log('Showing farmer notification');
        const message = `New farmer is added! Total farmers: ${currentCount}`;
        setNotification({
          type: 'success',
          message: message,
        });
        // Add to notifications array
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        setNotifications(prev => [{ message, time: timeStr }, ...prev]);
        setPreviousFarmersCount(currentCount);
      } else if (previousFarmersCount === 124 && currentCount !== 124) {
        // First load, just update the count without showing notification
        setPreviousFarmersCount(currentCount);
      }
    }
  }, [totalFarmersData?.TotalFarmers, previousFarmersCount]);

  // Track businesses count increase
  useEffect(() => {
    if (totalBusinessesData) {
      const currentCount = totalBusinessesData.TotalBusinesses || 0;
      console.log('Businesses Check:', { currentCount, previousBusinessesCount, shouldNotify: currentCount > previousBusinessesCount });
      if (currentCount > previousBusinessesCount && previousBusinessesCount > 0) {
        console.log('Showing business notification');
        const message = `New buyer is added! Total buyers: ${currentCount}`;
        setNotification({
          type: 'success',
          message: message,
        });
        // Add to notifications array
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        setNotifications(prev => [{ message, time: timeStr }, ...prev]);
        setPreviousBusinessesCount(currentCount);
      } else if (previousBusinessesCount === 58 && currentCount !== 58) {
        // First load, just update the count without showing notification
        setPreviousBusinessesCount(currentCount);
      }
    }
  }, [totalBusinessesData?.TotalBusinesses, previousBusinessesCount]);

  // === CRUD Handlers ===
  const handleDeleteClick = async (email) => {
    if (!email) return alert('No farmer identifier provided');
    if (!window.confirm("Are you sure you want to delete this farmer?")) return;

    try {
      // call backend to delete farmer (email used as identifier)
      const encoded = encodeURIComponent(email);
      const res = await api.delete(`/admin/user/delete/${encoded}`);

      // remove from local state on success
      setFarmers((prev) => prev.filter((farmer) => farmer.email !== email));

      const msg = res?.data || 'Farmer deleted successfully';
      alert(msg);
    } catch (err) {
      console.error('Failed to delete farmer:', err);
      alert('Delete failed: ' + (err.response?.data || err.message));
    }
  };


  const handleBusinessDelete = async (email) => {
    if (!email) return alert('No farmer identifier provided');
    if (!window.confirm("Are you sure you want to delete this farmer?")) return;

    try {
      // call backend to delete buyers (email used as identifier)
      const encoded = encodeURIComponent(email);
      const res = await api.delete(`/admin/user/delete/${encoded}`);

      // remove from local state on success
      setBusinesses((prev) => prev.filter((business) => business.email !== email));

      const msg = res?.data || 'Business deleted successfully';
      alert(msg);
    } catch (err) {
      console.error('Failed to delete business:', err);
      alert('Delete failed: ' + (err.response?.data || err.message));
    }
  };

  const handleAddClick = () => {
    setEditingFarmer(null);
    setIsModalOpen(true);
  };

  const handleAddBusinessClick = () => {
    setEditingBusiness(null);
    setIsBusinessModalOpen(true);
  };

  const handleEditClick = (farmer) => {
    setEditingFarmer(farmer);
    setIsModalOpen(true);
  };

  const handleEditBusinessClick = (business) => {
    setEditingBusiness(business);
    setIsBusinessModalOpen(true);
  };

  const handleAddProductClick = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProductClick = async (productId) => {
    if (!productId) return alert('No product identifier provided');
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = authService.getToken();
      if (!token) {
        alert("Unauthorized");
        return;
      }

      console.log('Deleting product with ID:', productId);
      const res = await api.delete(`/api/v1/admin/product/delete/byAdmin/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      const msg = res?.data || 'Product deleted successfully';
      alert(msg);
    } catch (err) {
      console.error('Failed to delete product:', err);
      console.error('Error response data:', err.response?.data);
      alert('Delete failed: ' + (err.message));
    }
  };

  const handleSaveFarmer = async (farmerData) => {
    // If editing, update existing farmer via backend
    if (editingFarmer) {
      try {
        const token = authService.getToken();
        if (!token) {
          alert("Unauthorized");
          return;
        }

        const payload = {
          email: farmerData.email,
          firstName: farmerData.firstName,
          lastName: farmerData.lastName,
          contactNo: farmerData.contactNo,
          address: farmerData.address,
          role: "FARMER"
        };

        const res = await api.put("/admin/user/update", payload, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        setFarmers((prev) => prev.map((f) => (f.email === payload.email ? { ...f, ...payload } : f)));

        alert(res?.data || "Farmer updated");
        setIsModalOpen(false);
        setEditingFarmer(null);
      } catch (err) {
        console.error("Failed to update farmer:", err);
        alert("Update failed: " + (err.response?.data || err.message));
      }
      return;
    }

    // Otherwise create new farmer via backend register endpoint
    try {
      const payload = { ...farmerData, role: "FARMER" };
      const res = await api.post("/admin/user/register", payload);
      const created = res?.data || null;

      if (created && (created.email || created.id)) {
        setFarmers((prev) => [...prev, created]);
      } else {
        // fallback local entry
        const nextNum = getNextFarmerNumber(farmers);
        const newId = formatFarmerId(nextNum);
        const newFarmer = { id: newId, ...payload, joinDate: new Date().toISOString().split("T")[0] };
        setFarmers((prev) => [...prev, newFarmer]);
      }

      setIsModalOpen(false);
      setEditingFarmer(null);
      alert("Farmer created successfully");
    } catch (err) {
      console.error("Failed to create farmer:", err);
      alert("Failed to create farmer: " + (err.response?.data?.message || err.message));
    }
};


  const handleSaveBusiness = async (businessData) => {
    // If editing, update existing business via backend
    if (editingBusiness) {
      try {
        const token = authService.getToken();
        if (!token) {
          alert('Unauthorized');
          return;
        }

        const payload = { ...businessData, role: String(businessData.role || 'BUYER').toUpperCase() };

        const res = await api.put('/admin/user/update', payload, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });

        setBusinesses((prev) => prev.map((b) => (b.email === payload.email ? { ...b, ...payload } : b)));

        alert(res?.data || 'Business updated');
        setIsBusinessModalOpen(false);
        setEditingBusiness(null);
      } catch (err) {
        console.error('Failed to update business:', err);
        alert('Update failed: ' + (err.response?.data || err.message));
      }
      return;
    }

    // Add new business -> POST to backend register endpoint
    try {
      const payload = { ...businessData, role: String(businessData.role || 'BUYER').toUpperCase() };
      const res = await api.post('/admin/user/register', payload);
      const created = res && res.data ? res.data : null;

      if (created && created.id) {
        setBusinesses((prev) => [...prev, created]);
      } else {
        const newId = businesses.length > 0 ? Math.max(...businesses.map((b) => b.id)) + 1 : 1;
        const newBusiness = { id: newId, ...payload, joinDate: new Date().toISOString().split('T')[0] };
        setBusinesses((prev) => [...prev, newBusiness]);
      }

      setIsBusinessModalOpen(false);
      setEditingBusiness(null);
    } catch (err) {
      console.error('Failed to register business:', err);
      alert('Failed to register business: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <ToastNotification notification={notification} onClose={() => setNotification(null)} />
      <div className="flex h-screen font-sans" style={{ backgroundColor: colors.bgLight }}>
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
        <Header
          admin={admin}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          isNotificationPanelOpen={isNotificationPanelOpen}
          setIsNotificationPanelOpen={setIsNotificationPanelOpen}
          notifications={notifications}
          notificationCount={notifications.length}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto mt-16 p-6 z-0 font-sans">
          {/* === VIEW: OVERVIEW === */}
          {currentView === "overview" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Welcome back, Admin!</h1>
                <p className="text-gray-500 text-sm font-medium">Here's what's happening with HarvestLink today.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[{
                  title: "Total Revenue",
                  value: `LKR ${(revenueData?.currentMonthTotal ?? 0).toLocaleString()}`,
                  change: `${revenueData?.percentageChange >= 0 ? '+' : ''}${(revenueData?.percentageChange ?? 0).toFixed(2)}%`,
                  isPositive: (revenueData?.percentageChange ?? 0) >= 0,
                  icon: <ShoppingBag />,
                }, {
                  title: "Active Farmers",
                  value: `${totalFarmersData?.TotalFarmers ?? 0}`,
                  change: `${(totalFarmersData?.percentageChangeAccordingToMonth ?? 0) >= 0 ? '+' : ''}${(totalFarmersData?.percentageChangeAccordingToMonth ?? 0).toFixed(2)}%`,
                  isPositive: (totalFarmersData?.percentageChangeAccordingToMonth ?? 0) >= 0,
                  icon: <Users />,
                }, {
                  title: "Active Businesses",
                  value: `${totalBusinessesData?.TotalBusinesses ?? 0}`,
                  change: `${(totalBusinessesData?.percentageChangeAccordingToMonth ?? 0) >= 0 ? '+' : ''}${(totalBusinessesData?.percentageChangeAccordingToMonth ?? 0).toFixed(2)}%`,
                  isPositive: (totalBusinessesData?.percentageChangeAccordingToMonth ?? 0) >= 0,
                  icon: <Users />,
                }, {
                 title: "Pending Orders",
                 value: `${pendingOrdersData?.PendingOrders ?? 0}`,
                 change: `${(pendingOrdersData?.percentageChangeAccordingToMonth ?? 0) >= 0 ? '+' : ''}${(pendingOrdersData?.percentageChangeAccordingToMonth ?? 0).toFixed(2)}%`,
                 isPositive: (pendingOrdersData?.percentageChangeAccordingToMonth ?? 0) >= 0,
                 icon: <Package />,
                }].map((item, index) => (
                  <StatsCard key={index} item={item} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Table) */}
                <div className="lg:col-span-2">
                  <RecentOrdersTable orders={orders} onViewAll={() => setCurrentView('orders')} />
                </div>

                {/* Right Column (Widgets) */}
                <div className="flex flex-col gap-6">
                  {/* Top Products Widget */}
                  <TopProductsWidget products={topSellingProducts} />

                  {/* Promo/Help Card */}
                  <div className="rounded-xl p-6 text-white relative overflow-hidden" style={{ backgroundColor: colors.primaryDark }}>
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full" style={{ backgroundColor: colors.primaryLime, opacity: 0.2 }}></div>
                    <h3 className="font-bold text-lg mb-2 relative z-10">HarvestLink Admin</h3>
                    <p className="text-sm text-gray-300 relative z-10">Manage your agriculture network efficiently.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* === VIEW: FARMERS CRUD === */}
          {currentView === "farmers" && (
            <>
              {loadingFarmers ? (
                <div className="p-6 bg-white rounded-xl shadow-sm text-center">Loading farmers...</div>
              ) : farmersError ? (
                <div className="p-6 bg-white rounded-xl shadow-sm text-center text-red-600">Error loading farmers: {farmersError}</div>
              ) : (
                <FarmersCRUDSection
                  farmers={farmers}
                  onAddClick={handleAddClick}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                />
              )}
            </>
          )}

          {/* === VIEW: BUSINESSES CRUD === */}
          {currentView === "businesses" && (
            <>
              {loadingBusinesses ? (
                <div className="p-6 bg-white rounded-xl shadow-sm text-center">Loading businesses...</div>
              ) : businessesError ? (
                <div className="p-6 bg-white rounded-xl shadow-sm text-center text-red-600">Error loading businesses: {businessesError}</div>
              ) : (
                <BusinessesCRUDSection
                  businesses={businesses}
                  onAddClick={handleAddBusinessClick}
                  onEditClick={handleEditBusinessClick}
                  onDeleteClick={handleBusinessDelete}
                />
              )}
            </>
          )}

          {/* === VIEW: PRODUCTS CRUD === */}
          {currentView === "products" && (
            <>
              {loadingProducts ? (
                <div className="p-6 bg-white rounded-xl shadow-sm text-center">Loading products...</div>
              ) : productsError ? (
                <div className="p-6 bg-white rounded-xl shadow-sm text-center text-red-600">Error loading products: {productsError}</div>
              ) : (
                <ProductsCRUDSection
                  products={products}
                  onAddClick={handleAddProductClick}
                  onEditClick={handleEditProductClick}
                  onDeleteClick={handleDeleteProductClick}
                />
              )}
            </>
          )}

          {/* === VIEW: ORDERS CRUD === */}
          {currentView === "orders" && (
            <>
              {loadingOrders ? (
                <div className="p-6 bg-white rounded-xl shadow-sm text-center">Loading orders...</div>
              ) : ordersError ? (
                <div className="p-6 bg-white rounded-xl shadow-sm text-center text-red-600">Error loading orders: {ordersError}</div>
              ) : (
                <OrdersCRUDSection orders={orders} />
              )}
            </>
          )}

          {/* === VIEW: SETTINGS === */}
          {currentView === "settings" && (
            <SettingsView admin={admin} setAdmin={setAdmin} />
          )}
        </main>
      </div>

      {/* Conditional rendering for the modal to ensure fresh state */}
      {isModalOpen && (
        <FarmerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveFarmer}
          editingFarmer={editingFarmer}
        />
      )}
      {isBusinessModalOpen && (
        <BusinessModal
          isOpen={isBusinessModalOpen}
          onClose={() => setIsBusinessModalOpen(false)}
          onSave={handleSaveBusiness}
          editingBusiness={editingBusiness}
        />
      )}
    </div>
    </>
  );
}