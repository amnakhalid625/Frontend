import React, { useState, useEffect } from "react";
import ProductSection from "../../common/ProductSection";
import { useGetProducts } from "../../../api/internal";
import toast from "react-hot-toast";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const { getProducts, loading } = useGetProducts();

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await getProducts({ category: "Bags", sort: "rating", limit: 12 });
        if (response.success) {
          // FIX: Filter out products that are not in stock
          const inStockProducts = response.products
            .filter(p => p.inStock === true)
            .slice(0, 8);
          setProducts(inStockProducts);
        }
      } catch (error) {
        toast.error("Could not fetch best-selling bags.");
      }
    };

    fetchBestSellers();
  }, [getProducts]);

  return (
    <ProductSection
      title="Best Selling Bags"
      subtitle="Top-rated bags loved by our customers"
      products={products}
      loading={loading}
      className="mt-8  lg:mt-12 "
    />
  );
};

export default BestSellers;