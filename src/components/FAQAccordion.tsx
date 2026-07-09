'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How do I place an order?",
    answer: "Simply add items to your cart and click the WhatsApp order button. We will receive your order directly on WhatsApp and confirm the details with you."
  },
  {
    question: "Do you deliver?",
    answer: "Yes, we offer local delivery. Delivery charges and times will be confirmed when we chat with you on WhatsApp after you place your order."
  },
  {
    question: "Are your cakes eggless?",
    answer: "We have a variety of eggless options available for all our cakes and pastries. Feel free to specify your preference in the WhatsApp message!"
  },
  {
    question: "How much advance notice do you need for large orders?",
    answer: "For standard cakes and small orders, a few hours is usually enough. For large custom orders or party catering, please reach out to us at least 24 to 48 hours in advance."
  },
  {
    question: "Can I customize the cake design?",
    answer: "Absolutely! You can share your design ideas or reference images with us on WhatsApp, and our bakers will work with you to create the perfect cake."
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className="bg-brand-cream/30 rounded-2xl border border-brand-brown/5 overflow-hidden transition-all duration-200"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full p-6 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-tan"
          >
            <span className="font-bold text-lg text-brand-brown flex items-center">
              <HelpCircle className="w-5 h-5 text-brand-tan mr-3 flex-shrink-0" />
              {faq.question}
            </span>
            <ChevronDown 
              className={`w-5 h-5 text-brand-tan transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} 
            />
          </button>
          
          <div 
            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-brand-brown/70 pl-8">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
