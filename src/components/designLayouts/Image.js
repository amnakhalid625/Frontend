import React from "react";

const Image = ({ imgSrc, className }) => {
  // ✅ CLOUDINARY CHANGE: Direct Cloudinary URL use karein
  return <img className={className} src={imgSrc} alt="product" />;
};

export default Image;