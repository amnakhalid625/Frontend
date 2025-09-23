import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import { useGetCategories } from '../../../../api/internal';

// Receive the initialCategory prop
const ProductFilter = ({ onFilterChange, initialCategory }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 60000]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const { getCategories, loading: categoriesLoading } = useGetCategories();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, [getCategories]);

  // FIX: New useEffect to set the initial category from the prop
  useEffect(() => {
    if (initialCategory && categories.length > 0) {
      // Find the category from the fetched list that matches the one from the URL
      const matchedCategory = categories.find(c => c.name.toLowerCase() === initialCategory.toLowerCase());
      if (matchedCategory) {
        // Set the state to pre-select the checkbox
        setSelectedCategories([matchedCategory.name]);
      }
    }
  }, [initialCategory, categories]);


  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      priceRange: { min: priceRange[0], max: priceRange[1] },
      ratings: selectedRatings
    });
  }, [selectedCategories, priceRange, selectedRatings, onFilterChange]);


  const handleCategoryChange = (categoryName) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleRatingChange = (rating) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 60000]);
    setSelectedRatings([]);
  };

  const hasActiveFilters = selectedCategories.length > 0 ||
    priceRange[0] > 0 || priceRange[1] < 60000 ||
    selectedRatings.length > 0;

  return (
    <Paper elevation={1} sx={{ p: 0, borderRadius: 2 }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'grey.200' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Filters
          </Typography>
          {hasActiveFilters && (
            <Button
              size="small"
              onClick={clearAllFilters}
              startIcon={<ClearIcon />}
              sx={{ color: 'error.main' }}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Box>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            Categories
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {categoriesLoading ? <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box> : (
            <FormGroup>
              {categories.map(category => (
                <FormControlLabel
                  key={category._id}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryChange(category.name)}
                      size="small"
                    />
                  }
                  label={category.name}
                />
              ))}
            </FormGroup>
          )}
        </AccordionDetails>
      </Accordion>

      <Divider />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            Price Range
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 2 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={60000}
              step={1000}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                From: <strong>Rs {priceRange[0].toLocaleString()}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To: <strong>Rs {priceRange[1].toLocaleString()}</strong>
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            Rating
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {[5, 4, 3, 2, 1].map(rating => (
              <FormControlLabel
                key={rating}
                control={
                  <Checkbox
                    checked={selectedRatings.includes(rating)}
                    onChange={() => handleRatingChange(rating)}
                    size="small"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={rating} readOnly size="small" />
                    <Typography variant="body2">& up</Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default ProductFilter;