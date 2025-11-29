import React from "react";
import { MapPin, ShieldCheck, Truck, Clock } from "lucide-react";

import Footer from "../../components/layout/Footer";
import PageHeader from "../../components/common/PageHeader"; // <--- Import
import TopBar from "../../components/layout/Topbar";
import NavBar from "../../components/layout/Navbar";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
     <TopBar />
     <NavBar />
      <main className="flex-grow">
        <PageHeader title="About Us" />

        {/* Mission Section */}
        <div className="container mx-auto px-4 py-8">
          {/* ... (Keep your existing mission content here) ... */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800"
                alt="Farmer in field"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-harvest-dark mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We aim to eliminate inefficiencies in the supply chain by
                allowing restaurants and grocers to discover fresh produce
                within a specific radius.
              </p>
              <p className="text-gray-600 leading-relaxed">
                HarvestLink ensures verified farmers get fair prices and
                businesses get the freshest ingredients.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid (Re-added for context) */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-harvest-dark text-center mb-12">
              Why Choose HarvestLink?
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <FeatureCard
                icon={<MapPin className="w-8 h-8 text-harvest-primary" />}
                title="Geospatial Discovery"
                desc="Find fresh harvest yields nearby."
              />
              <FeatureCard
                icon={<ShieldCheck className="w-8 h-8 text-harvest-primary" />}
                title="Escrow Payments"
                desc="Secure transactions via admin trust anchor."
              />
              <FeatureCard
                icon={<Truck className="w-8 h-8 text-harvest-primary" />}
                title="Integrated Delivery"
                desc="Automated logistics coordination."
              />
              <FeatureCard
                icon={<Clock className="w-8 h-8 text-harvest-primary" />}
                title="Real-time Alerts"
                desc="Instant notifications for new crops."
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Helper Component
const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 bg-white rounded-xl text-center shadow-sm hover:shadow-md transition">
    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-harvest-text mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{desc}</p>
  </div>
);

export default About;
