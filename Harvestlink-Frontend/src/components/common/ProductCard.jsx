import React from "react";
import { Star, Heart } from "lucide-react";

const ProductCard = ({ image, title, soldPercentage, price, unit }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-100 border border-gray-100 hover:shadow-xl transition duration-300 group">
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
        />
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 shadow-sm transition-colors duration-300 backdrop-blur-sm">
            <Heart size={20} />
        </button>
      </div>
      
      <div className="p-6 text-center">
        <h3 className="text-xl font-medium text-gray-800 mb-1">{title}</h3>
        
        <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
          <span className="font-semibold text-gray-500">{soldPercentage}% Sold</span>
           <span className="mx-2">|</span>
           <span>MAXMART</span>
        </div>

        <div className="flex items-center justify-center gap-1 mb-3 text-yellow-400 text-xs">
             {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
             ))}
        </div>

        <div className="flex items-center justify-center gap-1 mb-4">
            <span className="text-lg font-bold text-gray-900">LKR {price}</span>
            <span className="text-xs text-gray-400 font-medium">PER {unit}</span>
        </div>

        <button className="px-8 py-2 border-2 border-gray-300 text-gray-600 font-bold rounded-full hover:border-harvest-primary hover:text-harvest-primary hover:bg-white transition-colors text-sm">
            Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
