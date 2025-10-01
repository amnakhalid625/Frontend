import React, { useState } from "react";

const Image = ({ imgSrc, className, alt = "Image" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getImageUrl = (src) => {
    if (!src) return null;

    console.log("DEBUG - Processing src:", src);

    // ✅ If it's already a full URL (http/https), return as-is
    if (src.startsWith("http://") || src.startsWith("https://")) {
      console.log("Full URL detected:", src);
      return src;
    }

    // ✅ If it's a static asset, return as-is
    if (src.startsWith("/static/") || src.startsWith("static/")) {
      console.log("Static asset detected:", src);
      return src;
    }

    const backendUrl =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

    // ✅ Remove all leading slashes
    let cleanSrc = src.replace(/^\/+/, "");

    console.log("Cleaned src:", cleanSrc);

    // ✅ If path already contains "uploads/", don't add it again
    if (cleanSrc.startsWith("uploads/")) {
      return `${backendUrl}/${cleanSrc}`;
    }

    // ✅ Otherwise, attach uploads correctly
    return `${backendUrl}/uploads/${cleanSrc}`;
  };

  const imageUrl = getImageUrl(imgSrc);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
    console.log("✅ Image loaded successfully:", imageUrl);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    console.error("❌ Failed to load image:", imageUrl);
    console.error("Original src was:", imgSrc);
  };

  if (!imageUrl) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-500 text-sm">No Image</span>
      </div>
    );
  }

  if (imageError) {
    return (
      <div className={`${className} bg-red-50 border border-orange-200 flex flex-col items-center justify-center p-2`}>
        <div className="text-primeColor text-xs font-medium">404 - Image Not Found</div>
        <div className="text-primeColor text-xs mt-1 text-center break-all max-w-full">
          {imageUrl.length > 40 ? `${imageUrl.substring(0, 40)}...` : imageUrl}
        </div>
        <div className="text-gray-500 text-xs mt-1">
          File: {imgSrc?.split("/").pop()}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div
          className={`${className} bg-gray-100 flex items-center justify-center animate-pulse absolute inset-0 z-10`}
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <img
        className={`${className} ${
          imageLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-200`}
        src={imageUrl}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

export default Image;
