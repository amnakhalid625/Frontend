// Product navigation utility
export const navigateToProduct = (productId, navigate) => {
  navigate(`/product/${productId}`);
};

// Generate product slug
export const generateSlug = (productName) => {
  return productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Find product by ID from all collections
export const findProductById = (id, allProducts) => {
  return allProducts.find(product => product.id.toString() === id.toString());
};