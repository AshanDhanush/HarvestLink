
import React, { useState, useEffect } from "react";
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

// --- MOCK DATA (Farmers CRUD Backend Simulation) ---
const initialFarmersData = [];

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
      {/* Logo Area - Replaced Image with Text/Icon placeholder */}
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 group font-sans text-left ${
              currentView === item.id
                ? `bg-[${colors.primaryLime}] text-[${colors.primaryDark}] font-bold`
                : `hover:bg-green-400 text-gray-300 hover:text-green-700 font-medium`
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#ffffff20]">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-green-400 text-gray-300 hover:text-green-700 transition-colors font-medium">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

// 2. Header Component
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
        <Bell size={20} className={`text-gray-600 hover:text-[${colors.primaryDark}] transition`} />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
      </div>

      <div className="flex items-center gap-3 cursor-pointer group">
        <img
          src="https://i.pravatar.cc/150?img=68"
          alt="Admin Profile"
          className={`h-9 w-9 rounded-full border-2 border-gray-200 group-hover:border-[${colors.primaryLime}] transition`}
        />
        <div className="hidden md:block text-sm text-left font-sans">
          <p className={`font-bold text-gray-700 group-hover:text-[${colors.primaryDark}]`}>
            Admin User
          </p>
          <p className="text-gray-400 text-xs font-medium">Super Admin</p>
        </div>
        <ChevronDown size={16} className={`text-gray-400 group-hover:text-[${colors.primaryDark}]`} />
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
      <div className={`p-3 rounded-lg bg-[${colors.primaryDark}] bg-opacity-10 text-[${colors.primaryDark}]`}>
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
        <button className={`text-sm text-[${colors.primaryDark}] font-bold hover:underline`}>
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
              <Leaf size={18} className={`text-[${colors.primaryDark}]`} />
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
      name: "",
      location: "",
      contact: "",
      status: "Active",
    }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) {
      alert("Name and Contact are required!");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center font-sans">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className={`flex justify-between items-center p-6 border-b border-gray-100 bg-[${colors.bgLight}]`}>
          <h3 className="text-lg font-bold text-gray-800">{editingFarmer ? "Edit Farmer" : "Add New Farmer"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[${colors.primaryLime}] focus:bg-white focus:ring-0 transition font-medium"
              placeholder="e.g., Sunil Perera"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[${colors.primaryLime}] focus:bg-white focus:ring-0 transition font-medium"
                  placeholder="e.g., Dambulla"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[${colors.primaryLime}] focus:bg-white focus:ring-0 transition font-medium"
                  placeholder="07X-XXXXXXX"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[${colors.primaryLime}] focus:bg-white focus:ring-0 transition font-medium"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold transition">
              Cancel
            </button>
            <button type="submit" className={`px-6 py-2 rounded-lg text-white bg-[${colors.primaryDark}] hover:bg-opacity-90 font-bold transition flex items-center gap-2`}>
              {editingFarmer ? <Edit size={18} /> : <Plus size={18} />}
              {editingFarmer ? "Update Farmer" : "Save Farmer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 7. Farmers CRUD Section
const FarmersCRUDSection = ({ farmers, onAddClick, onEditClick, onDeleteClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Inactive": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Farmers Management</h1>
          <p className="text-gray-500 text-sm font-medium">Manage your farmer network, add new profiles, or update existing ones.</p>
        </div>
        <button onClick={onAddClick} className={`flex items-center gap-2 bg-[${colors.primaryDark}] text-white px-5 py-3 rounded-lg hover:bg-opacity-90 transition font-bold shadow-sm`}>
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
                <th className="px-6 py-4 font-bold">Farmer Name</th>
                <th className="px-6 py-4 font-bold">Location</th>
                <th className="px-6 py-4 font-bold">Contact</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {farmers.length > 0 ? (
                farmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-gray-50 transition font-medium">
                    <td className="px-6 py-4 text-gray-600">#{farmer.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full bg-[${colors.primaryLime}] bg-opacity-20 flex items-center justify-center text-[${colors.primaryDark}] font-bold`}>
                          {farmer.firstName}
                        </div>
                        <span className="text-gray-800 font-bold">{farmer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        {farmer.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{farmer.contact}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(farmer.status)}`}>
                        {farmer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onEditClick(farmer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => onDeleteClick(farmer.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 font-medium">
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

// --- Main Layout Structure ---
export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState("overview");

  // === CRUD State Management ===
  const [farmers, setFarmers] = useState(initialFarmersData);
  const [loadingFarmers, setLoadingFarmers] = useState(false);
  const [farmersError, setFarmersError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState(null);

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

  // === CRUD Handlers ===
  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this farmer?")) {
      setFarmers(farmers.filter((farmer) => farmer.id !== id));
    }
  };

  const handleAddClick = () => {
    setEditingFarmer(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (farmer) => {
    setEditingFarmer(farmer);
    setIsModalOpen(true);
  };

  const handleSaveFarmer = (farmerData) => {
    if (editingFarmer) {
      setFarmers(
        farmers.map((f) =>
          f.id === editingFarmer.id ? { ...f, ...farmerData } : f
        )
      );
    } else {
      const newId = farmers.length > 0 ? Math.max(...farmers.map(f => f.id)) + 1 : 1;
      const newFarmer = {
        id: newId,
        ...farmerData,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setFarmers([...farmers, newFarmer]);
    }
    setIsModalOpen(false);
    setEditingFarmer(null);
  };

  return (
    <div className={`flex h-screen bg-[${colors.bgLight}] font-sans`}>
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
                  <div className={`bg-[${colors.primaryDark}] rounded-xl p-6 text-white relative overflow-hidden`}>
                    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-[${colors.primaryLime}] rounded-full opacity-20`}></div>
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
    </div>
  );
}