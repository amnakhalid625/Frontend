import React from "react";

const BannerCarousal = () => {
  const banners = [
    {
      id: 1,
      img: "https://serviceapi.spicezgold.com/download/1741669012402_banner1.webp",
      link: "/products?subCatId=67cfa5063c7fa6b8e3276f79",
    },
    {
      id: 2,
      img: "https://serviceapi.spicezgold.com/download/1741669037986_banner2.webp",
      link: "/products?catId=67cfa3233c7fa6b8e3276e3d",
    },
    {
      id: 3,
      img: "https://serviceapi.spicezgold.com/download/1741669057847_banner5.webp",
      link: "/products?catId=67cfa3973c7fa6b8e3276e84",
    },
    {
      id: 4,
      img: "https://serviceapi.spicezgold.com/download/1742453755529_1741669087880_banner6.webp",
      link: "/products?subCatId=67cfa5063c7fa6b8e3276f79",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {banners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link}
            className="block group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500"
          >
            <img
              src={banner.img}
              alt={`Banner ${banner.id}`}
              className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default BannerCarousal;