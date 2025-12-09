import React from "react";
import NavBar from "../../components/layout/Navbar";
import TopBar from "../../components/layout/Topbar";
import Footer from "../../components/layout/Footer";
import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import ContactSection from "../../components/home/ContactSection";
import FAQSection from "../../components/contact/FAQSection";

const Home = () => {
  return (
    <>
      <TopBar />
      <NavBar />

      <Hero />
      <Features />
      <FAQSection />
      <ContactSection />
      
      <Footer />
    </>
  );
};

export default Home;
