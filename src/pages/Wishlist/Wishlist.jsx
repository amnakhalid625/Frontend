import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Breadcrumbs from '../../components/pageProps/Breadcrumbs';
import { toggleWishlist, addToCart as addToCartAction } from '../../redux/orebiSlice';
import { useAddToCart } from '../../api/internal';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { wishlist, userInfo } = useSelector((state) => state.orebiReducer);
    const { addToCart } = useAddToCart();

    const handleMoveToCart = async (product) => {
        try {
            // FIX: Pass product._id, as items in wishlist/cart will have this property from Redux
            await addToCart(product._id, 1, userInfo);

            dispatch(addToCartAction({ ...product, quantity: 1 }));
            dispatch(toggleWishlist(product));
            toast.success("Moved to cart!");
        } catch (error) {
            const message = error.response?.data?.message || "An unknown error occurred.";
            toast.error(message);
        }
    };

    return (
        <div className="max-w-container mx-auto px-4">
            <Breadcrumbs title="Wishlist" />
            {wishlist.length > 0 ? (
                <div className="pb-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlist.map((product) => (
                            <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                <div className="relative">
                                    <Link to={`/product/${product._id}`}>
                                        <img src={product.image || product.img} alt={product.name || product.productName} className="w-full h-64 object-cover" />
                                    </Link>
                                    <button
                                        onClick={() => dispatch(toggleWishlist(product))}
                                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-orange-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-primeColor" />
                                    </button>
                                </div>
                                <div className="p-4 flex flex-col justify-between" style={{ minHeight: '180px' }}>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name || product.productName}</h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-lg font-bold text-gray-900">
                                                Rs. {product.price}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    Rs. {product.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleMoveToCart(product)}
                                        className="w-full border border-primeColor text-primeColor py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:bg-primeColor hover:text-white duration-300"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Move to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-20">
                    <Heart className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
                    <p className="text-gray-600 mb-6">Looks like you haven't added anything to your wishlist yet.</p>
                    <Link to="/shop">
                        <button className="inline-block bg-primeColor text-white px-8 py-3 rounded-lg font-medium hover:bg-transparent border border-primeColor hover:text-primeColor transition-colors duration-300 shadow-md hover:shadow-lg">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Wishlist;    