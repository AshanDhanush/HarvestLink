import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import logoFooter from "../../assets/Logo-D@0.75x.png"; // Importing your specific logo

const Footer = () => {
  return (
    <footer className="bg-harvest-dark text-white pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
         
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img
                src={logoFooter}
                alt="HarvestLink Footer Logo"
                className="h-12 w-auto object-contain"/>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              HarvestLink connects local farmers directly with businesses,
              ensuring fresh produce and fair prices through secure, transparent
              technology.
            </p>
            <div className="flex gap-4">
              <SocialLink Icon={Facebook} />
              <SocialLink Icon={Twitter} />
              <SocialLink Icon={Instagram} />
              <SocialLink Icon={Linkedin} />
            </div>
          </div>

        
          <div className="ml-10">
            <h3 className="text-lg font-bold mb-6 text-harvest-primary">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/" text="Home" />
              <FooterLink to="/search" text="Shop Produce" />
              <FooterLink to="/about" text="About Us" />
              <FooterLink to="/contact" text="Contact Support" />
              <FooterLink to="/login" text="Farmer Login" />
            </ul>
          </div>

          
          <div>
            <h3 className="text-lg font-bold mb-6 text-harvest-primary">
              Contact
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li>
                <span className="block text-white font-semibold mb-1">
                  Head Office
                </span>
                123 Farm Lane, Colombo 07, Sri Lanka
              </li>
              <li>
                <span className="block text-white font-semibold mb-1">
                  Phone
                </span>
                +94 71 234 5678
              </li>
              <li>
                <span className="block text-white font-semibold mb-1">
                  Email
                </span>
                info@harvestlink.lk
              </li>
            </ul>
          </div>

         
          <div>
            <h3 className="text-lg font-bold mb-6 text-harvest-primary">
              Newsletter
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to get updates on new harvest arrivals.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white/10 border border-white/20 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-harvest-primary"
              />
              <button className="bg-harvest-primary text-white font-bold py-2 rounded hover:bg-opacity-90 transition flex justify-center items-center gap-2">
                Subscribe <Send size={16} />
              </button>
            </form>
          </div>
        </div>

    
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} HarvestLink. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-harvest-primary transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-harvest-primary transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};



const SocialLink = ({ Icon }) => (
  <a
    href="#"
    className="bg-white/10 p-2 rounded-full hover:bg-harvest-primary transition text-white"
  >
    <Icon size={18} />
  </a>
);

const FooterLink = ({ to, text }) => (
  <li>
    <Link
      to={to}
      className="text-gray-300 hover:text-harvest-primary transition text-sm"
    >
      {text}
    </Link>
  </li>
);

export default Footer;
