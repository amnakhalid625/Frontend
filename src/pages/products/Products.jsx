import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Container, Typography, Drawer, IconButton, useMediaQuery, Grid, Button, Fab, CircularProgress } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { FilterList as FilterIcon, Close as CloseIcon, GridView as GridIcon, ViewList as ListIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ProductFilter from "../../components/home/Products/productfilter/ProductFilter";
import ProductCard from "../../components/home/Products/productcard/ProductCard";
import { addToCart as addToCartAction, toggleWishlist as toggleWishlistAction } from "../../redux/orebiSlice";
import { useAddToCart, useAddToWishlist, useGetProducts } from "../../api/internal";

const StyledToggleButtonGroup = styled("div")(({ theme }) => ({ display: 'flex', backgroundColor: theme.palette.grey[100], borderRadius: "8px", overflow: "hidden", marginLeft: theme.spacing(2) }));
const StyledToggleButton = styled("button")(({ theme, selected }) => ({ border: "none", padding: "6px 12px", cursor: "pointer", backgroundColor: selected ? theme.palette.primary.main : "transparent", color: selected ? theme.palette.primary.contrastText : theme.palette.text.secondary, fontWeight: "bold", "&:hover": { backgroundColor: selected ? theme.palette.primary.dark : theme.palette.grey[200] } }));

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { wishlist, userInfo } = useSelector((state) => state.orebiReducer);
  const { addToCart } = useAddToCart();
  const { toggleWishlist } = useAddToWishlist();
  const { getProducts, loading: productsLoading } = useGetProducts();

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', sort: '' });
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('catId');
    if (categoryFromUrl) {
      const formattedCategory = categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1);
      setFilters(prev => ({ ...prev, category: formattedCategory }));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const queryParams = {
          keyword: searchParams.get("q") || '',
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sort: filters.sort,
        };
        const response = await getProducts(queryParams);
        if (response.success) {
          // THIS IS THE FIX: Filter out products that are not in stock.
          const inStockProducts = response.products.filter(p => p.inStock === true);
          setProducts(inStockProducts);
        }
      } catch (error) {
        toast.error("Failed to fetch products.");
      }
    };

    fetchProductsData();
  }, [searchParams, filters, getProducts]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      category: newFilters.categories.join(','),
      minPrice: newFilters.priceRange.min,
      maxPrice: newFilters.priceRange.max,
    }));
  }, []);

  const toggleFilterDrawer = () => setIsFilterOpen(!isFilterOpen);
  const isProductInWishlist = (productId) => wishlist.some((p) => p._id === productId);

  const handleAddToCart = async (product) => {
    try {
      const imageUrl = (product.images && product.images.length > 0) ? `https://backend-production-5823.up.railway.app/${product.images[0]}` : product.image;
      await addToCart(product._id, 1, userInfo);
      dispatch(addToCartAction({ ...product, _id: product._id, quantity: 1, image: imageUrl }));
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Please login to add to cart.");
    }
  };

  const handleToggleWishlist = async (product) => {
    try {
      const imageUrl = (product.images && product.images.length > 0) ? `https://backend-production-5823.up.railway.app/${product.images[0]}` : product.image;
      await toggleWishlist(product._id, userInfo);
      dispatch(toggleWishlistAction({ ...product, _id: product._id, image: imageUrl }));
      toast.success("Wishlist updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Please login to update wishlist.");
    }
  };

  const gridViewCols = viewMode === 'grid' ? { xs: 12, sm: 6, md: 4, lg: 3 } : { xs: 12 };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: "flex", gap: 3, position: "relative" }}>
          {!isMobile && (
            <Box sx={{ width: 280, flexShrink: 0, position: "sticky", top: 150, alignSelf: "flex-start", bgcolor: "white", boxShadow: 1, p: 0, borderRadius: 2 }}>
              <ProductFilter
                onFilterChange={handleFilterChange}
                initialCategory={searchParams.get('catId')}
              />
            </Box>
          )}
          <Drawer anchor="left" open={isFilterOpen} onClose={toggleFilterDrawer} sx={{ display: { lg: "none" }, "& .MuiDrawer-paper": { width: 320, maxWidth: "90vw", bgcolor: "white" } }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "grey.200", display: "flex", justifyContent: "space-between", alignItems: "center" }}><Typography variant="h6" sx={{ fontWeight: "bold" }}>Filters</Typography><IconButton onClick={toggleFilterDrawer}><CloseIcon /></IconButton></Box>
            <Box sx={{ p: 2, overflow: "auto" }}>
              <ProductFilter
                onFilterChange={handleFilterChange}
                initialCategory={searchParams.get('catId')}
              />
            </Box>
          </Drawer>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, p: 2, bgcolor: "white", borderRadius: 2, boxShadow: 1, position: "sticky", top: 150, zIndex: 10 }}>
              <Typography variant="body2" color="text.secondary">{products.length} products found</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StyledToggleButtonGroup><StyledToggleButton selected={viewMode === "grid"} onClick={() => setViewMode("grid")}><GridIcon /></StyledToggleButton><StyledToggleButton selected={viewMode === "list"} onClick={() => setViewMode("list")}><ListIcon /></StyledToggleButton></StyledToggleButtonGroup>
                {isMobile && <Button variant="outlined" startIcon={<FilterIcon />} onClick={toggleFilterDrawer} sx={{ borderRadius: "20px", ml: 2 }}>Filters</Button>}
              </Box>
            </Box>
            {productsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
            ) : (
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item key={product._id} {...gridViewCols}>
                    <ProductCard product={product} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} isWishlisted={isProductInWishlist(product._id)} />
                  </Grid>
                ))}
              </Grid>
            )}
            {products.length === 0 && !productsLoading && <Box sx={{ textAlign: "center", py: 8, bgcolor: "white", borderRadius: 2, boxShadow: 1, mt: 3 }}><Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>No products found</Typography><Typography variant="body1" color="text.secondary">Try adjusting your filters</Typography></Box>}
          </Box>
        </Box>
      </Container>
      {isMobile && <Fab color="primary" sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }} onClick={toggleFilterDrawer}><FilterIcon /></Fab>}
    </Box>
  );
};

export default Products;