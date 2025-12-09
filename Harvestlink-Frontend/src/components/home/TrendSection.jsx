import React, { useState } from "react";
import ProductCard from "../common/ProductCard";

const TrendSection = () => {
  const [activeTab, setActiveTab] = useState("Latest");

  const tabs = ["Featured", "Latest", "Popular"];

  // Mock data for products
  const products = [
    {
      id: 1,
      title: "Tomato",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
      soldPercentage: 10,
      price: 300,
      unit: "1KG",
      rating: 5
    },
    {
        id: 2,
        title: "Tomato",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
        soldPercentage: 10,
        price: 300,
        unit: "1KG",
        rating: 5
    },
    {
        id: 3,
        title: "Tomato",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
        soldPercentage: 10,
        price: 300,
        unit: "1KG",
        rating: 5
    },
    {
        id: 4,
        title: "Tomato",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
        soldPercentage: 10,
        price: 300,
        unit: "1KG",
        rating: 5
    },
    {
        id: 5,
        title: "Tomato",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
        soldPercentage: 10,
        price: 300,
        unit: "1KG",
        rating: 5
    },
    {
        id: 6,
        title: "Tomato",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
        soldPercentage: 10,
        price: 300,
        unit: "1KG",
        rating: 5
    }
  ];

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
                        className={`px-8 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                            activeTab === tab 
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
            {products.map((product) => (
                <ProductCard 
                    key={product.id}
                    title={product.title}
                    image={product.image}
                    soldPercentage={product.soldPercentage}
                    price={product.price}
                    unit={product.unit}
                />
            ))}
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
