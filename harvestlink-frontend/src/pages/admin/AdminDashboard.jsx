
import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import authService from "../../services/authService";
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
import axios from "axios";

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

// --- Mock Data (Overview) ---
const statsData = [
  {
    title: "Total Revenue",
    value: "LKR 450,000",
    change: "+12.5%",
    isPositive: true,
    icon: <ShoppingBag />,
  },
  {
    title: "Active Farmers",
    value: "124",
    change: "+4.3%",
    isPositive: true,
    icon: <Users />,
  },
  {
    title: "Active Businesses",
    value: "58",
    change: "+2.1%",
    isPositive: true,
    icon: <Users />,
  },
  {
    title: "Pending Orders",
    value: "32",
    change: "-5.0%",
    isPositive: false,
    icon: <Package />,
  }
];

const topSellingProducts = [
  { name: "Organic Tomatoes", sales: "1,200kg", trend: "up" },
  { name: "Fresh Potatoes", sales: "950kg", trend: "up" },
  { name: "Green Chillies", sales: "400kg", trend: "down" },
  { name: "Red Onions", sales: "320kg", trend: "up" },
];

const recentOrders = [
  {
    id: "#ORD-7752",
    customer: "Green Leaf Restaurant",
    items: "Tomatoes (50kg), Carrots (20kg)",
    total: "LKR 24,500",
    status: "Pending",
  },
  {
    id: "#ORD-7751",
    customer: "Colombo Fresh Market",
    items: "Potatoes (100kg)",
    total: "LKR 18,000",
    status: "Delivered",
  },
  {
    id: "#ORD-7750",
    customer: "Sarah's Juice Bar",
    items: "Mixed Fruits (30kg)",
    total: "LKR 12,500",
    status: "Processing",
  },
  {
    id: "#ORD-7749",
    customer: "Kandy Spice Hut",
    items: "Green Chillies (10kg)",
    total: "LKR 8,500",
    status: "Delivered",
  },
];


const initialFarmersData = [];
// --- MOCK DATA (Businesses CRUD Backend Simulation) ---
const initialBusinessesData = [];

// === Components ===

// 1. Sidebar Component
const Sidebar = ({ currentView, setCurrentView }) => {
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


const Header = () => (
  <header className="h-16 bg-white shadow-sm fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-6 transition-all duration-300 font-sans">
    <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
      <Search size={18} className="text-gray-400" />
      <input
        type="text"
        placeholder="Search anything..."
        className="bg-transparent border-none outline-none text-sm ml-2 flex-1 placeholder-gray-400 font-sans"
      />
    </div>

    <div className="flex items-center gap-6">
      <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-600 hover:text-emerald-800 transition" />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
      </div>

      <div className="flex items-center gap-3 cursor-pointer group">
        <img
          src="https://i.pravatar.cc/150?img=68"
          alt="Admin Profile"
           className={`h-9 w-9 rounded-full border-2 border-gray-200 group-hover:border-lime-400 transition`}
        />
        <div className="hidden md:block text-sm text-left font-sans">
          <p className="font-bold text-gray-700 group-hover:text-emerald-800">
            Admin User
          </p>
          <p className="text-gray-400 text-xs font-medium">Super Admin</p>
        </div>
        <ChevronDown size={16} className="text-gray-400 group-hover:text-emerald-800" />
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
const RecentOrdersTable = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Processing": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-sans">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
        <button className={`text-sm text-emerald-800 font-bold hover:underline`}>
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
              <th className="px-6 py-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentOrders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50 transition font-medium">
                <td className="px-6 py-4 text-gray-800">{order.id}</td>
                <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{order.items}</td>
                <td className="px-6 py-4 text-gray-800">{order.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 5. Top Products Widget
const TopProductsWidget = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 font-sans">
    <h2 className="text-lg font-bold text-gray-800 mb-4">Top Selling Produce</h2>
    <div className="space-y-4">
      {topSellingProducts.map((product, i) => (
        <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Leaf size={18} className={`text-emerald-800`} />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm">{product.name}</p>
              <p className="text-xs text-gray-400 font-medium">{product.sales} sold</p>
            </div>
          </div>
          {product.trend === "up" ? (
            <ArrowUpRight size={16} className="text-green-500" />
          ) : (
            <ArrowDownRight size={16} className="text-red-500" />
          )}
        </div>
      ))}
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
          <h1 classNam="text-2xl font-bold text-gray-800">Businesses Management</h1>
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

// --- Main Layout Structure ---
export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState("overview");

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
    <div className="flex h-screen font-sans" style={{ backgroundColor: colors.bgLight }}>
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
        <Header />

        <main className="flex-1 overflow-y-auto mt-16 p-6 z-0 font-sans">
          {/* === VIEW: OVERVIEW === */}
          {currentView === "overview" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Welcome back, Admin!</h1>
                <p className="text-gray-500 text-sm font-medium">Here's what's happening with HarvestLink today.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((item, index) => (
                  <StatsCard key={index} item={item} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Table) */}
                <div className="lg:col-span-2">
                  <RecentOrdersTable />
                </div>

                {/* Right Column (Widgets) */}
                <div className="flex flex-col gap-6">
                  {/* Top Products Widget */}
                  <TopProductsWidget />

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
  );
}