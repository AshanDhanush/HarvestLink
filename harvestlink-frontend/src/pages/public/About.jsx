import React from "react";
import { MapPin, ShieldCheck, Truck, Clock } from "lucide-react";
import TopBar from "../../components/layout/Topbar";
import NavBar from "../../components/layout/Navbar";

const About = () => {
  return (
    <>
      <TopBar />
      <NavBar />

      {/* Hero Section */}
      <div className="bg-harvest-bg-light py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-harvest-dark mb-4">
            Empowering Local Agriculture
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            HarvestLink is a direct Farm-to-Business directory designed to
            bridge the gap between verified farmers and local businesses.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
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
              We aim to eliminate inefficiencies in the supply chain by allowing
              restaurants and grocers to discover fresh produce within a
              specific radius. By removing unnecessary middlemen, we ensure
              farmers get better prices and businesses get fresher ingredients.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform ensures trust through secure escrow payments and
              automated logistics coordination.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-harvest-dark text-center mb-12">
            Why Choose HarvestLink?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <FeatureCard
              icon={<MapPin className="w-8 h-8 text-harvest-primary" />}
              title="Geospatial Discovery"
              desc="Find fresh harvest yields within your local radius instantly."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-harvest-primary" />}
              title="Escrow Payments"
              desc="Your funds are held securely until the delivery is verified."
            />
            <FeatureCard
              icon={<Truck className="w-8 h-8 text-harvest-primary" />}
              title="Integrated Delivery"
              desc="Automated logistics coordination between farmers and buyers."
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-harvest-primary" />}
              title="Real-time Alerts"
              desc="Get notified immediately when your favorite crops are harvested."
            />
          </div>
        </div>
      </div>
    </>
  );
};

// Helper Component
const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 bg-gray-50 rounded-xl text-center hover:shadow-md transition">
    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-harvest-text mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{desc}</p>
  </div>
);

export default About;
