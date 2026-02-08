import React, { useState, useEffect } from "react";
import authService from "../../services/authService";
import orderService from "../../services/orderService";
import { Package, Calendar, MapPin, ChevronRight, Loader, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    const fetchOrders = async () => {
      try {
        const allOrders = await orderService.getOrders();
        // In a real app, the backend should filter by user ID.
        // For now, we filter on frontend if possible, or show all for demo if no specific field matches perfectly.
        // Ideally: allOrders.filter(o => o.customerId === currentUser.id)
        
        // Mock filtering (or showing all if structure uncertain for now)
        setOrders(allOrders); 
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="text-gray-500 text-lg mb-4">Please log in to view your orders.</p>
          <Link to="/login" className="text-green-600 hover:underline font-medium">Login Page</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Package className="text-green-600" size={32} />
            Your Orders
          </h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Order ID</p>
                        <p className="font-mono font-bold text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={16} />
                        {/* Formatted Date if available, else generic */}
                        <span>{new Date().toLocaleDateString()}</span> 
                      </div>
                      <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold uppercase tracking-wide w-fit">
                        {order.status || "Pending"}
                      </div>
                    </div>

                    <hr className="border-gray-100 my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
                          <ul className="space-y-2">
                               {/* Assuming order.products or similar structure */}
                               {order.products ? (
                                   order.products.map((prod, idx) => (
                                       <li key={idx} className="text-sm text-gray-600 flex justify-between">
                                           <span>{prod.name} x {prod.quantity}</span>
                                           <span className="font-medium">LKR {prod.price * prod.quantity}</span>
                                       </li>
                                   ))
                               ) : (
                                    <li className="text-sm text-gray-500 italic">Product details unavailable</li>
                               )}
                          </ul>
                      </div>
                      <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Delivery</h4>
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                              <MapPin size={16} className="mt-0.5 shrink-0" />
                              <p>{user.address || "Address not provided"}</p>
                          </div>
                      </div>
                    </div>
                    
                    <hr className="border-gray-100 my-4" />
                    
                    <div className="flex justify-between items-center bg-gray-50 -mx-6 -mb-6 px-6 py-4 mt-2">
                        <span className="font-medium text-gray-900">Total Amount</span>
                        <span className="text-xl font-bold text-green-700">LKR {order.totalAmount || "0.00"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
