import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Check localStorage for an existing user session. Default to null if not found.
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  
  // Admin-specific state
  adminInfo: localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo"))
    : null,
  
  // Admin dashboard data
  adminStats: null,
  adminChartData: null,
  
  products: [], // Represents the shopping cart
  wishlist: [],
};

export const orebiSlice = createSlice({
  name: "orebi",
  initialState,
  reducers: {
    // ============== User Authentication Reducers ===============
    loginUser: (state, action) => {
      state.userInfo = action.payload;
      // Save user info to localStorage to persist the session
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.userInfo = null;
      // Remove user info from localStorage on logout
      localStorage.removeItem("userInfo");
      // Clear cart and wishlist for a clean logout
      state.products = [];
      state.wishlist = [];
    },

    // ============== Admin Authentication Reducers ===============
    loginAdmin: (state, action) => {
      state.adminInfo = action.payload;
      // Save admin info to localStorage to persist the session
      localStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
    logoutAdmin: (state) => {
      state.adminInfo = null;
      // Remove admin info from localStorage on logout
      localStorage.removeItem("adminInfo");
      // Clear admin dashboard data
      state.adminStats = null;
      state.adminChartData = null;
    },

    // ============== Admin Dashboard Data Reducers ===============
    setAdminStats: (state, action) => {
      state.adminStats = action.payload;
    },
    setAdminChartData: (state, action) => {
      state.adminChartData = action.payload;
    },
    clearAdminData: (state) => {
      state.adminStats = null;
      state.adminChartData = null;
    },

    // ================== Cart Reducers ========================
    addToCart: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity++;
      }
    },
    drecreaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item.quantity === 1) {
        item.quantity = 1;
      } else {
        item.quantity--;
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload
      );
    },
    resetCart: (state) => {
      state.products = [];
    },

    // ================== Wishlist Reducers =================
    toggleWishlist: (state, action) => {
      const item = state.wishlist.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        state.wishlist = state.wishlist.filter(
          (item) => item._id !== action.payload._id
        );
      } else {
        state.wishlist.push(action.payload);
      }
    },
  },
});

export const {
  // User actions
  loginUser,
  logoutUser,
  
  // Admin actions
  loginAdmin,
  logoutAdmin,
  setAdminStats,
  setAdminChartData,
  clearAdminData,
  
  // Cart actions
  addToCart,
  increaseQuantity,
  drecreaseQuantity,
  deleteItem,
  resetCart,
  
  // Wishlist actions
  toggleWishlist,
} = orebiSlice.actions;

export default orebiSlice.reducer;