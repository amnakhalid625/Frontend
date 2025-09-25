import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Favorite, CompareArrows, ZoomOutMap } from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {

  // Helper to render star ratings dynamically
  const renderStars = (rating) => [...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />);

  // THIS IS THE FIX: Construct the full image URL by prepending the backend address.
  // This also handles both `images` array and single `image` string for flexibility.
  const imageUrl = (product.images && product.images.length > 0)
    ? `https://backend-production-5823.up.railway.app/${product.images[0]}`
    : (product.image ? `https://backend-production-5823.up.railway.app/${product.image}` : "https://via.placeholder.com/400?text=No+Image");

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-50">
        <Link to={`/product/${product._id}`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Wishlist Button & Other Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={() => onToggleWishlist(product)} className="w-9 h-9 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-110">
            <Favorite className={`w-5 h-5 transition-colors ${isWishlisted ? "text-red-500" : "text-gray-600 hover:text-primeColor"}`} />
          </button>
          <button className="w-9 h-9 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-110">
            <CompareArrows className="w-5 h-5 text-gray-600 hover:text-primeColor" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          {product.category}
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-800 mb-2 h-12 line-clamp-2 leading-5 hover:text-primeColor transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          {renderStars(product.averageRating || 0)}
          <span className="text-xs text-gray-500">({product.reviews?.length || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primeColor">
            Rs {product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              Rs {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 mt-auto ${product.inStock
              ? 'bg-primeColor hover:bg-black text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {product.inStock ? (
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </span>
          ) : (
            'Out of Stock'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;