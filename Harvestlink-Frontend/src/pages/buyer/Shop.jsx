import React, { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import TopBar from "../../components/layout/Topbar";
import NavBar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/common/ProductCard";
// 1. Import the AI Component 👇
import PredictForm from "../../components/common/PredictForm";
import { Search, X } from "lucide-react";

// Placeholder for map - in real app would use Google Maps or Leaflet
const MapPlaceholder = () => (
    <div className="w-full h-[400px] bg-gray-200 rounded-3xl overflow-hidden relative mb-12">
        <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
            alt="Farms Map Location" 
            className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
             {/* Simple visual representation of map markers */}
             <div className="relative w-full h-full">
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                     <span className="text-4xl">📍</span>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                     <span className="text-4xl scale-125">📍</span>
                </div>


                <div className="absolute bottom-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                     <span className="text-4xl">📍</span>
                </div>
             </div>
        </div>
    </div>
);

const Shop = () => {
    const [isGlobalPredictOpen, setIsGlobalPredictOpen] = useState(false);

    



   
  const products = Array(9).fill({
    id: 1,
    title: "Tomato", 
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
    soldPercentage: 10,
    price: 300,
    unit: "1KG",
    rating: 5
  }).map((p, i) => ({ ...p, id: i + 1 }));

  return (
    <>
      <TopBar />
      <NavBar />
      
      <PageHeader 
        title="Shop" 
        bgImage="https://images.unsplash.com/photo-1625246333195-098e98e2f8ec?auto=format&fit=crop&q=80&w=1600"
      />

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-harvest-dark mb-2">"Find Fresh Produce"</h2>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 w-full">
            <div className="grid md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Search Produce</label>
                    <input type="text" placeholder="Eg: Tomatoes" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-harvest-primary focus:ring-1 focus:ring-harvest-primary outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Location</label>
                    <input type="text" placeholder="Colombo" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-harvest-primary focus:ring-1 focus:ring-harvest-primary outline-none" />
                </div>
                <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase flex justify-between">
                          <span>Radius: 20km</span>
                      </label>
                      <div className="h-10 flex items-center">
                          <input type="range" className="w-full accent-harvest-dark" />
                      </div>
                </div>
                    <div className="flex gap-2 items-center">
                    <div className="w-full space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Categories</label>
                        <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-harvest-primary focus:ring-1 focus:ring-harvest-primary outline-none bg-white">
                            <option>All Categories</option>
                            <option>Vegetables</option>
                            <option>Fruits</option>
                        </select>
                    </div>
                    <button className="h-[42px] w-[42px] flex items-center justify-center bg-gray-100 rounded-lg hover:bg-harvest-primary hover:text-white transition-colors self-end mb-0.5">
                        <Search size={20} />
                    </button>
                    <button onClick={() => setIsGlobalPredictOpen(true)} className="ml-3 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">Predict Price</button>
                </div>
            </div>
        </div>

        <MapPlaceholder />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-12">
             {products.map((product) => (
                <div key={product.id} className="flex flex-col gap-3">
                    <ProductCard 
                        title={product.title}
                        image={product.image}
                        soldPercentage={product.soldPercentage}
                        price={product.price}
                        unit={product.unit}
                    />
                </div>
            ))}
        </div>

                {/* Per-product predictor removed — use global Predict Form above */}

                {/* Global Predict Form Modal */}
                {isGlobalPredictOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
                            <button onClick={() => setIsGlobalPredictOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                                <X size={18} />
                            </button>
                            <h3 className="text-lg font-bold mb-4">Predict Price</h3>
                            <PredictForm onClose={() => setIsGlobalPredictOpen(false)} />
                        </div>
                    </div>
                )}

                

                {/* Pagination */}
                <div className="flex justify-center mb-16">
            <div className="inline-flex items-center border-2 border-gray-300 rounded-full px-6 py-2 bg-white text-sm font-bold text-gray-600">
                <button className="hover:text-harvest-primary mr-2">Next</button>
                <span className="mx-1 text-gray-400">|</span>
                <button className="mx-2 text-harvest-dark">1</button>
                <button className="mx-2 hover:text-harvest-primary">2</button>
                <button className="mx-2 hover:text-harvest-primary">3</button>
                <button className="mx-2 hover:text-harvest-primary">4</button>
                <span className="mx-1 text-gray-400">|</span>
                <span className="mx-2">5</span>
                <span className="mx-1 text-gray-400">|</span>
                <button className="hover:text-harvest-primary ml-2">Prev</button>
            </div>
        </div>
        
                {/* Saved predictions UI removed — saving disabled */}

            </div>
      <Footer />
    </>
  );
};

export default Shop;