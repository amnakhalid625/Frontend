import React from "react";
import { Link } from "react-router-dom";
import { productOfTheYear } from "../../../assets/images";
import Image from "../../designLayouts/Image";
import img from '../../../assets/images/productOfTheYear.avif'


const YearProduct = () => {
  return (
    <Link to="/shop">
      <div className="w-full h-80 mb-20 bg-[#f9f9f9] md:bg-transparent relative font-titleFont rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500">
        
        {/* Background Image */}
        <img src={img}
          className="w-full h-full object-cover hidden md:inline-block"
        />

        {/* Text Content */}
        <div className="w-full md:w-2/3 xl:w-1/2 h-80 absolute px-6 md:px-10 top-0 right-0 flex flex-col items-start gap-5 justify-center bg-gradient-to-r from-white/90 via-white/70 to-transparent">
          <h1 className="text-3xl lg:text-4xl font-bold text-black leading-snug">
            Product of the Year
          </h1>

          <p className="text-base lg:text-lg text-gray-700 max-w-[600px]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
            Repellat cupiditate modi amet! Facilis, aperiam quaerat.
          </p>

          <button className="bg-primeColor text-white px-6 py-2 rounded-lg shadow-md hover:bg-primeColor/90 transition-colors duration-300">
            Shop Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default YearProduct;
