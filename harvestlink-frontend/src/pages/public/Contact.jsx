import React from "react";

import Footer from "../../components/layout/Footer";
import ContactSection from "../../components/home/ContactSection";
import PageHeader from "../../components/common/PageHeader"; // <--- Import
import TopBar from "../../components/layout/Topbar";
import NavBar from "../../components/layout/Navbar";

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen">
    <TopBar />
    <NavBar />

      <main className="flex-grow bg-gray-50">
        {/* Replaced old text header with new PageHeader */}
        <PageHeader title="Contact Us" />

        {/* Reuse the Contact Form Section */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
