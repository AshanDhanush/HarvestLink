import React, { useState } from "react";
import { Plus, Minus } from "lucide-react"; // <--- Importing Minus instead of X

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does HarvestLink connect farms to businesses?",
      answer:
        "HarvestLink is a direct directory that allows businesses to discover verified local farmers within a specific radius. You can browse available harvest yields, view pricing, and order directly without unnecessary middlemen.",
    },
    {
      question: "Is my payment secure?",
      answer:
        "Yes. We use a secure Escrow-style payment model. When you pay, the funds are held safely by the admin. The money is only released to the farmer once you verify that you have received the goods in satisfactory condition.",
    },
    {
      question: "Who handles the delivery?",
      answer:
        "We provide integrated logistics coordination. Once an order is confirmed, our system automatically assigns a driver or coordinates the logistics between the Farmer and the Buyer.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Absolutely. Our platform offers real-time tracking updates from 'Picked Up' to 'Delivered'. You will also receive an OTP to confirm secure receipt of your delivery.",
    },
    {
      question: "How do I know the produce is fresh?",
      answer:
        "Farmers list their 'Upcoming Harvests' with specific dates. This allows you to pre-order produce that is harvested specifically for your order.",
    },
  ];

  return (
    <section className="py-16 pt-30 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        <h2 className="text-3xl md:text-4xl font-bold text-harvest-dark text-center mb-10">
          "Got Questions? We've Got You Covered"
        </h2>

        
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen ? "border-harvest-primary" : "border-harvest-dark"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none bg-white"
                >
                  <span className="font-medium text-lg text-gray-900 pr-8 leading-snug">
                    {faq.question}
                  </span>

                  
                  <span
                    className={`p-1 rounded-lg shrink-0 flex items-center justify-center transition-colors duration-300 ${
                      isOpen
                        ? "bg-harvest-primary text-white"
                        : "bg-harvest-dark text-white"
                    }`}
                  >
                    
                    {isOpen ? (
                      <Minus size={24} strokeWidth={3} />
                    ) : (
                      <Plus size={24} strokeWidth={3} />
                    )}
                  </span>
                </button>

              
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-5 pt-0 text-gray-500 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
