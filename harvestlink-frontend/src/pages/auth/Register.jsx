import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Phone, MapPin, Tractor, ShoppingBag } from "lucide-react";
import farmerBG from "../../assets/farmer-bg.png";
import logo from "../../assets/Logo-D@0.75x.png";

const Register = () => {
  const [role, setRole] = useState("BUYER");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row shadow-lime-900/20">
        
        {/* Left Side - Image & Branding */}
        <div className="md:w-5/12 relative bg-harvest-dark min-h-[200px] md:min-h-auto order-last md:order-first">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${farmerBG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-harvest-dark/90 via-harvest-dark/50 to-transparent"></div>
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
            <div className="flex items-center gap-2">
               <img src={logo} alt="HarvestLink Logo" className="h-10" />
            </div>
            
            <div className="mt-auto hidden md:block">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Join Our Community</h2>
              <p className="text-gray-200 text-sm">
                Whether you're a farmer looking to reach more customers or a buyer seeking fresh local produce, we've got you covered.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="md:w-7/12 p-8 md:p-10">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Create Account</h3>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-harvest-primary font-semibold hover:text-harvest-primary-hover transition">
                Sign in
              </Link>
            </p>
          </div>

          <form className="space-y-4">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                    type="button"
                    onClick={() => setRole("BUYER")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition duration-200 ${
                        role === "BUYER" 
                        ? "border-harvest-primary bg-harvest-bg-light text-harvest-dark" 
                        : "border-gray-100 hover:border-gray-200 text-gray-500"
                    }`}
                >
                    <ShoppingBag size={20} className={role === "BUYER" ? "text-harvest-primary" : "text-gray-400"} />
                    <span className="font-semibold text-sm">I'm a Buyer</span>
                </button>
                <button
                    type="button"
                    onClick={() => setRole("FARMER")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition duration-200 ${
                        role === "FARMER" 
                        ? "border-harvest-primary bg-harvest-bg-light text-harvest-dark" 
                        : "border-gray-100 hover:border-gray-200 text-gray-500"
                    }`}
                >
                    <Tractor size={20} className={role === "FARMER" ? "text-harvest-primary" : "text-gray-400"} />
                    <span className="font-semibold text-sm">I'm a Farmer</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">First Name</label>
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-harvest-primary transition" size={18} />
                    <input 
                    type="text" 
                    placeholder="John" 
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-harvest-primary focus:ring-2 focus:ring-harvest-primary/20 outline-none transition bg-gray-50 focus:bg-white text-sm"
                    />
                </div>
                </div>

                <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">Last Name</label>
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-harvest-primary transition" size={18} />
                    <input 
                    type="text" 
                    placeholder="Doe" 
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-harvest-primary focus:ring-2 focus:ring-harvest-primary/20 outline-none transition bg-gray-50 focus:bg-white text-sm"
                    />
                </div>
                </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 block">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-harvest-primary transition" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-harvest-primary focus:ring-2 focus:ring-harvest-primary/20 outline-none transition bg-gray-50 focus:bg-white text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 block">Contact Number</label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-harvest-primary transition" size={18} />
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-harvest-primary focus:ring-2 focus:ring-harvest-primary/20 outline-none transition bg-gray-50 focus:bg-white text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 block">Address</label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-harvest-primary transition" size={18} />
                <input 
                  type="text" 
                  placeholder="123 Farm Lane, Countryside" 
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-harvest-primary focus:ring-2 focus:ring-harvest-primary/20 outline-none transition bg-gray-50 focus:bg-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">Password</label>
                <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-harvest-primary transition" size={18} />
                    <input 
                    type="password" 
                    placeholder="Create password" 
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-harvest-primary focus:ring-2 focus:ring-harvest-primary/20 outline-none transition bg-gray-50 focus:bg-white text-sm"
                    />
                </div>
                </div>

                <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 block">Confirm Password</label>
                <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-harvest-primary transition" size={18} />
                    <input 
                    type="password" 
                    placeholder="Confirm password" 
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-harvest-primary focus:ring-2 focus:ring-harvest-primary/20 outline-none transition bg-gray-50 focus:bg-white text-sm"
                    />
                </div>
                </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-harvest-primary hover:bg-harvest-primary-hover text-white font-bold py-3 rounded-lg shadow-md shadow-harvest-primary/20 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-2 text-sm"
            >
              Create Account <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
