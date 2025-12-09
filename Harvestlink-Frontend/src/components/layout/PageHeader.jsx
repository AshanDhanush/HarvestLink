import React from "react";

const PageHeader = ({ title, bgImage }) => {
  // Use a default gradient if no image is provided, effectively a darker placeholder
  const backgroundStyle = bgImage 
    ? { backgroundImage: `url(${bgImage})` } 
    : { backgroundColor: '#1a4e1a' }; // Fallback dark green

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
        <div 
            className="w-full h-48 md:h-64 rounded-3xl relative overflow-hidden flex items-center justify-center"
            style={{
                ...backgroundStyle,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className={`absolute inset-0 ${bgImage ? 'bg-black/40' : ''}`}></div>
            <h1 className="relative z-10 text-4xl md:text-5xl font-bold text-white tracking-widest uppercase">
                {title}
            </h1>
        </div>
    </div>
  );
};

export default PageHeader;
