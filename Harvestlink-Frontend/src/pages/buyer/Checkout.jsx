import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import TopBar from '../../components/layout/Topbar';
import NavBar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ArrowLeft, MapPin, CreditCard, Truck, CheckCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import deliveryService from '../../services/deliveryService';
import orderService from '../../services/orderService';
import authService from '../../services/authService';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        if (currentUser.name || currentUser.username) {
            setName(currentUser.name || currentUser.username);
        }
        // Assuming user object might have address, otherwise default to empty
        if (currentUser.address) {
            setAddress(currentUser.address);
        }
    }, [navigate]);

    const subtotal = parseFloat(getCartTotal());
    const deliveryCharge = deliveryService.calculateDeliveryCharge(subtotal, address);
    const total = subtotal + deliveryCharge;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!address || !name) {
            alert("Please fill in all required fields");
            return;
        }
        setLoading(true);

        try {
            const orderData = {
                CustomerId: user.id || user.userId || "guest", // Fallback if ID is missing or different field
                orderDetails: {
                    customerName: name,
                    customerEmail: user.email,
                    orderItems: cartItems.map(item => ({
                        productId: item.id,
                        productName: item.name,
                        quantity: item.quantity,
                        unitPrice: item.price
                    })),
                    deliveryFees: deliveryCharge,
                    totalPrice: total,
                    deliveryAddress: address,
                    status: "Pending"
                }
            };

            await orderService.createOrder(orderData);
            setSuccess(true);
            clearCart();
            setTimeout(() => {
                navigate('/orders');
            }, 3000);
        } catch (error) {
            console.error("Order failed", error);
            alert("Failed to place order. Please try again.");
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <TopBar />
                <NavBar />
                <div className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center max-w-md w-full">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-green-600" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                        <p className="text-gray-500 mb-8">
                            Thank you for your purchase. You will be redirected to your orders page shortly.
                        </p>
                        <button
                            onClick={() => navigate('/orders')}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition w-full"
                        >
                            View Orders
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) return null; // Or a loader

    return (
        <div className="bg-gray-50 min-h-screen">
            <TopBar />
            <NavBar />

            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center gap-2 text-gray-500 hover:text-green-600 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Cart</span>
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Delivery Details & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Delivery Address Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                    <MapPin size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Delivery Address</h2>
                            </div>
                            
                            <form id="checkout-form" onSubmit={handlePlaceOrder}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input 
                                            type="text" 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder="Enter recipient's full name"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input 
                                            type="email" 
                                            value={user.email || ''} 
                                            disabled 
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                                        <textarea 
                                            required
                                            rows="3"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Enter your full delivery address"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
                                        ></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Payment Method Section - Mocked for now */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-75">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <CreditCard size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
                            </div>
                            <div className="p-4 border border-green-200 bg-green-50 rounded-xl flex items-center justify-between">
                                <span className="font-medium text-green-800">Cash on Delivery</span>
                                <CheckCircle size={20} className="text-green-600" />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Only Cash on Delivery is available at the moment.</p>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <img 
                                            src={item.imageUrl || "https://placehold.co/60?text=Product"} 
                                            alt={item.name} 
                                            className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-gray-500">{item.quantity} x LKR {item.price}</p>
                                        </div>
                                        <div className="font-semibold text-gray-900 text-sm">
                                            LKR {item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">LKR {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                                        {deliveryCharge === 0 ? 'Free' : `LKR ${deliveryCharge.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                    <span className="font-bold text-gray-900 text-lg">Total</span>
                                    <span className="text-2xl font-bold text-green-700">LKR {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <span>Place Order</span>
                                        <Truck size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
