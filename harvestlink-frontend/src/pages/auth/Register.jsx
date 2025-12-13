import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Phone, MapPin, Tractor, ShoppingBag, AlertCircle } from "lucide-react";
import farmerBG from "../../assets/farmer-bg.png";
import logo from "../../assets/Logo-D@0.75x.png";
import authService from "../../services/authService";

const Register = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("BUYER");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contactNo: "",
        address: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const registerRequest = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: role,
                contactNo: formData.contactNo,
                address: formData.address
            };

            await authService.register(registerRequest);
            // Optionally redirect to login with a success state or auto-login
            navigate("/login");
        } catch (err) {
            console.error("Registration failed", err);
            const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

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

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                                type="button"
                                onClick={() => setRole("BUYER")}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition duration-200 ${role === "BUYER"
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
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition duration-200 ${role === "FARMER"
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
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="John"
                                        required
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
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        required
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
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    required
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
                                    name="contactNo"
                                    value={formData.contactNo}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    required
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
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="123 Farm Lane, Countryside"
                                    required
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
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create password"
                                        required
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
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm password"
                                        required
                                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-harvest-primary focus:ring-2 focus:ring-harvest-primary/20 outline-none transition bg-gray-50 focus:bg-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-harvest-primary hover:bg-harvest-primary-hover text-white font-bold py-3 rounded-lg shadow-md shadow-harvest-primary/20 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-2 text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating Account...' : (
                                <>
                                    Create Account <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
