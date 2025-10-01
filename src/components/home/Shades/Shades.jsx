import React, { useState, useEffect } from "react";
import ProductSection from "../../common/ProductSection";
import { useGetProducts } from "../../../api/internal";
import toast from "react-hot-toast";

const ShadesSection = () => {
  const [products, setProducts] = useState([]);
  const { getProducts, loading } = useGetProducts();

  useEffect(() => {
    const fetchShades = async () => {
      try {
        const response = await getProducts({ category: "Shades", limit: 12 });
        if (response.success) {
          const inStockProducts = response.products
            .filter(p => p.inStock === true)
            .slice(0, 8);
          setProducts(inStockProducts);
        }
      } catch (error) {
        toast.error("Could not fetch shades.");
      }
    };

    fetchShades();
  }, [getProducts]);

  return (
    <ProductSection
      title="Stylish Shades"
      subtitle="Trendy eyewear for every look"
      products={products}
      loading={loading}
      className="mt-8 lg:mt-12"
    />
  );
};

export default ShadesSection;
