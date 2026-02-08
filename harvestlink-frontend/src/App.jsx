import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Home from "./pages/buyer/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SearchMap from "./pages/buyer/SearchMap";
import Shop from "./pages/buyer/Shop";
import Orders from "./pages/buyer/Orders";
import Profile from "./pages/buyer/Profile";
import ProductDetail from "./pages/buyer/ProductDetail";
import Cart from "./pages/buyer/Cart";
import { CartProvider } from "./context/CartContext";

import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import DeliveryCharges from './pages/public/DeliveryCharges';
import DeliveryProductsTest from './pages/public/DeliveryProductsTest';
function App() {
  return (
    <CartProvider>
      <Toaster position="top-center" />
      <BrowserRouter>
        {/* PAGE CONTENT */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/delivery-test" element={<DeliveryProductsTest />} />
          <Route path="/delivery-charges/:id" element={<DeliveryCharges />} />
          {/* Buyer Routes */}
          <Route path="/search" element={<SearchMap />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected Routes (Placeholders) */}
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
