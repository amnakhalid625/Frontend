import React, { useState, useEffect } from "react";
import ProductSection from "../../common/ProductSection";
import { useGetProducts } from "../../../api/internal";
import toast from "react-hot-toast";

const AccessoriesSection = () => {
  const [products, setProducts] = useState([]);
  const { getProducts, loading } = useGetProducts();

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await getProducts({ category: "Accessories", limit: 12 });
        if (response.success) {
          const inStockProducts = response.products
            .filter(p => p.inStock === true)
            .slice(0, 8);
          setProducts(inStockProducts);
        }
      } catch (error) {
        toast.error("Could not fetch accessories.");
      }
    };

    fetchAccessories();
  }, [getProducts]);

  return (
    <ProductSection
      title="Accessories"
      subtitle="Trendy essentials for every style"
      products={products}
      loading={loading}
      className="mt-8 lg:mt-12"
    />
  );
};

export default AccessoriesSection;
