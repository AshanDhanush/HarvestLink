import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/Topbar';
import NavBar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PageHeader from '../../components/layout/PageHeader';
import ProductCard from '../../components/common/ProductCard';
import wishlistService from '../../services/wishlistService';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await wishlistService.getWishlist();
        setWishlistItems(data);
      } catch (err) {
        console.error("Failed to load wishlist", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />
      <NavBar />
      
      <PageHeader 
        title="My Wishlist" 
        bgImage="https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-12 flex-1">
        
        {loading ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-harvest-primary"></div>
           </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <ProductCard
                key={item.productId}
                id={item.productId}
                title={item.productName}
                image={item.productImage}
                price={item.price}
                // These might be missing if not stored in wishlist, fallback or fetch needed ideally
                category="Saved" 
                farmerName="" // Not stored in simple wishlist model
                unit="Kg"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 text-gray-400 mb-6">
              <Heart size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-8">Save items you love here to buy later.</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-harvest-primary text-white font-bold rounded-lg hover:bg-harvest-dark transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
