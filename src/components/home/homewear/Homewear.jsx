import React, { useState, useEffect } from "react";
import ProductSection from "../../common/ProductSection";
import { useGetProducts } from "../../../api/internal";
import toast from "react-hot-toast";

const HomewareSection = () => {
  const [products, setProducts] = useState([]);
  const { getProducts, loading } = useGetProducts();

  useEffect(() => {
    const fetchHomeware = async () => {
      try {
        const response = await getProducts({ category: "Homewear", limit: 12 });
        if (response.success) {
          const inStockProducts = response.products
            .filter(p => p.inStock === true)
            .slice(0, 8);
          setProducts(inStockProducts);
        }
      } catch (error) {
        toast.error("Could not fetch homeware products.");
      }
    };

    fetchHomeware();
  }, [getProducts]);

  return (
    <ProductSection
      title="Homewear"
      subtitle="Upgrade your space with stylish essentials"
      products={products}
      loading={loading}
      className="mt-8 lg:mt-12"
    />
  );
};

export default HomewareSection;
