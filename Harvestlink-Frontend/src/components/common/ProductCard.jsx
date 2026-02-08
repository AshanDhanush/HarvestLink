import React from "react";
import { Star, Heart, ShoppingCart } from "lucide-react";

import { useNavigate } from "react-router-dom";

const ProductCard = ({ id, image, title, soldPercentage, price, unit, farmerName, location, category }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    if (id) {
      navigate(`/product/${id}`);
    }
  };

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-100 border border-gray-100 hover:shadow-xl transition duration-300 group cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={image || "https://placehold.co/600x400?text=No+Image"}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-harvest-dark shadow-sm">
          {category || 'Great'}
        </div>
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 shadow-sm transition-colors duration-300 backdrop-blur-sm">
          <Heart size={20} />
        </button>
      </div>

      <div className="p-6 text-center">
        <h3 className="text-xl font-medium text-gray-800 mb-1">{title}</h3>

        <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide flex justify-center gap-2">
          {farmerName && <span>by {farmerName}</span>}
          {location && (
            <>
              <span>|</span>
              <span>{location}</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-1 mb-3 text-yellow-400 text-xs">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill="currentColor" />
          ))}
        </div>

        <div className="flex items-center justify-center gap-1 mb-4">
          <span className="text-lg font-bold text-gray-900">LKR {price}</span>
          <span className="text-xs text-gray-400 font-medium">PER 1KG</span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleProductClick();
            }}
            className="px-8 py-2 border-2 border-gray-300 text-gray-600 font-bold rounded-full hover:border-harvest-primary hover:text-harvest-primary hover:bg-white transition-colors text-sm"
          >
            Buy Now
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full border-2 border-gray-300 text-gray-600 hover:border-harvest-primary hover:text-harvest-primary hover:bg-white transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
