import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Heart, Share2, ShoppingCart, Plus, Minus, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart as addToCartAction, toggleWishlist as toggleWishlistAction } from '../../../redux/orebiSlice';
import { useAddToCart, useAddToWishlist } from '../../../api/internal';

const ProductDetail = ({ product }) => {
  // 1. ALL HOOKS ARE CALLED AT THE TOP, UNCONDITIONALLY
  const dispatch = useDispatch();
  const { wishlist, userInfo } = useSelector((state) => state.orebiReducer);
  const { addToCart } = useAddToCart();
  const { toggleWishlist } = useAddToWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const productData = product;

  // 2. THE CONDITIONAL CHECK NOW HAPPENS *AFTER* ALL HOOKS HAVE BEEN CALLED
  if (!productData) {
    // This is a safe place for a loading state or placeholder
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  const isWishlisted = wishlist.some(p => p._id === productData.id);

  const handleQuantityChange = (action) => {
    if (action === 'increment') setQuantity(prev => prev + 1);
    else if (action === 'decrement' && quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(productData.id, quantity, userInfo);
      dispatch(
        addToCartAction({
          _id: productData.id,
          name: productData.name,
          quantity: quantity,
          image: productData.images[0],
          price: productData.price,
          colors: selectedColor,
        })
      );
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      const message = error.response?.data?.message || "An unknown error occurred.";
      toast.error(message);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(productData.id, userInfo);
      dispatch(toggleWishlistAction({ ...productData, _id: productData.id, image: productData.images[0] }));
      toast.success("Wishlist updated!");
    } catch (error) {
      const message = error.response?.data?.message || "An unknown error occurred.";
      toast.error(message);
    }
  };

  const renderStars = (rating) => [...Array(5)].map((_, index) => <Star key={index} className={`w-5 h-5 ${index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />);
  const nextImage = () => setSelectedImage((prev) => (prev + 1) % productData.images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + productData.images.length) % productData.images.length);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative group">
              <img src={productData.images[selectedImage]} alt={productData.name} className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg cursor-zoom-in" onClick={() => setShowImageModal(true)} />
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-5 h-5" /></button>
              <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn className="w-5 h-5" /></div>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {productData.images.map((image, index) => (
                <button key={index} onClick={() => setSelectedImage(index)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primeColor' : 'border-gray-200'}`}>
                  <img src={image} alt={`${productData.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-primeColor font-medium">{productData.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{productData.name}</h1>
              <div className="flex items-center mt-3 space-x-3">
                <div className="flex items-center">{renderStars(productData.rating)}</div>
                <span className="text-sm text-gray-600">{productData.rating} ({productData.reviews} reviews)</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">Rs. {productData.price.toLocaleString()}</span>
              {productData.originalPrice && <span className="text-xl text-gray-500 line-through">Rs. {productData.originalPrice.toLocaleString()}</span>}
              {productData.discount && <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-medium">{productData.discount}% OFF</span>}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex space-x-3">
                {(productData.specifications?.["Color Options"]?.split(', ') || ["Black", "Brown", "Tan"]).map((color) => (
                  <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 rounded-lg border-2 transition-colors ${selectedColor === color ? 'border-primeColor' : 'border-gray-200 hover:border-gray-300'}`}>{color}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => handleQuantityChange('decrement')} className="p-2 hover:bg-gray-100 transition-colors" disabled={quantity <= 1}><Minus className="w-4 h-4" /></button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button onClick={() => handleQuantityChange('increment')} className="p-2 hover:bg-gray-100 transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                <span className="text-sm text-gray-600">{productData.inStock ? 'In Stock' : 'Out of Stock'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <button onClick={handleAddToCart} disabled={!productData.inStock} className={`w-full border border-primeColor text-primeColor py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:bg-primeColor hover:text-white duration-300 ${!productData.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <ShoppingCart className="w-5 h-5" /><span>Add to Cart</span>
              </button>
              <div className="flex space-x-3">
                <button onClick={handleToggleWishlist} className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg border transition-colors ${isWishlisted ? 'border-primeColor text-primeColor' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} /><span>Wishlist</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" /><span>Share</span>
                </button>
              </div>
            </div>
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3"><Truck className="w-6 h-6 text-primeColor" /><span className="text-sm text-gray-600">Free Delivery</span></div>
                <div className="flex items-center space-x-3"><Shield className="w-6 h-6 text-green-600" /><span className="text-sm text-gray-600">2 Year Warranty</span></div>
                <div className="flex items-center space-x-3"><RotateCcw className="w-6 h-6 text-yellow-700" /><span className="text-sm text-gray-600">30 Day Returns</span></div>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs and Modal sections */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'features', 'specifications', 'reviews'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab ? 'border-primeColor text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab}</button>
              ))}
            </nav>
          </div>
          <div className="py-8">
            {activeTab === 'description' && <div className="prose max-w-none"><p className="text-gray-700 leading-relaxed">{productData.description}</p></div>}
            {activeTab === 'features' && <ul className="space-y-3">{productData.features.map((feature, index) => <li key={index} className="flex items-start space-x-3"><div className="w-2 h-2 bg-primeColor rounded-full mt-2 flex-shrink-0"></div><span className="text-gray-700">{feature}</span></li>)}</ul>}
            {activeTab === 'specifications' && <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">{Object.entries(productData.specifications).map(([key, value]) => <div key={key} className="border-b border-gray-200 pb-2"><dt className="font-medium text-gray-900">{key}</dt><dd className="text-gray-700">{value}</dd></div>)}</dl>}
            {activeTab === 'reviews' && <div className="text-center py-12"><p className="text-gray-500">Reviews section would go here</p></div>}
          </div>
        </div>
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <img src={productData.images[selectedImage]} alt={productData.name} className="max-w-full max-h-full object-contain" />
              <button onClick={() => setShowImageModal(false)} className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors">×</button>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"><ChevronLeft className="w-6 h-6" /></button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"><ChevronRight className="w-6 h-6" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;