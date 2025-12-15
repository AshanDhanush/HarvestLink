import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import Home from "./pages/buyer/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SearchMap from "./pages/buyer/SearchMap";
import Shop from "./pages/buyer/Shop"; 

import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

function App() {
  return (
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

        {/* Buyer Routes */}
        <Route path="/search" element={<SearchMap />} />

        {/* Protected Routes (Placeholders) */}
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
