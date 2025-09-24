import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart, Shuffle, Expand, Loader } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart as addToCartAction, toggleWishlist as toggleWishlistAction } from "../../redux/orebiSlice";
import { useAddToCart, useAddToWishlist } from "../../api/internal";

const ProductSection = ({ title, subtitle, products, loading, className }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlist, userInfo } = useSelector((state) => state.orebiReducer);
  const { addToCart } = useAddToCart();
  const { toggleWishlist } = useAddToWishlist();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef(null);
  
  // Responsive items per slide
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  
  // Update items per slide based on screen size
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1); // Mobile - only 1 card
      } else if (window.innerWidth < 768) {
        setItemsPerSlide(2); // Small tablet
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(3); // Tablet
      } else {
        setItemsPerSlide(4); // Desktop
      }
    };

    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);
  
  // Only enable infinite scroll if we have more products than can fit in one view
  const shouldUseInfiniteScroll = products && products.length > itemsPerSlide;
  
  // For infinite scroll, duplicate products to create seamless loop
  const infiniteProducts = shouldUseInfiniteScroll 
    ? [...products, ...products, ...products]
    : products || [];

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = async (product) => {
    try {
      // The image path in Redux needs the full URL to be displayed in the cart/header
      const imageUrl = (product.images && product.images.length > 0) ? `https://backend-production-5823.up.railway.app/${product.images[0]}` : "https://via.placeholder.com/100";
      await addToCart(product._id, 1, userInfo);
      dispatch(
        addToCartAction({
          ...product,
          _id: product._id,
          image: imageUrl,
          quantity: 1,
        })
      );
      toast.success("Added to cart!");
    } catch (error) {
      const message = error.response?.data?.message || "Please login to add items to your cart.";
      toast.error(message);
    }
  };

  const handleToggleWishlist = async (product) => {
    try {
      const imageUrl = (product.images && product.images.length > 0) ? `https://backend-production-5823.up.railway.app/${product.images[0]}` : "https://via.placeholder.com/100";
      await toggleWishlist(product._id, userInfo);
      dispatch(
        toggleWishlistAction({
          ...product,
          _id: product._id,
          image: imageUrl,
        })
      );
      toast.success("Wishlist updated!");
    } catch (error) {
      const message = error.response?.data?.message || "Please login to update your wishlist.";
      toast.error(message);
    }
  };

  const moveToSlide = (index, withTransition = true) => {
    if (sliderRef.current) {
      sliderRef.current.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
      sliderRef.current.style.transform = `translateX(-${(index * 100) / itemsPerSlide}%)`;
    }
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    
    if (!shouldUseInfiniteScroll) {
      // Regular finite slider
      const maxIndex = Math.max(0, products.length - itemsPerSlide);
      const nextIndex = Math.min(currentIndex + 1, maxIndex);
      setIsTransitioning(true);
      moveToSlide(nextIndex);
      setTimeout(() => setIsTransitioning(false), 500);
      return;
    }

    setIsTransitioning(true);
    const nextIndex = currentIndex + 1;
    moveToSlide(nextIndex);

    // When we reach the end of the second copy, jump back to the start of the first copy
    if (nextIndex >= products.length * 2) {
      setTimeout(() => {
        moveToSlide(products.length, false); // Jump to start of second copy without animation
        setIsTransitioning(false);
      }, 500);
    } else {
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    if (!shouldUseInfiniteScroll) {
      // Regular finite slider
      const prevIndex = Math.max(0, currentIndex - 1);
      setIsTransitioning(true);
      moveToSlide(prevIndex);
      setTimeout(() => setIsTransitioning(false), 500);
      return;
    }

    setIsTransitioning(true);
    const prevIndex = currentIndex - 1;

    // When we go below the first copy, jump to the end of the second copy
    if (prevIndex < products.length) {
      moveToSlide(products.length * 2 - 1, false); // Jump to end of second copy without animation
      setTimeout(() => {
        moveToSlide(products.length * 2 - 2); // Then slide to the previous position
        setTimeout(() => setIsTransitioning(false), 500);
      }, 10);
    } else {
      moveToSlide(prevIndex);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Initialize infinite slider position
  useEffect(() => {
    if (shouldUseInfiniteScroll && products) {
      // Start at the beginning of the second copy (middle of our tripled array)
      moveToSlide(products.length, false);
    }
  }, [shouldUseInfiniteScroll, products?.length, itemsPerSlide]);

  // Auto-play slider
  useEffect(() => {
    if (shouldUseInfiniteScroll && products) {
      const interval = setInterval(() => {
        if (!isTransitioning) {
          nextSlide();
        }
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [shouldUseInfiniteScroll, isTransitioning, currentIndex, products, itemsPerSlide]);

  // Get the current slide index for dot indicators (based on original products)
  const getCurrentSlideIndex = () => {
    if (!shouldUseInfiniteScroll || !products) {
      return Math.floor(currentIndex / itemsPerSlide);
    }
    return Math.floor((currentIndex % products.length) / itemsPerSlide);
  };

  // Calculate total slides for dot indicators
  const totalSlides = products ? Math.ceil(products.length / itemsPerSlide) : 1;

  if (loading) {
    return (
      <div className={`mb-8 md:mb-12 lg:mb-16 mx-auto max-w-7xl px-4 ${className || ""}`}>
        <div className="mb-6 md:mb-8 text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600 text-sm md:text-base">{subtitle}</p>}
        </div>
        <div className="relative h-64 md:h-80 lg:h-96 flex items-center justify-center">
          <Loader className="w-8 h-8 md:w-10 md:h-10 animate-spin text-primeColor" />
        </div>
      </div>
    );
  }

  // Return null if there are no products to display after loading
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={`mb-8 md:mb-12 lg:mb-16 mx-auto max-w-7xl px-4 ${className || ""}`}>
      <div className="mb-6 md:mb-8 text-center">
        <h2 className="text-xl md:text-2xl lg:text-4xl font-extrabold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600 text-sm md:text-lg">{subtitle}</p>}
      </div>
      
      <div className="relative">
        <div className="overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-b from-gray-50/30 to-transparent p-3 md:p-4 lg:p-6">
          <div 
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
          >
            {infiniteProducts.map((product, index) => {
              const isWishlisted = wishlist.some((p) => p._id === product._id);
              const imageUrl = (product.images && product.images.length > 0)
                ? `https://backend-production-5823.up.railway.app/${product.images[0]}`
                : "https://via.placeholder.com/400?text=No+Image";

              return (
                <div key={`${product._id}-${index}`} className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 px-1 md:px-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg border border-gray-100/50 transition-all duration-300 overflow-hidden group hover:-translate-y-1 md:hover:-translate-y-2 hover:bg-white">
                    <div className="relative overflow-hidden cursor-pointer" onClick={() => handleProductClick(product)}>
                      <img src={imageUrl} alt={product.name} className="w-full h-48 md:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                      {product.discount && (
                        <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-gradient-to-r from-primeColor to-primeColor/90 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                          -{product.discount}%
                        </div>
                      )}
                      <div className="absolute top-2 md:top-4 right-2 md:right-4 flex flex-col gap-2 md:gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <button
                          className="bg-white/90 backdrop-blur-sm p-2 md:p-2.5 rounded-full shadow-sm hover:shadow-md border border-gray-100/50 hover:bg-white transition-all duration-200 hover:scale-105"
                          onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                        >
                          <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isWishlisted ? "text-red-500 fill-current" : "text-gray-600"}`} />
                        </button>
                        <button className="bg-white/90 backdrop-blur-sm p-2 md:p-2.5 rounded-full shadow-sm hover:shadow-md border border-gray-100/50 hover:bg-white transition-all duration-200 hover:scale-105" onClick={(e) => e.stopPropagation()}>
                          <Shuffle className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
                        </button>
                        <button className="bg-white/90 backdrop-blur-sm p-2 md:p-2.5 rounded-full shadow-sm hover:shadow-md border border-gray-100/50 hover:bg-white transition-all duration-200 hover:scale-105" onClick={(e) => e.stopPropagation()}>
                          <Expand className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 md:p-4 lg:p-5 cursor-pointer" onClick={() => handleProductClick(product)}>
                      <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 line-clamp-2 h-10 md:h-12 leading-tight text-sm md:text-base">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-2 md:mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 md:w-3.5 md:h-3.5 ${i < Math.floor(product.averageRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                        ))}
                        <span className="text-xs text-gray-500 ml-1 md:ml-1.5">({product.reviews?.length || 0})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <span className="text-lg md:text-xl font-bold text-gray-900">Rs. {product.price?.toLocaleString() || 0}</span>
                        {product.originalPrice > product.price && <span className="text-sm text-gray-400 line-through">Rs. {product.originalPrice?.toLocaleString() || 0}</span>}
                      </div>
                      <button
                        className="w-full border border-primeColor text-primeColor py-2 md:py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:bg-primeColor hover:text-white duration-300 text-sm md:text-base"
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {shouldUseInfiniteScroll && (
          <>
            <button
              onClick={prevSlide}
              className="absolute -left-1 md:-left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 md:p-3 hover:bg-white transition-all duration-300 hover:scale-105 border border-gray-100/50"
              disabled={isTransitioning}
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute -right-1 md:-right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 md:p-3 hover:bg-white transition-all duration-300 hover:scale-105 border border-gray-100/50"
              disabled={isTransitioning}
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </button>
          </>
        )}
        
        {!shouldUseInfiniteScroll && products.length > itemsPerSlide && (
          <>
            <button
              onClick={prevSlide}
              className="absolute -left-1 md:-left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 md:p-3 hover:bg-white transition-all duration-300 hover:scale-105 border border-gray-100/50"
              disabled={isTransitioning || currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute -right-1 md:-right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-2 md:p-3 hover:bg-white transition-all duration-300 hover:scale-105 border border-gray-100/50"
              disabled={isTransitioning || currentIndex >= products.length - itemsPerSlide}
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>
      
      {shouldUseInfiniteScroll && totalSlides > 1 && (
        <div className="flex justify-center mt-6 md:mt-8 gap-1.5 md:gap-2">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  moveToSlide(products.length + (index * itemsPerSlide));
                  setTimeout(() => setIsTransitioning(false), 500);
                }
              }}
              className={`w-1.5 h-1.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === getCurrentSlideIndex() ? "bg-primeColor scale-125 shadow-sm" : "bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSection;