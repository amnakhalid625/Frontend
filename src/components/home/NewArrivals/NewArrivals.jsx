import React, { useState, useEffect } from "react";
import ProductSection from "../../common/ProductSection";
import { useGetProducts } from "../../../api/internal";
import toast from "react-hot-toast";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const { getProducts, loading } = useGetProducts();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await getProducts({ sort: 'newest', limit: 12 });
        if (response.success) {
          // Filter out products that are not in stock
          const inStockProducts = response.products
            .filter(p => p.inStock === true)
            .slice(0, 8);
          setProducts(inStockProducts);
        }
      } catch (error) {
        toast.error("Could not fetch new arrivals.");
      }
    };
    fetchNewArrivals();
  }, [getProducts]);

  return (
    <ProductSection
      title="New Arrivals"
      subtitle="Do not miss the current offers until the end of March."
      products={products}
      loading={loading}
      className="mt-8  lg:mt-12 "
    />
  );
};

export default NewArrivals;