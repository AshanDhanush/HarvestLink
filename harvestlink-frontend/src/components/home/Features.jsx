import React from "react";
import { Leaf, Utensils, ShieldCheck, Truck } from "lucide-react";

const Features = () => {
  const steps = [
    {
      id: 1,
      icon: <Leaf className="w-16 h-16 text-harvest-dark" />,
      title: "Farmers List",
      subtitle: "Available Harvests",
      desc: "Farmers list their upcoming yields with pricing and harvest dates.",
    },
    {
      id: 2,
      icon: <Utensils className="w-16 h-16 text-harvest-dark" />,
      title: "Businesses",
      subtitle: "Discover & Order",
      desc: "Restaurants and grocers find fresh produce nearby and place orders.",
    },
    {
      id: 3,
      icon: <ShieldCheck className="w-16 h-16 text-harvest-dark" />,
      
      title: "Secure Transaction",
      subtitle: "Via Gateway",
      desc: "Payments are held securely in escrow until delivery is confirmed.",
    },
    {
      id: 4,
      icon: <Truck className="w-16 h-16 text-harvest-dark" />,
      title: "Enjoy Fresh, Local",
      subtitle: "Delivery",
      desc: "Logistics are coordinated automatically for doorstep delivery.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
       
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-3xl font-bold text-harvest-dark mb-4 drop-shadow-sm">
            "Seamless Sourcing, Freshly Delivered."
          </h2>
          <p className="text-gray-600 text-sm md:text-base font-medium">
            Here's How HarvestLink Brings Farm-Fresh Produce <br className="hidden md:block"/> Directly To Your Business, Simply And Securely.
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className="group bg-white border-2 border-harvest-dark rounded-xl p-6 flex flex-col items-center text-center hover:shadow-xl hover:border-harvest-primary transition-all duration-300 transform hover:-translate-y-1 h-full"
            >
              
              <div className="mb-4">
                {step.icon}
              </div>

              
              <h3 className="text-sm font-bold text-harvest-dark leading-tight">
                {step.title} <br /> {step.subtitle}
              </h3>

              {/* Description kept but hidden or small if needed, styling as per request for cards */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
