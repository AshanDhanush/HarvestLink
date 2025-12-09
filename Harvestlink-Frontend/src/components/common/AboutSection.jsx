import React from "react";
import { CheckCircle2 } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side - Images Grid */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 grid grid-cols-2 gap-4">
               <div className="space-y-4 mt-8">
                  <img 
                    src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=600" 
                    alt="Farmer holding produce" 
                    className="rounded-2xl shadow-lg w-full h-64 object-cover hover:scale-[1.02] transition duration-500"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1595855709940-fa198980af46?auto=format&fit=crop&q=80&w=600" 
                    alt="Fresh crate of vegetables" 
                    className="rounded-2xl shadow-lg w-full h-48 object-cover hover:scale-[1.02] transition duration-500"
                  />
               </div>
               <div className="space-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600" 
                    alt="Green field landscape" 
                    className="rounded-2xl shadow-lg w-full h-48 object-cover hover:scale-[1.02] transition duration-500"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600" 
                    alt="Market display" 
                    className="rounded-2xl shadow-lg w-full h-64 object-cover hover:scale-[1.02] transition duration-500"
                  />
               </div>
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-harvest-primary/5 rounded-full blur-3xl"></div>
          </div>

          {/* Right Side - Content */}
          <div className="w-full lg:w-1/2">
            <div className="mb-6">
                <span className="text-harvest-primary font-bold tracking-widest text-sm uppercase mb-2 block">Our Story</span>
                <h2 className="text-4xl md:text-5xl font-bold text-harvest-dark leading-tight mb-6">
                    Cultivating Connections, <br/> 
                    <span className="text-harvest-primary">Harvesting Trust.</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    HarvestLink was born from a simple yet powerful idea: to bridge the gap between hard-working local farmers and the businesses that value fresh, quality ingredients. We believe in a food system that is transparent, fair, and sustainable.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    By removing unnecessary middlemen, we empower farmers to get fair prices for their harvest while ensuring restaurants and grocers receive the freshest produce possible, often within hours of harvest.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-harvest-primary w-6 h-6 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-bold text-harvest-dark text-lg">100% Traceable</h4>
                        <p className="text-sm text-gray-500">Know exactly where your food comes from.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-harvest-primary w-6 h-6 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-bold text-harvest-dark text-lg">Fair Trade</h4>
                        <p className="text-sm text-gray-500">Supporting local farming communities.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-8 border-t border-gray-100 pt-8">
                <div>
                    <span className="block text-4xl font-bold text-harvest-dark">500+</span>
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Partner Farmers</span>
                </div>
                <div>
                    <span className="block text-4xl font-bold text-harvest-dark">12k+</span>
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Orders Delivered</span>
                </div>
                 <div>
                    <span className="block text-4xl font-bold text-harvest-dark">24h</span>
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Avg. Delivery</span>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
