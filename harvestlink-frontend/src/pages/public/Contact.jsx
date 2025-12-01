import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import TopBar from "../../components/layout/Topbar";
import NavBar from "../../components/layout/Navbar";

const Contact = () => {
  return (
    <>
      <TopBar />
      <NavBar />
      <div className="container mx-auto px-4 py-16">
        {/* Navbar removed. Just the page content here. */}
        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {/* ... rest of your code ... */}
        </div>
      </div>
    </>
  );
};

export default Contact;
