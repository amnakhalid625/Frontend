import React from "react";
import { Truck, RotateCcw, CreditCard, Gift, Headphones } from "lucide-react";

const services = [
  {
    id: 1,
    icon: <Truck className="w-8 h-8" />,
    title: "Free Shipping",
    subtitle: "Orders Over $100",
  },
  {
    id: 2,
    icon: <RotateCcw className="w-8 h-8" />,
    title: "30 Days Returns",
    subtitle: "Easy Exchange",
  },
  {
    id: 3,
    icon: <CreditCard className="w-8 h-8" />,
    title: "Secured Payment",
    subtitle: "Cards Accepted",
  },
  {
    id: 4,
    icon: <Gift className="w-8 h-8" />,
    title: "Special Gifts",
    subtitle: "First Order",
  },
  {
    id: 5,
    icon: <Headphones className="w-8 h-8" />,
    title: "Support 24/7",
    subtitle: "Contact Anytime",
  },
];

const ServicesSection = () => {
  return (
    <div className="w-full py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center cursor-pointer border border-gray-100 group"
          >
            <div className="text-primeColor group-hover:scale-110 transition-transform mb-4">
              {service.icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{service.title}</h3>
            <p className="text-xs text-gray-600 mt-1">{service.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
