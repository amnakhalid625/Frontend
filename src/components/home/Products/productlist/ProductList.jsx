import React, { useState, useMemo } from 'react';
import ProductCard from '../productcard/ProductCard';

const ProductList = ({ products, viewMode = 'grid' }) => {
  const [sortBy, setSortBy] = useState('default');
  
  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    switch(sortBy) {
      case 'priceLow':
        return sorted.sort((a, b) => a.price - b.price);
      case 'priceHigh':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort((a, b) => b.id - a.id);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [products, sortBy]);

  const handleAddToCart = (product) => {
    // Cart functionality implement karenge baad mein
    console.log('Added to cart:', product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="rightContent w-full lg:w-4/5 py-3 ">
      {/* Top Controls Bar */}
      <div className="bg-gray-100 p-2 w-full mb-4 rounded-md flex items-center justify-between sticky top-[135px] z-[99]">
        {/* View Mode Buttons */}
        <div className="col1 flex items-center itemViewActions gap-1">
          <button 
            className={`w-9 h-9 min-w-9 rounded-full flex items-center justify-center text-gray-600 transition-all ${
              viewMode === 'list' ? 'bg-gray-300 text-gray-800' : 'hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
          
          <button 
            className={`w-9 h-9 min-w-9 rounded-full flex items-center justify-center text-gray-600 transition-all ${
              viewMode === 'grid' ? 'bg-gray-300 text-gray-800' : 'hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
              <rect x="48" y="48" width="176" height="176" rx="20" ry="20"/>
              <rect x="256" y="48" width="176" height="176" rx="20" ry="20"/>
              <rect x="48" y="256" width="176" height="176" rx="20" ry="20"/>
              <rect x="256" y="256" width="176" height="176" rx="20" ry="20"/>
            </svg>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-4">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primeColor focus:ring-500 focus:border-transparent"
          >
            <option value="default">Sort by Default</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="name">Name A-Z</option>
          </select>
          
          {/* Results Count */}
          <div className="text-sm text-gray-600 hidden sm:block">
            Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {sortedProducts.length > 0 ? (
          sortedProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Load More Button (Future Enhancement) */}
      {sortedProducts.length > 0 && sortedProducts.length >= 12 && (
        <div className="flex justify-center mt-8">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;