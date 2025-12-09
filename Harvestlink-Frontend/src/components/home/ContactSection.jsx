import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="bg-harvest-bg-light py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-harvest-primary/10 rounded-full mix-blend-multiply filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-harvest-dark/10 rounded-full mix-blend-multiply filter blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-gray-100 p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-2/3">
                    <span className="text-harvest-primary font-bold tracking-widest text-sm uppercase mb-2 block">
                        Get in Touch
                    </span>
                    <h2 className="text-3xl md:text-3xl font-bold mb-4 text-gray-900">
                        Have questions about our produce?
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Whether you are looking for bulk orders, partnership opportunities, or just want to say hi, our team is ready to help you.
                    </p>
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <Mail className="text-harvest-primary" size={20} />
                        <a href="mailto:support@harvestlink.com" className="hover:text-harvest-primary transition">support@harvestlink.com</a>
                    </div>
                </div>
                
                <div className="md:w-1/3 flex justify-center md:justify-end w-full">
                    <Link 
                        to="/contact" 
                        className="bg-harvest-dark hover:bg-harvest-primary text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-harvest-dark/20 transition transform hover:scale-[1.02] flex items-center gap-2 whitespace-nowrap"
                    >
                        Contact Us <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    </section>
  );
};

export default ContactSection;
