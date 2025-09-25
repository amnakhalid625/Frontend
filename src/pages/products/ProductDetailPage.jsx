import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductDetail from '../../components/home/Products/ProductDetail';
import { useGetProductById } from '../../api/internal';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  const { getProductById, loading } = useGetProductById();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response.success) {
          const foundProduct = response.product;

          const formattedImages = (foundProduct.images || []).map(
            (imgPath) => `http://localhost:8080/${imgPath}`
          );

          const transformedProduct = {
            id: foundProduct._id,
            name: foundProduct.name,
            brand: foundProduct.brand,
            price: foundProduct.price,
            originalPrice: foundProduct.originalPrice,
            rating: foundProduct.averageRating,
            reviews: foundProduct.reviews?.length || 0,
            inStock: foundProduct.inStock,
            images: formattedImages.length > 0 ? formattedImages : ['https://via.placeholder.com/500?text=No+Image'],
            description: foundProduct.description,
            features: [
              `${foundProduct.brand} original product`,
              "Premium quality materials",
              "Fast delivery available",
            ],
            specifications: {
              "Brand": foundProduct.brand,
              "Category": foundProduct.category,
              "Stock Status": foundProduct.inStock ? "In Stock" : "Out of Stock"
            }
          };
          setProduct(transformedProduct);
        } else {
          toast.error('Product not found.');
          navigate('/products');
        }
      } catch (error) {
        toast.error("Failed to fetch product details.");
        navigate('/products');
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate, getProductById]);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="animate-spin text-primeColor w-16 h-16 mx-auto mb-4" />
          <div className="text-xl text-gray-600">Loading product details...</div>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
};

export default ProductDetailPage;