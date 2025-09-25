import React from "react";

const Image = ({ imgSrc, className, alt }) => {
  // FIXED: Use production backend URL
  const BACKEND_URL = "https://backend-production-5823.up.railway.app";
  
  // FIXED: Better image URL construction
  const getImageUrl = (src) => {
    if (!src) return '';
    
    // If it's already a full URL (starts with http), use as-is
    if (src.startsWith('http')) {
      return src;
    }
    
    // If it's a blob URL (for new uploads), use as-is
    if (src.startsWith('blob:')) {
      return src;
    }
    
    // For relative paths from database, construct full URL
    // Remove leading slash if present to avoid double slash
    const imagePath = src.startsWith('/') ? src.substring(1) : src;
    const fullUrl = `${BACKEND_URL}/${imagePath}`;
    
    console.log('Image URL constructed:', fullUrl);
    return fullUrl;
  };

  const imageUrl = getImageUrl(imgSrc);

  return (
    <img 
      className={className} 
      src={imageUrl} 
      alt={alt || "Image"} 
      onError={(e) => {
        console.error('Image load failed for URL:', imageUrl);
        // Set a placeholder image or hide broken image
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNjBWMTQwTTYwIDEwMEgxNDBNMTgwIDEwMEMxODAgMTM0LjE4MyAxNTEuNDY2IDE2MiAxMTcuNSAxNjJINzIuNUM0NC4zODcgMTYyIDE4IDEzNC4xODMgMTggMTAwQzE4IDY1LjgxNyA0NC4zODcgMzggNzIuNSAzOEgxMTcuNUMxNTEuNDY2IDM4IDE4MCA2NS44MTcgMTgwIDEwMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmaWxsPSIjNkI3Mjg4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
        e.target.className += ' opacity-50 border-2 border-dashed border-gray-300';
      }}
      onLoad={() => {
        console.log('Image loaded successfully:', imageUrl);
      }}
    />
  );
};

export default Image;