import React, { useState } from 'react';
import { Menu, ChevronDown, Rocket, Plus, Minus } from 'lucide-react';
// FIX: Corrected all MUI component imports to their specific paths
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

const Navigation = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  const categories = [
    {
      name: 'Fashion',
      tagline: 'Effortless Chic for Every Day',
      subcategories: [
        {
          name: 'Women',
        },
        {
          name: 'Men',
        },
        {
          name: 'Kids',
        }
      ]
    },
    {
      name: 'Bags',
      tagline: 'Carry Your Statement Piece',
      subcategories: [
        {
          name: 'Men Bags',
          items: ['Backpacks', 'Laptop Bags', 'Travel Bags']
        },
        {
          name: 'Women Bags',
          items: ['Handbags', 'Clutches', 'Tote Bags', 'Crossbody Bags']
        }
      ]
    },
    {
      name: 'Footwear',
      tagline: 'Step Into Style',
      subcategories: [
        {
          name: 'Men Footwear',
          items: ['Casual Shoes', 'Formal Shoes', 'Sports Shoes']
        },
        {
          name: 'Women Footwear',
          items: ['Heels', 'Flats', 'Boots', 'Sneakers']
        }
      ]
    },
    {
      name: 'Beauty',
      tagline: 'Glow with Confidence'
    },
    {
      name: 'Jewellery',
      tagline: 'Sparkle in Every Moment'
    }
  ];

  const handleMenuHover = (index) => {
    setActiveMenu(index);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  const toggleCategoryExpansion = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsCategoryMenuOpen(open);
  };

  const DrawerContent = () => (
    <Box
      sx={{ width: 350 }}
      role="presentation"
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          Shop By Categories
        </Typography>
        <IconButton onClick={toggleDrawer(false)}>
          ×
        </IconButton>
      </Box>
      <Divider />
      <List>
        {categories.map((category, index) => (
          <Box key={index}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => category.subcategories && toggleCategoryExpansion(category.name)}
                sx={{ px: 3 }}
              >
                <ListItemText primary={category.name} />
                {category.subcategories && (
                  expandedCategories[category.name] ? <Minus size={16} /> : <Plus size={16} />
                )}
              </ListItemButton>
            </ListItem>

            {category.subcategories && (
              <Collapse in={expandedCategories[category.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {category.subcategories.map((subcategory, subIndex) => (
                    <ListItemButton key={subIndex} sx={{ pl: 6 }}>
                      <ListItemText primary={subcategory.name} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}

            <Divider />
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <nav className="navigation bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-14">

          <div className="flex-none w-64">
            <button
              className="flex items-center gap-3 w-full text-gray-700 text-sm font-medium py-3 px-4 hover:text-orange-500 hover:bg-gray-50 transition-all duration-200 rounded-lg group"
              onClick={toggleDrawer(true)}
            >
              <Menu className="w-5 h-5 text-gray-600 group-hover:text-orange-500" />
              <span className="flex-grow text-left">Shop By Categories</span>
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transform group-hover:rotate-180 transition-transform duration-200" />
            </button>

            <Drawer
              anchor="left"
              open={isCategoryMenuOpen}
              onClose={toggleDrawer(false)}
            >
              {DrawerContent()}
            </Drawer>
          </div>

          <div className="hidden lg:block w-px h-8 bg-gray-200 mx-4"></div>

          <div className="hidden lg:flex flex-grow justify-center">
            <ul className="flex items-center space-x-1">
              <li>
                <a
                  href="/"
                  className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-all duration-200 border-b-2 border-transparent hover:border-orange-500"
                >
                  Home
                </a>
              </li>

              {categories.map((category, index) => (
                <li
                  key={index}
                  className="relative"
                  onMouseEnter={() => handleMenuHover(index)}
                  onMouseLeave={handleMenuLeave}
                >
                  <a
                    href={`/products?catId=${category.name.toLowerCase()}`}
                    className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-all duration-200 border-b-2 border-transparent hover:border-orange-500"
                  >
                    {category.name}
                    {category.subcategories && (
                      <ChevronDown className="w-3 h-3 ml-1 text-gray-500" />
                    )}
                  </a>

                  {category.subcategories && activeMenu === index && (
                    <div className="absolute top-full left-0 mt-2 min-w-56 bg-white shadow-lg border border-gray-100 rounded-xl z-50 overflow-hidden">
                      <div className="py-2">
                        {category.subcategories.map((subcategory, subIndex) => (
                          <div key={subIndex} className="relative group/sub">
                            <a
                              href={`/products?subCatId=${subcategory.name.toLowerCase()}`}
                              className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
                            >
                              <span>{subcategory.name}</span>
                              {subcategory.items && (
                                <ChevronDown className="w-3 h-3 -rotate-90 text-gray-400" />
                              )}
                            </a>

                            {subcategory.items && (
                              <div className="absolute left-full top-0 ml-2 min-w-48 bg-white shadow-lg border border-gray-100 rounded-xl opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 overflow-hidden">
                                <div className="py-2">
                                  {subcategory.items.map((item, itemIndex) => (
                                    <a
                                      key={itemIndex}
                                      href={`/products?item=${item.toLowerCase()}`}
                                      className="block px-4 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
                                    >
                                      {item}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block w-px h-8 bg-gray-200 mx-4"></div>

          <div className="hidden lg:flex flex-none w-64 justify-end">
            <div className="flex items-center gap-3 px-4 py-2 ">
              <Rocket className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">
                Free International Delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;