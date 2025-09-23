import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSaleSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Custom CSS for primeColor
  useEffect(() => {
    const style = document.createElement('style');
   
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Hero slider data
  const heroSlides = [
    {
      id: 1,
      image: "https://serviceapi.spicezgold.com/download/1756273096312_1737036773579_sample-1.jpg",
      badge: "Big saving days sale",
      title: "Apple iPhone 15 Pro Max 256GB, Natural Titanium",
      price: "₹1,34,900.00",
      link: "/product/iphone-15-pro-max"
    },
    {
      id: 2,
      image: "https://serviceapi.spicezgold.com/download/1742441193376_1737037654953_New_Project_45.jpg",
      badge: "Special Offer",
      title: "Premium Fashion Collection - Women's Designer Wear",
      price: "₹2,499.00",
      link: "/product/womens-fashion"
    },
   
  ];

  // Side banners data
  const sideBanners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=250&fit=crop",
      title: "Buy Men's Footwear with low price",
      price: "₹1,500",
      link: "/products?category=mens-footwear",
      bgColor: "bg-blue-50",
      textAlign: "right"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=250&fit=crop",
      title: "Premium Smartphones Collection",
      price: "₹25,999",
      link: "/products?category=smartphones",
      bgColor: "bg-green-50",
      textAlign: "left"
    }
  ];

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleProductClick = (link) => {
    alert(`Redirecting to: ${link}`);
  };

  return (
    <section className="py-6 pt-0 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-5">
          
          {/* Main Hero Slider - 70% width */}
          <div className="w-full lg:w-[70%]">
            <div className="relative rounded-md overflow-hidden group">
              
              {/* Slides Container */}
              <div className="relative h-[300px] sm:h-[400px] lg:h-[450px] overflow-hidden">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === activeSlide 
                        ? 'opacity-100 transform translate-x-0' 
                        : 'opacity-0 transform translate-x-full'
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent">
                        <div className="absolute top-0 right-0 w-full sm:w-[60%] lg:w-[50%] h-full z-50 p-4 sm:p-6 lg:p-8 flex items-center flex-col justify-center">
                          
                          {/* Badge */}
                          <h4 className="text-xs sm:text-sm lg:text-lg font-medium w-full text-right mb-2 lg:mb-3 text-black hidden sm:block">
                            {slide.badge}
                          </h4>
                          
                          {/* Title */}
                          <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold w-full text-right text-black leading-tight mb-3">
                            {slide.title}
                          </h2>
                          
                          {/* Price */}
                          <h3 className="flex items-center justify-end gap-2 text-xs sm:text-sm lg:text-lg font-medium w-full text-right mt-2 mb-3 lg:mb-4 flex-col sm:flex-row">
                            <span className="text-black hidden lg:block">Starting At Only</span>
                            <span className="text-primeColor text-lg sm:text-xl lg:text-2xl  font-bold ">
                              {slide.price}
                            </span>
                          </h3>
                          
                          {/* CTA Button */}
                          {/* <div className="w-full flex justify-end">
                            <button
                              onClick={() => handleProductClick(slide.link)}
                              className="btn-primary bg-primeColor text-white text-sm lg:text-base"
                            >
                              SHOP NOW
                            </button>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 lg:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
              >
                <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 lg:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
              >
                <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                      index === activeSlide 
                        ? 'bg-primeColor scale-125' 
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Side Banners - 30% width */}
          <div className="w-full lg:w-[30%] flex flex-row lg:flex-col gap-5">
            {sideBanners.map((banner, index) => (
              <div 
                key={banner.id}
                className="w-full overflow-hidden rounded-md group relative cursor-pointer"
                onClick={() => handleProductClick(banner.link)}
              >
                <div className="relative h-[150px] sm:h-[180px] lg:h-[200px]">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
                    <div className={`absolute p-4 lg:p-5 top-0 ${
                      banner.textAlign === 'right' ? 'right-0 text-right' : 'left-0 text-left'
                    } w-[70%] h-full z-50 flex items-center justify-center flex-col gap-2`}>
                      
                      <h2 className="text-xs sm:text-sm lg:text-base font-semibold text-black leading-tight">
                        {banner.title}
                      </h2>
                      
                      <span className="text-base sm:text-lg lg:text-xl text-primeColor font-bold w-full  px-2 py-1 rounded-md inline-block">
                        {banner.price}
                      </span>
                      
                      {/* <div className="w-full">
                         <button
                             
                              className="btn-primary bg-primeColor text-white text-sm lg:text-base"
                            >
                              SHOP NOW
                            </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSaleSection;