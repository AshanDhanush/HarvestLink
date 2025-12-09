import React from "react";
import { Phone, Mail, MapPin, Send, Clock } from "lucide-react";
import TopBar from "../../components/layout/Topbar";
import NavBar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import FAQSection from "../../components/contact/FAQSection";
import PageHeader from "../../components/layout/PageHeader";

const Contact = () => {
  return (
    <>
      <TopBar />
      <NavBar />
      <PageHeader 
          title="Contact Us" 
          bgImage="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1600" 
      />
      
      <div className="bg-gray-50 pb-20">

        <div className="container mx-auto px-4 py-12 -mt-10 relative z-20">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Contact Cards */}
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-100 flex flex-col items-center text-center border border-gray-100 hover:border-harvest-primary/30 transition duration-300">
                <div className="bg-harvest-bg-light p-4 rounded-full mb-4">
                    <Phone className="text-harvest-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-gray-500 mb-1">Mon-Fri from 8am to 5pm</p>
                <a href="tel:+15550000000" className="text-harvest-dark font-semibold text-lg hover:text-harvest-primary transition">+1 (555) 000-0000</a>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-100 flex flex-col items-center text-center border border-gray-100 hover:border-harvest-primary/30 transition duration-300">
                <div className="bg-harvest-bg-light p-4 rounded-full mb-4">
                    <Mail className="text-harvest-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-gray-500 mb-1">Speak to our friendly team</p>
                <a href="mailto:support@harvestlink.com" className="text-harvest-dark font-semibold text-lg hover:text-harvest-primary transition">support@harvestlink.com</a>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-100 flex flex-col items-center text-center border border-gray-100 hover:border-harvest-primary/30 transition duration-300">
                <div className="bg-harvest-bg-light p-4 rounded-full mb-4">
                    <MapPin className="text-harvest-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                <p className="text-gray-500 mb-1">Come say hello at our office</p>
                <span className="text-harvest-dark font-semibold text-lg">123 Farm Lane, Countryside</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Contact Form */}
            <div className="lg:w-2/3 bg-white rounded-3xl shadow-xl shadow-gray-100 p-8 md:p-10 border border-gray-100">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                    <p className="text-gray-500">Fill out the form below and we'll get back to you as soon as possible.</p>
                </div>
                
                <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">First Name</label>
                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-harvest-primary focus:ring-2 focus:ring-harvest-primary/20 outline-none transition bg-gray-50 focus:bg-white" placeholder="John" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Last Name</label>
                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-harvest-primary focus:ring-2 focus:ring-harvest-primary/20 outline-none transition bg-gray-50 focus:bg-white" placeholder="Doe" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-harvest-primary focus:ring-2 focus:ring-harvest-primary/20 outline-none transition bg-gray-50 focus:bg-white" placeholder="name@example.com" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Subject</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-harvest-primary focus:ring-2 focus:ring-harvest-primary/20 outline-none transition bg-gray-50 focus:bg-white">
                            <option>General Inquiry</option>
                            <option>Order Support</option>
                            <option>Partner with us</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Message</label>
                        <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-harvest-primary focus:ring-2 focus:ring-harvest-primary/20 outline-none transition bg-gray-50 focus:bg-white resize-none" placeholder="How can we help you?"></textarea>
                    </div>

                    <button className="bg-harvest-primary hover:bg-harvest-primary-hover text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-harvest-primary/20 transition transform hover:scale-[1.02] flex items-center justify-center gap-2">
                        Send Message <Send size={20} />
                    </button>
                </form>
            </div>

            {/* Support Info Sidebar */}
            <div className="lg:w-1/3 space-y-6">
                <div className="bg-harvest-dark text-white rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Clock size={120} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 relative z-10">Business Hours</h3>
                    <ul className="space-y-3 relative z-10 text-gray-200">
                        <li className="flex justify-between items-center pb-3 border-b border-white/10">
                            <span>Monday - Friday</span>
                            <span className="font-semibold text-white">8:00 AM - 5:00 PM</span>
                        </li>
                        <li className="flex justify-between items-center pb-3 border-b border-white/10">
                            <span>Saturday</span>
                            <span className="font-semibold text-white">9:00 AM - 2:00 PM</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span>Sunday</span>
                            <span className="font-semibold text-harvest-primary">Closed</span>
                        </li>
                    </ul>
                </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
