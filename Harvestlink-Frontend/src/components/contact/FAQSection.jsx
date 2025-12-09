import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div 
      className={`border-2 rounded-2xl transition-all duration-300 ${
        isOpen ? "border-harvest-dark bg-white shadow-md" : "border-harvest-dark bg-white hover:bg-gray-50"
      }`}
    >
      <div 
        className="p-5 flex items-center justify-between cursor-pointer"
        onClick={onClick}
      >
        <h3 className="text-gray-900 font-bold text-lg pr-8 leading-snug">
          {question}
        </h3>
        <button 
          className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
            isOpen ? "bg-harvest-dark text-white" : "bg-harvest-dark text-white"
          }`}
        >
          {isOpen ? <X size={20} /> : <Plus size={20} />}
        </button>
      </div>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-transparent">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default or -1 for none

  const faqs = [
    {
      question: "Here's How HarvestLink Brings Farm-Fresh Produce Directly To Your Business, Simply And Securely.",
      answer: "We connect local farmers directly with businesses, handling logistics and payments to ensure fresh produce is delivered efficiently. Our platform guarantees transparency and fair pricing for both parties."
    },
    {
      question: "How do I become a verified supplier on HarvestLink?",
      answer: "To become a supplier, register as a Farmer during signup. You'll need to provide verification documents. Once approved, you can list your produce immediately."
    },
    {
      question: "What areas do you currently cover for delivery?",
      answer: "We currently cover the greater metropolitan area and surrounding rural districts. Check our delivery map or contact support to confirm if we service your specific location."
    },
    {
      question: "Is there a minimum order quantity for buyers?",
      answer: "Minimum order quantities vary by farmer and product type to ensure shipping efficiency. You can view the specific MOQ on each product listing page."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards, bank transfers, and secure online payment methods. All transactions are protected by industry-standard encryption."
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
       <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-harvest-dark mb-4 drop-shadow-sm">
                "Got Questions? We've Got You Covered"
            </h2>
       </div>

       <div className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
       </div>
    </div>
  );
};

export default FAQSection;
