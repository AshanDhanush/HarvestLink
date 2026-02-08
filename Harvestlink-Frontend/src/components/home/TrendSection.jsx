import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../common/ProductCard';

const TrendSection = () => {
    const [activeTab, setActiveTab] = useState("Latest");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const tabs = ["Featured", "Latest", "Popular"];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                // Take only first 6 for the trend section
                setProducts(data.slice(0, 6));
            } catch (error) {
                console.error("Error fetching trend products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-harvest-dark mb-8">"We Love Trend"</h2>

                    <div className="inline-flex bg-gray-200 p-1 rounded-full">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === tab
                                    ? "bg-harvest-dark text-white shadow-md"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {loading ? (
                        <div className="text-center col-span-3">Loading trends...</div>
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard
                                key={product.id || product.tempID}
                                title={product.name}
                                image={product.imageUrl}
                                soldPercentage={65} // Placeholder
                                price={product.price}
                                unit={product.quantity + " Kg"}
                                farmerName={product.farmerName}
                                location={product.location}
                                category={product.category}
                            />
                        ))
                    ) : (
                        <div className="text-center col-span-3">No trending products found.</div>
                    )}
                </div>

                <div className="text-center mt-12">
                    <button className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 px-10 rounded-full shadow-lg shadow-lime-500/30 transition transform hover:scale-[1.02]">
                        Shop More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TrendSection;
