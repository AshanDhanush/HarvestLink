import React from "react";
import {
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-harvest-dark text-white py-2 text-sm">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
      
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 hover:text-harvest-primary transition cursor-pointer">
            <Phone size={16} />
            <span>+94 71 234 5678</span>
          </div>
          <div className="flex items-center gap-2 hover:text-harvest-primary transition cursor-pointer">
            <Mail size={16} />
            <span>info@harvestlink.lk</span>
          </div>
        </div>

       
        <div className="flex items-center gap-4">
          
          <SocialIcon Icon={Facebook} />
          <SocialIcon Icon={Twitter} />
          <SocialIcon Icon={Instagram} />
          <SocialIcon Icon={Linkedin} />
        </div>
      </div>
    </div>
  );
};


const SocialIcon = ({ Icon }) => (
  <a
    href="#"
    className="bg-white/20 hover:bg-harvest-primary p-1.5 rounded-full transition duration-300 ease-in-out"
  >
    <Icon size={14} className="text-white" />
  </a>
);

export default TopBar;
