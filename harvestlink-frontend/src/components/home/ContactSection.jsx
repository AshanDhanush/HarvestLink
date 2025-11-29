import React from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-40">
      <div className="container mx-auto px-4 md:px-8 ">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100  border-t-4 border-t-harvest-dark p-8 md:p-12">
          {/* Header */}
          <h2 className="text-3xl md:text-4xl font-bold text-harvest-dark text-center mb-12">
            "Have questions? Feel free to reach out"
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* LEFT SIDE: Contact Details (Replaces the Image) */}
            <div className="space-y-8 pr-0 md:pr-8">
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether you are a farmer looking to list your harvest or a
                business seeking fresh produce, our support team is here to
                assist you 24/7.
              </p>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-harvest-bg-light text-harvest-dark rounded-full flex items-center justify-center group-hover:bg-harvest-dark group-hover:text-white transition-colors duration-300">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                      Call Us
                    </p>
                    <p className="text-xl font-bold text-harvest-dark">
                      +94 71 234 5678
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-harvest-bg-light text-harvest-dark rounded-full flex items-center justify-center group-hover:bg-harvest-dark group-hover:text-white transition-colors duration-300">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                      Email Support
                    </p>
                    <p className="text-xl font-bold text-harvest-dark">
                      help@harvestlink.lk
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-harvest-bg-light text-harvest-dark rounded-full flex items-center justify-center group-hover:bg-harvest-dark group-hover:text-white transition-colors duration-300">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                      Headquarters
                    </p>
                    <p className="text-xl font-bold text-harvest-dark">
                      123 Farm Lane, Colombo 07
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: The Form */}
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name*"
                  className="w-full border border-gray-400 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-harvest-dark focus:ring-1 focus:ring-harvest-dark transition"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email*"
                  className="w-full border border-gray-400 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-harvest-dark focus:ring-1 focus:ring-harvest-dark transition"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number*"
                  className="w-full border border-gray-400 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-harvest-dark focus:ring-1 focus:ring-harvest-dark transition"
                />
              </div>
              <div>
                <textarea
                  rows="4"
                  placeholder="Enter Your Message*"
                  className="w-full border border-gray-400 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-harvest-dark focus:ring-1 focus:ring-harvest-dark transition resize-none"
                ></textarea>
              </div>

              <button className="w-full bg-harvest-dark text-white font-bold text-lg py-3 rounded-lg hover:bg-opacity-90 transition transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2">
                Send Message <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
