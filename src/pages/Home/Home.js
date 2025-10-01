import React from "react";
import { Link } from "react-router-dom";
import Banner from "../../components/Banner/Banner";
import BannerBottom from "../../components/Banner/BannerBottom";
import BestSellers from "../../components/home/BestSellers/BestSellers";
import NewArrivals from "../../components/home/NewArrivals/NewArrivals";
import Sale from "../../components/home/Sale/Sale";
import YearProduct from "../../components/home/YearProduct/YearProduct";
import BannerCarousel from "../../components/Banner/BannerCarousal";
import Shades from "../../components/home/Shades/Shades";
import Watches from "../../components/home/Watches/Watches";
import Accessories from "../../components/home/Accessories/Accessories";
import FootwearSection from "../../components/home/FootwearSection/FootwearSection";
import Homewear from "../../components/home/homewear/Homewear";
import ServicesSection from "../../components/serviceSection/ServicesSection";


const Home = () => {
  return (
    <div className="w-full mx-auto">
      <Banner />
      <BannerBottom />
      <div className="max-w-container mx-auto px-4">
        <NewArrivals />

 {/* 2. ADDED "VIEW ALL PRODUCTS" BUTTON HERE */}
        <div className="text-center mt-0 mb-12">
          <Link
            to="/products"
            className="inline-block bg-primeColor text-white px-8 py-3 rounded-lg font-medium hover:bg-transparent border border-primeColor hover:text-primeColor transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            View All Products
          </Link>
        </div>



        <Sale />
       
        <Watches />
        <Shades />
        <BestSellers />
        <BannerCarousel />
        <Accessories />
        <FootwearSection />
        <Homewear />
        <YearProduct />
        <ServicesSection />
      </div>
    </div>
  );
};

export default Home;
