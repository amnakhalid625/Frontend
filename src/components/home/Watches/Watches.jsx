import React, { useState, useEffect } from "react";
import ProductSection from "../../common/ProductSection";
import { useGetProducts } from "../../../api/internal";
import toast from "react-hot-toast";

const WatchSection = () => {
  const [products, setProducts] = useState([]);
  const { getProducts, loading } = useGetProducts();

  useEffect(() => {
    const fetchWatches = async () => {
      try {
        const response = await getProducts({ category: "Watches", limit: 12 });
        if (response.success) {
          const inStockProducts = response.products
            .filter(p => p.inStock === true)
            .slice(0, 8);
          setProducts(inStockProducts);
        }
      } catch (error) {
        toast.error("Could not fetch watches.");
      }
    };

    fetchWatches();
  }, [getProducts]);

  return (
    <ProductSection
      title="Premium Watches"
      subtitle="Stylish timepieces for every occasion"
      products={products}
      loading={loading}
      className="mt-8 lg:mt-12"
    />
  );
};

export default WatchSection;
