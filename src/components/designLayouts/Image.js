import React, { useState } from "react";

const Image = ({ imgSrc, className, alt, ...props }) => {
    const [imageError, setImageError] = useState(false);

    // Handle different URL formats
    const getImageUrl = (src) => {
        if (!src) return '';
        
        // If it's already a full URL, return as is
        if (src.startsWith('http://') || src.startsWith('https://')) {
            return src;
        }
        
        // Clean up path - remove double slashes and ensure single slash at start
        let cleanPath = src.replace(/\/+/g, '/');
        if (!cleanPath.startsWith('/')) {
            cleanPath = '/' + cleanPath;
        }
        
        // Use your local backend URL
        return `http://localhost:8080${cleanPath}`;
    };

    const handleImageError = (e) => {
        console.error('Image load failed for:', imgSrc);
        setImageError(true);
    };

    // If there's an error, show placeholder
    if (imageError || !imgSrc) {
        return (
            <div 
                className={`bg-gray-200 flex items-center justify-center text-gray-400 ${className}`}
                {...props}
            >
                <div className="text-center">
                    <div className="text-4xl">📷</div>
                    <div className="text-xs">No Image</div>
                </div>
            </div>
        );
    }

    return (
        <img 
            className={className}
            src={getImageUrl(imgSrc)}
            alt={alt || 'Image'}
            onError={handleImageError}
            {...props}
        />
    );
};

export default Image;