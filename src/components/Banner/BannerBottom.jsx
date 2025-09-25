import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetCategories } from "../../api/internal";
import toast from "react-hot-toast";

const BannerBottom = () => {
  const [categories, setCategories] = useState([]);
  const { getCategories, loading } = useGetCategories();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success) {
          setCategories(response.categories.slice(0, 5));
        }
      } catch (error) {
        toast.error("Could not load categories.");
      }
    };
    fetchCategories();
  }, [getCategories]);

  if (loading) {
    return (
      <div className="w-full py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse rounded-2xl w-28 h-40 sm:w-32 md:w-36 lg:w-40"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12">
        {categories.map((cat) => (
          <Link
            to={`/products?catId=${cat.name.toLowerCase()}`}
            key={cat._id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col items-center justify-center text-center cursor-pointer transform hover:-translate-y-2 border border-gray-100 w-28 sm:w-32 md:w-36 lg:w-40"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mb-3 overflow-hidden rounded-full bg-white shadow flex items-center justify-center p-2">
              <img
                // FIX: Prepend backend URL to the image path
                src={cat.image ? `https://backend-production-5823.up.railway.app/${cat.image}` : "https://via.placeholder.com/100"}
                alt={cat.name}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
              />
            </div>
            <h3 className="text-sm md:text-base font-semibold text-gray-800 tracking-wide">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BannerBottom;