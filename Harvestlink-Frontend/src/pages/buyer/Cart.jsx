import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import TopBar from '../../components/layout/Topbar';
import NavBar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DeliveryLocationPicker from '../../components/delivery/DeliveryLocationPicker';
import { Trash2, Plus, Minus, ArrowLeft, Truck, MapPin, Package, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import deliveryService from '../../services/deliveryService';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    // Delivery fee state
    const [deliveryFee, setDeliveryFee] = useState({
        total: 0,
        baseFee: 0,
        distanceCost: 0,
        weightCost: 0,
        distanceKm: 0,
        weightKg: 0,
        extraDistance: 0,
        extraWeight: 0
    });
    const [deliveryLocation, setDeliveryLocation] = useState(null);

    // Calculate total weight
    const getTotalWeight = () => {
        return cartItems.reduce((total, item) => {
            const weight = item.weight ? item.weight * item.quantity : item.quantity;
            return total + weight;
        }, 0);
    };

    // Handle delivery fee calculated
    const handleDeliveryFeeCalculated = (breakdown) => {
        setDeliveryFee(breakdown);
        // Store in sessionStorage for checkout
        sessionStorage.setItem('deliveryFee', JSON.stringify(breakdown));
        sessionStorage.setItem('deliveryLocation', JSON.stringify(deliveryLocation));
    };

    // Handle location selected
    const handleLocationSelected = (location) => {
        setDeliveryLocation(location);
    };

    // Navigate to checkout with delivery data
    const handleProceedToCheckout = () => {
        if (!deliveryLocation) {
            alert('Please select a delivery location first');
            return;
        }
        sessionStorage.setItem('deliveryFee', JSON.stringify(deliveryFee));
        sessionStorage.setItem('deliveryLocation', JSON.stringify(deliveryLocation));
        navigate('/checkout');
    };

    const subtotal = getCartTotal();
    const total = subtotal + deliveryFee.total;

    return (
        <div className="bg-gray-50 min-h-screen">
            <TopBar />
            <NavBar />

            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/shop')}
                    className="flex items-center gap-2 text-gray-500 hover:text-harvest-primary mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Continue Shopping</span>
                </button>

                <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🛒</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-harvest-primary hover:bg-harvest-dark text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-green-200"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                        <img
                                            src={item.imageUrl || "https://placehold.co/150?text=Product"}
                                            alt={item.name}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                        />
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                                        {item.location && (
                                            <p className="text-xs text-gray-400 flex items-center gap-1 justify-center sm:justify-start">
                                                <MapPin size={12} />
                                                {item.location}
                                            </p>
                                        )}
                                        <div className="text-harvest-primary font-bold">LKR {item.price} / {item.unit}</div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-2 hover:bg-white rounded-md transition-colors text-gray-600 disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-2 hover:bg-white rounded-md transition-colors text-gray-600"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <div className="text-right min-w-[100px]">
                                        <div className="font-bold text-lg text-gray-900">LKR {item.price * item.quantity}</div>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={clearCart}
                                className="text-red-500 text-sm font-medium hover:underline flex items-center gap-2 px-4"
                            >
                                <Trash2 size={16} /> Clear Cart
                            </button>

                            {/* Delivery Location Picker */}
                            <div className="mt-6">
                                <DeliveryLocationPicker
                                    cartItems={cartItems}
                                    onDeliveryFeeCalculated={handleDeliveryFeeCalculated}
                                    onLocationSelected={handleLocationSelected}
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    {/* Subtotal */}
                                    <div className="flex justify-between text-gray-600">
                                        <span className="flex items-center gap-2">
                                            <Package size={16} />
                                            Subtotal ({cartItems.length} items)
                                        </span>
                                        <span className="font-medium">LKR {subtotal.toLocaleString()}</span>
                                    </div>

                                    {/* Weight Info */}
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span className="flex items-center gap-2">
                                            <Scale size={14} />
                                            Total Weight
                                        </span>
                                        <span>{getTotalWeight()} kg</span>
                                    </div>

                                    {/* Delivery Fee Breakdown */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Truck size={16} className="text-green-600" />
                                            <span className="font-semibold text-gray-700">Delivery Charges</span>
                                        </div>

                                        {deliveryLocation ? (
                                            <div className="space-y-2 text-sm bg-green-50 p-3 rounded-xl">
                                                {/* Base Fee */}
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Base Fee (0-20km)</span>
                                                    <span>LKR {deliveryFee.baseFee}</span>
                                                </div>

                                                {/* Distance Info */}
                                                {deliveryFee.distanceKm > 0 && (
                                                    <div className="flex justify-between text-gray-500">
                                                        <span>Distance: {deliveryFee.distanceKm} km</span>
                                                    </div>
                                                )}

                                                {/* Distance Surcharge */}
                                                {deliveryFee.distanceCost > 0 && (
                                                    <div className="flex justify-between text-blue-600">
                                                        <span>+ Extra {deliveryFee.extraDistance} km</span>
                                                        <span>LKR {deliveryFee.distanceCost}</span>
                                                    </div>
                                                )}

                                                {/* Weight Surcharge */}
                                                {deliveryFee.weightCost > 0 && (
                                                    <div className="flex justify-between text-orange-600">
                                                        <span>+ Heavy Load ({deliveryFee.extraWeight} kg)</span>
                                                        <span>LKR {deliveryFee.weightCost}</span>
                                                    </div>
                                                )}

                                                {/* Delivery Total */}
                                                <div className="flex justify-between font-bold text-green-700 pt-2 border-t border-green-200">
                                                    <span>Delivery Total</span>
                                                    <span>LKR {deliveryFee.total}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl">
                                                <p className="flex items-center gap-2">
                                                    <MapPin size={14} />
                                                    Set delivery location to calculate fee
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Grand Total */}
                                    <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                                        <span className="font-bold text-gray-800">Grand Total</span>
                                        <span className="text-2xl font-bold text-harvest-dark">
                                            LKR {total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleProceedToCheckout}
                                    disabled={!deliveryLocation}
                                    className={`w-full font-bold py-4 rounded-xl transition-colors shadow-lg mb-4 ${deliveryLocation
                                            ? 'bg-harvest-primary hover:bg-harvest-dark text-white shadow-green-200'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {deliveryLocation ? 'Proceed to Checkout' : 'Set Delivery Location First'}
                                </button>

                                <p className="text-xs text-center text-gray-400">
                                    Secure Checkout powered by HarvestLink
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Cart;
