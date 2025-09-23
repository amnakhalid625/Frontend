import React, { useState, useEffect } from "react";
import ProductSection from "../../common/ProductSection";
import { useGetProducts } from "../../../api/internal";
import toast from "react-hot-toast";

const JewellerySection = () => {
  const [products, setProducts] = useState([]);
  const { getProducts, loading } = useGetProducts();

  useEffect(() => {
    const fetchJewellery = async () => {
      try {
        const response = await getProducts({ category: "Jewellery", limit: 12 });
        if (response.success) {
          // FIX: Filter out products that are not in stock
          const inStockProducts = response.products
            .filter(p => p.inStock === true)
            .slice(0, 8);
          setProducts(inStockProducts);
        }
      } catch (error) {
        toast.error("Could not fetch premium jewellery.");
      }
    };

    fetchJewellery();
  }, [getProducts]);

  return (
    <ProductSection
      title="Premium Jewellery"
      subtitle="Elegant designs for every occasion"
      products={products}
      loading={loading}
      className="mt-8  lg:mt-12 "
    />
  );
};

export default JewellerySection;