import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../components/layout/PageHeader";
import TopBar from "../../components/layout/Topbar";
import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/common/ProductCard";

import PredictForm from "../../components/common/PredictForm";
import { Search, X } from "lucide-react";


const MapPlaceholder = () => (
  <div className="hidden w-full h-[400px] bg-gray-200 rounded-3xl overflow-hidden relative mb-12">
    <img
      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000"
      alt="Farms Map Location"
      className=" w-full h-full object-cover opacity-80"
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

import productService from "../../services/productService";

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Local state for filter inputs
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                setAllProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        const searchParam = searchParams.get("search");

        // Sync local state with URL params
        if (categoryParam) setSelectedCategory(categoryParam);
        if (searchParam) setSearchTerm(searchParam);

        if (allProducts.length > 0) {
            let result = [...allProducts];

            if (categoryParam && categoryParam !== "All Categories") {
                result = result.filter(p =>
                    p.category && p.category.toLowerCase() === categoryParam.toLowerCase()
                );
            }

            if (searchParam) {
                const lowerSearch = searchParam.toLowerCase();
                result = result.filter(p =>
                    (p.name && p.name.toLowerCase().includes(lowerSearch)) ||
                    (p.description && p.description.toLowerCase().includes(lowerSearch))
                );
            }

            setFilteredProducts(result);
        }
    }, [searchParams, allProducts]);

    const handleApplyFilters = () => {
        const params = {};
        if (selectedCategory && selectedCategory !== "All Categories") {
            params.category = selectedCategory;
        }
        if (searchTerm.trim()) {
            params.search = searchTerm.trim();
        }
        setSearchParams(params);
    };

    return (
        <>
            <TopBar />
            <NavBar />

      <PageHeader
        title="Shop"
        bgImage="https://www.britannica.com/topic/vegetable"
      />

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-harvest-dark mb-2">
            "Find Fresh Produce"
          </h2>
        </div>

        {/* Filters Bar */}
        <div className="hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 w-full">
          <div className="grid md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Search Produce
              </label>
              <input
                type="text"
                placeholder="Eg: Tomatoes"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-harvest-primary focus:ring-1 focus:ring-harvest-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Location
              </label>
              <input
                type="text"
                placeholder="Colombo"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-harvest-primary focus:ring-1 focus:ring-harvest-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase flex justify-between">
                <span>Radius: 20km</span>
              </label>
              <div className="h-10 flex items-center">
                <input type="range" className="w-full accent-harvest-dark" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-full space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Categories
                </label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-harvest-primary focus:ring-1 focus:ring-harvest-primary outline-none bg-white">
                  <option>All Categories</option>
                  <option>Vegetables</option>
                  <option>Fruits</option>
                </select>
              </div>
              <button className="h-[42px] w-[42px] flex items-center justify-center bg-gray-100 rounded-lg hover:bg-harvest-primary hover:text-white transition-colors self-end mb-0.5">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-12">
                    {loading ? (
                        <div className="text-center col-span-3">Loading products...</div>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id || product.tempID}
                                id={product.id || product.tempID}
                                title={product.name}
                                image={product.imageUrl}
                                soldPercentage={50} // Placeholder as backend doesn't track sales yet
                                price={product.price}
                                unit={product.quantity + " Kg"} // Displaying quantity as available stock for now
                                farmerName={product.farmerName}
                                location={product.location}
                                category={product.category}
                            />
                        ))
                    ) : (
                        <div className="text-center col-span-3">No products found.</div>
                    )}
                </div>



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
      </div>
      <Footer />
    </>
  );
};

export default Shop;
