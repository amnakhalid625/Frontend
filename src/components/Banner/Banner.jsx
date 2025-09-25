import React, { useState, useEffect } from "react";
import { useGetBanners } from "../../api/internal";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState([]); // State for the full banner objects
  const { getBanners, loading } = useGetBanners();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getBanners();
        if (response.success && response.banners) {
          // THIS IS THE FIX: Filter banners to only include those with "Active" status.
          const activeBanners = response.banners.filter(
            (banner) => banner.status === "Active"
          );
          setBanners(activeBanners);
        }
      } catch (error) {
        toast.error("Could not load banners.");
      }
    };
    fetchBanners();
  }, [getBanners]);

  useEffect(() => {
    if (banners.length <= 1) return; // Don't auto-play if there's only one or zero slides

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000); // Increased interval for better user experience

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  if (loading && banners.length === 0) {
    return (
      <div className="pb-3 pt-3 lg:pb-4 lg:pt-4">
        <div className="max-w-[84rem] mx-auto px-4">
          <div className="w-full h-56 md:h-72 lg:h-96 bg-gray-200 animate-pulse rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null; // Do not render anything if there are no active banners
  }

  return (
    <div className="pb-3 pt-3 lg:pb-4 lg:pt-4 relative z-40">
      <div className="max-w-[84rem] mx-auto px-4">
        <div className="relative overflow-hidden rounded-xl shadow-lg">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div
                key={banner._id || index}
                className="w-full flex-shrink-0"
                style={{ backgroundColor: banner.backgroundColor || '#f0f0f0' }}
              >
                <img
                  src={`/${banner.image}`}
                  alt={banner.title}
                  className="w-full h-56 md:h-72 lg:h-96 object-contain mx-auto" // Use object-contain to show the whole image
                />
              </div>
            ))}
          </div>

          {banners.length > 1 && (
            <>
              <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
                {banners.map((_, index) => (
                  <button key={index} onClick={() => goToSlide(index)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white scale-125 ring-2 ring-white/50" : "bg-white/50 hover:bg-white/75"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;