import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import farmerBG from "../../assets/farmer-bg.png";

const Hero = () => {
  return (
    <div className="container mx-auto px-4 md:px-8 mt-6 mb-8">
      <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[80vh] flex items-center">
        {/* 1. Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${farmerBG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl px-8 md:px-16 text-white">
          <span className="text-harvest-primary font-bold tracking-widest text-sm uppercase mb-2 block">
            Connecting
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            LOCAL FARMS <span className="font-light">WITH</span>
            <br />
            <span className="text-harvest-primary">LOCAL BUSINESSES</span>
          </h1>

          <p className="text-gray-200 text-lg mb-8 max-w-lg">
            Discover Fresh, Local Produce Directly From The Source. Sourced
            sustainably, delivered efficiently.
          </p>

          <Link
            to="/shop"
            className="bg-harvest-primary text-white font-bold py-4 px-8 rounded-full inline-flex items-center gap-2 hover:bg-harvest-primary-hover transition transform hover:scale-105 shadow-lg shadow-lime-900/20"
          >
            Shop Now <ArrowRight size={20} />
          </Link>

          <div className="flex items-center gap-1 mt-8 text-yellow-400">
            <span>★★★★★</span>
            <span className="text-xs text-gray-300 ml-2">
              Trusted by 500+ Local Farmers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
