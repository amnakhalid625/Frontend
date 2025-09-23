import React, { useState, useEffect } from "react";
import ProductSection from "../../common/ProductSection";
import { useGetProducts } from "../../../api/internal";
import toast from "react-hot-toast";

const FootwearSection = () => {
  const [products, setProducts] = useState([]);
  const { getProducts, loading } = useGetProducts();

  useEffect(() => {
    const fetchFootwear = async () => {
      try {
        const response = await getProducts({ category: "Footwear", limit: 12 });
        if (response.success) {
          // FIX: Filter out products that are not in stock
          const inStockProducts = response.products
            .filter(p => p.inStock === true)
            .slice(0, 8);
          setProducts(inStockProducts);
        }
      } catch (error) {
        toast.error("Could not fetch trendy footwear.");
      }
    };

    fetchFootwear();
  }, [getProducts]);

  return (
    <ProductSection
      title="Trendy Footwear"
      subtitle="Step up your style game"
      products={products}
      loading={loading}
    />
  );
};

export default FootwearSection;