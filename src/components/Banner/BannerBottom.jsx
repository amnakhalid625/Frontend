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
          setCategories(response.categories.slice(0, 7)); // 7 categories
        }
      } catch (error) {
        toast.error("Could not load categories.");
      }
    };
    fetchCategories();
  }, [getCategories]);

  if (loading) {
    return (
      <div className="w-full py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-4">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse rounded-xl w-24 h-32 sm:w-28 md:w-32 lg:w-36"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-4">
        {categories.map((cat) => (
          <Link
            to={`/products?catId=${cat.name.toLowerCase()}`}
            key={cat._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 flex flex-col items-center justify-center text-center cursor-pointer transform hover:-translate-y-2 border border-gray-100 w-24 sm:w-28 md:w-32 lg:w-36"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-2 overflow-hidden rounded-full bg-white shadow flex items-center justify-center p-2">
              <img
                src={
                  cat.image
                    ? `http://localhost:8080${cat.image}`
                    : "https://via.placeholder.com/100"
                }
                alt={cat.name}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
              />
            </div>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 tracking-wide">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BannerBottom;
