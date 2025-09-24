import axios from "axios";
import { useState, useCallback } from "react";

const BACKEND_URL = "https://backend-production-5823.up.railway.app/api";

const API = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor for debugging
API.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url, 'with credentials:', config.withCredentials);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
API.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.status, 'from:', response.config.url);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.status, error.response?.data);
        
        if (error.response?.status === 401) {
            console.log('Unauthorized - session may have expired');
        }
        
        return Promise.reject(error);
    }
);

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.post("/auth/sign-in", { email, password });
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { login, loading, error };
};

// NEW: Admin Login Hook
export const useAdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const adminLogin = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            console.log('Attempting admin login...');
            const res = await API.post("/auth/admin-login", { email, password });
            console.log('Admin login successful:', res.data);
            return res.data;
        } catch (err) {
            console.error('Admin login failed:', err.response?.data);
            setError(err.response?.data?.message || "Admin login failed");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { adminLogin, loading, error };
};

// NEW: Admin Stats Hook
export const useGetAdminStats = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAdminStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching admin stats...');
            const res = await API.get("/admin/stats");
            console.log('Admin stats received:', res.data);
            return res.data;
        } catch (err) {
            console.error('Failed to fetch admin stats:', err.response?.data);
            setError(err.response?.data?.message || "Failed to fetch admin stats");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getAdminStats, loading, error };
};

// NEW: Admin Chart Data Hook
export const useGetAdminChartData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAdminChartData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching admin chart data...');
            const res = await API.get("/admin/statics");
            console.log('Admin chart data received:', res.data);
            return res.data;
        } catch (err) {
            console.error('Failed to fetch admin chart data:', err.response?.data);
            setError(err.response?.data?.message || "Failed to fetch admin chart data");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getAdminChartData, loading, error };
};

export const useSignUp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signUp = useCallback(async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.post("/auth/sign-up", {
                name,
                email,
                password,
            });
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || "Sign-up failed");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { signUp, loading, error };
};

export const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const logout = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.post("/auth/log-out");
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || "Logout failed");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { logout, loading, error };
};

// HOOK TO ADD ITEM TO CART (LOGGED-IN USERS ONLY)
export const useAddToCart = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addToCart = useCallback(async (productId, quantity, user) => {
        setLoading(true);
        setError(null);

        if (!user) {
            const message = "Please login first to add items to your cart.";
            setError(message);
            setLoading(false);
            // Throw an error that mimics an Axios error for consistent handling
            throw { response: { data: { message } } };
        }

        try {
            const res = await API.post("/user/cart", { productId, quantity });
            return res.data;
        } catch (err) {
            const message =
                err.response?.data?.message || "Failed to add to cart";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { addToCart, loading, error };
};

// HOOK TO ADD/REMOVE ITEM FROM WISHLIST (LOGGED-IN USERS ONLY)
export const useAddToWishlist = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleWishlist = useCallback(async (productId, user) => {
        setLoading(true);
        setError(null);

        if (!user) {
            const message = "Please login first to add items to your wishlist.";
            setError(message);
            setLoading(false);
            throw { response: { data: { message } } };
        }

        try {
            const res = await API.post("/user/wishlist", { productId });
            return res.data;
        } catch (err) {
            const message =
                err.response?.data?.message || "Failed to update wishlist";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { toggleWishlist, loading, error };
};

export const usePlaceOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const placeOrder = useCallback(async (orderDetails) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.post("/order/create-order", orderDetails);
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Failed to place order.";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return { placeOrder, loading, error };
};

// HOOK TO FETCH PRODUCTS DYNAMICALLY
export const useGetProducts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProducts = useCallback(async (params) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get("/product", { params });
            return res.data;
        } catch (err) {
            const message = err.response?.data?.message || "Failed to fetch products.";
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { getProducts, loading, error };
};

// HOOK TO FETCH CATEGORIES DYNAMICALLY
export const useGetCategories = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get("/category");
            return res.data;
        } catch (err) {
            const message = err.response?.data?.message || "Failed to fetch categories.";
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { getCategories, loading, error };
};

// HOOK to fetch a single product by its ID
export const useGetProductById = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProductById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get(`/product/${id}`);
            return res.data;
        } catch (err) {
            const message = err.response?.data?.message || "Failed to fetch product.";
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { getProductById, loading, error };
};

// NEW HOOK TO FETCH BANNERS
export const useGetBanners = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getBanners = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get("/banner"); // Fetches from GET /api/banner
            return res.data;
        } catch (err) {
            const message = err.response?.data?.message || "Failed to fetch banners.";
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { getBanners, loading, error };
};