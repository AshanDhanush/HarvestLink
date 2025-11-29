import React from "react";
// We use the same farmer image as default, but you can pass a specific one if needed
import defaultBG from "../../assets/farmer-bg.png";

const PageHeader = ({ title, bgImage }) => {
  return (
    <div className="container mx-auto px-4 md:px-8 mt-6 mb-12">
      <div className="relative rounded-3xl overflow-hidden shadow-lg h-48 md:h-64 flex items-center justify-center">
        {/* 1. Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${bgImage || defaultBG})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%", // Adjusted to show the face/hat better in short banner
          }}
        >
          {/* Dark Overlay (Darker than hero to make white text pop) */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* 2. Title Text */}
        <h1 className="relative z-10 text-white text-3xl md:text-5xl font-bold uppercase tracking-[0.2em] text-center">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default PageHeader;
