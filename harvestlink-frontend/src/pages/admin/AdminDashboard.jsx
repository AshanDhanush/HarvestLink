import React, { useState } from "react";
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
} from "lucide-react";
import logo from "../../assets/Logo-L_1@0.75x.png";

// --- Colors based on your previous design ---
const colors = {
  primaryDark: "#1a4d2e",
  primaryLime: "#8cc63f",
  bgLight: "#f3f4f6", // gray-100
};

// --- Mock Data ---
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
    value: "89",
    change: "+2.1%",
    isPositive: true,
    icon: <Users />,
  },
  {
    title: "Pending Orders",
    value: "32",
    change: "-5%",
    isPositive: false,
    icon: <Package />,
  },
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

// === Components ===

// 1. Sidebar Navigation Component (The "Banna" on the left)
const Sidebar = () => {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", active: true },
    { icon: <Users size={20} />, label: "Farmers" },
    { icon: <Users size={20} />, label: "Businesses" },
    { icon: <Package size={20} />, label: "Products" },
    { icon: <ShoppingBag size={20} />, label: "Orders" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <aside
      className={`w-64 bg-[${colors.primaryDark}] text-white flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300`}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 font-bold text-xl border-b border-[#ffffff20]">
        <img
                    src={logo}
                    alt="HarvestLink Logo"
                    className="h-10 md:h-14 w-auto object-contain"
                  />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 group ${
              item.active
                ? `bg-[${colors.primaryLime}] text-[${colors.primaryDark}] font-medium`
                : `hover:bg-[#ffffff10] text-black hover:text-white`
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#ffffff20]">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-[#ffffff10] text-gray-300 hover:text-white transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

// 2. Top Header Component (The top banner)
const Header = () => (
  <header className="h-16 bg-white shadow-sm fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-6 transition-all duration-300">
    {/* Search Bar */}
    <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
      <Search size={18} className="text-gray-400" />
      <input
        type="text"
        placeholder="Search anything..."
        className="bg-transparent border-none outline-none text-sm ml-2 flex-1 placeholder-gray-400"
      />
    </div>

    {/* Right Side Icons & Profile */}
    <div className="flex items-center gap-6">
      <div className="relative cursor-pointer">
        <Bell
          size={20}
          className="text-gray-600 hover:text-[${colors.primaryDark}] transition"
        />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
      </div>

      <div className="flex items-center gap-3 cursor-pointer group">
        <img
          src="https://i.pravatar.cc/150?img=68"
          alt="Admin Profile"
          className="h-9 w-9 rounded-full border-2 border-gray-200 group-hover:border-[${colors.primaryLime}] transition"
        />
        <div className="hidden md:block text-sm text-left">
          <p className="font-medium text-gray-700 group-hover:text-[${colors.primaryDark}]">
            Admin User
          </p>
          <p className="text-gray-400 text-xs">Super Admin</p>
        </div>
        <ChevronDown
          size={16}
          className="text-gray-400 group-hover:text-[${colors.primaryDark}]"
        />
      </div>
    </div>
  </header>
);

// 3. Main Dashboard Content Views

const StatsCard = ({ item }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm text-gray-500 mb-1">{item.title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
      </div>
      <div
        className={`p-3 rounded-lg bg-[${colors.primaryDark}] bg-opacity-10 text-[${colors.primaryDark}]`}
      >
        {item.icon}
      </div>
    </div>
    <div
      className={`flex items-center text-sm font-medium ${
        item.isPositive ? "text-green-500" : "text-red-500"
      }`}
    >
      {item.isPositive ? (
        <ArrowUpRight size={16} className="mr-1" />
      ) : (
        <ArrowDownRight size={16} className="mr-1" />
      )}
      <span>{item.change}</span>
      <span className="text-gray-400 ml-2 font-normal">vs last month</span>
    </div>
  </div>
);

const RecentOrdersTable = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
        <button
          className={`text-sm text-[${colors.primaryDark}] font-medium hover:underline`}
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Items</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentOrders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                  {order.items}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {order.total}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 cursor-pointer hover:text-gray-600">
                  <MoreVertical size={18} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Layout Structure (The "3" part layout) ---
export default function AdminDashboard() {
  return (
    <div className={`flex h-screen bg-[${colors.bgLight}] font-sans`}>
      {/* Part 1: Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
        {/* Part 2: Header */}
        <Header />

        {/* Part 3: Main Content Area */}
        <main className="flex-1 overflow-y-auto mt-16 p-6 z-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, Admin!
            </h1>
            <p className="text-gray-500 text-sm">
              Here's what's happening with HarvestLink today.
            </p>
          </div>

          {/* Stats Grid (Nano style - clean cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((item, index) => (
              <StatsCard key={index} item={item} />
            ))}
          </div>

          {/* Two Column Section for Tables/Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column (Takes 2/3 space) */}
            <div className="lg:col-span-2">
              <RecentOrdersTable />
            </div>

            {/* Side Widget Column (Takes 1/3 space) */}
            <div className="flex flex-col gap-6">
              {/* Example Widget: Top Products */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Top Selling Produce
                </h2>
                <div className="space-y-4">
                  {[
                    { name: "Organic Tomatoes", sales: "1,200kg", trend: "up" },
                    { name: "Fresh Potatoes", sales: "950kg", trend: "up" },
                    { name: "Green Chillies", sales: "400kg", trend: "down" },
                  ].map((product, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Leaf
                            size={18}
                            className={`text-[${colors.primaryDark}]`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {product.sales} sold
                          </p>
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

              {/* Another nano widget */}
              <div
                className={`bg-[${colors.primaryDark}] rounded-xl p-6 text-white relative overflow-hidden`}
              >
                {/* Decorative circle */}
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 bg-[${colors.primaryLime}] rounded-full opacity-20`}
                ></div>
                <h3 className="font-bold text-lg mb-2 relative z-10">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-300 mb-4 relative z-10">
                  Check our documentation for admin tools.
                </p>
                <button
                  className={`bg-[${colors.primaryLime}] text-[${colors.primaryDark}] text-sm font-bold px-4 py-2 rounded-lg relative z-10 hover:bg-opacity-90 transition`}
                >
                  View Docs
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
