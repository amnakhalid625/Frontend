import React, { useState } from "react";
import { Menu, Rocket } from "lucide-react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const categories = [
    "Fashion",
    "Bags",
    "Watches",
    "Footwear",
    "Shades",
    "Accessories",
    "Homeware",
  ];

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      {/* Bottom Row */}
      <div className="w-full py-3 px-4 max-w-[89rem] mx-auto flex items-center justify-between">
        {/* Drawer Button - Left */}
        <button
          className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-all"
          onClick={toggleDrawer(true)}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[15px] font-medium">Shop by Categories</span>
        </button>

        {/* Center Categories */}
        <div className="hidden md:flex items-center justify-center gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?catId=${cat.toLowerCase()}`}
              className="text-[15px] font-medium text-gray-700 hover:text-orange-500 transition"
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Right Side Text */}
        <div className="flex items-center gap-2 text-gray-700">
          <Rocket className="w-5 h-5 text-orange-500" />
          <span className="text-[15px] font-medium">
            Free International Delivery
          </span>
        </div>
      </div>

      {/* Drawer */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 280 }} role="presentation">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Categories</h2>
            <IconButton onClick={toggleDrawer(false)}>✕</IconButton>
          </div>
          <Divider />
          <List>
            {categories.map((cat, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  component={Link}
                  to={`/products?catId=${cat.toLowerCase()}`}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText primary={cat} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navigation;
