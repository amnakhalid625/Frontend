import { useState, useEffect, useRef } from "react";
import {
    Search,
    Heart,
    ShoppingCart,
    Menu,
    X,
    LogOut,
    LoaderCircle,
    User,
    Settings,
    Package,
    ChevronDown,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/orebiSlice";
import toast from "react-hot-toast";
import { useLogout } from "../../api/internal";

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dropdownRef = useRef(null);

    const { logout, loading } = useLogout();

    const { userInfo, products, wishlist } = useSelector(
        (state) => state.orebiReducer
    );

    const [totalQuantity, setTotalQuantity] = useState(0);
    
    useEffect(() => {
        let quantity = 0;
        products.forEach((item) => {
            quantity += item.quantity;
        });
        setTotalQuantity(quantity);
    }, [products]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?q=${searchQuery.trim()}`);
            setIsSearchOpen(false);
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogout = async () => {
        try {
            const data = await logout();

            if (data) {
                dispatch(logoutUser());
                toast.success("Logged out successfully.");
                setIsMobileMenuOpen(false);
                setIsUserDropdownOpen(false);
                navigate("/");
            }
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : "An unknown error occurred.";
            toast.error(message);
        }
    };

    // Get user initials for avatar
    const getUserInitials = (name) => {
        if (!name) return "U";
        const names = name.split(" ");
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return names[0][0].toUpperCase();
    };

    return (
        <header className="header py-2 lg:py-4 border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between max-w-[89rem]">
                <div className="col1 w-[40%] lg:w-[25%]">
                    <Link to="/" className="block">
                        <img
                            src="/newlogo.png"
                            alt="Logo"
                            className="max-w-[140px] lg:max-w-[170px] h-[50px] object-contain"
                        />
                    </Link>
                </div>

                <div
                    className={`col2 ${
                        isSearchOpen
                            ? "fixed top-0 left-0 w-full h-full bg-white z-50 p-2 block"
                            : "hidden"
                    } lg:block lg:w-[40%] lg:static lg:p-0 lg:bg-transparent`}
                >
                    {isSearchOpen && (
                        <div className="lg:hidden flex justify-end mb-4">
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="p-2"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                    <form
                        onSubmit={handleSearch}
                        className="searchBox w-full h-[50px] bg-[#e5e5e5] rounded-full relative p-2 flex items-center"
                    >
                        <input
                            type="text"
                            placeholder="Search for products..."
                            className="w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute top-[8px] right-[5px] z-50 w-[37px] h-[37px] rounded-full bg-white hover:bg-gray-50 flex items-center justify-center"
                        >
                            <Search className="text-[#4e4e4e] w-5 h-5" />
                        </button>
                    </form>
                </div>

                <div className="col3 w-[60%] lg:w-[30%] flex items-center justify-end">
                    <ul className="flex items-center justify-end gap-0 lg:gap-3 w-full">
                        <li className="lg:hidden">
                            <button
                                className="p-2"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                            >
                                <Search className="w-5 h-5 text-gray-600" />
                            </button>
                        </li>

                        <li className="hidden lg:block list-none relative" ref={dropdownRef}>
                            {userInfo ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                        className="flex items-center gap-2 bg-primeColor/10 hover:bg-primeColor/20 rounded-xl px-3 py-2.5 transition-all duration-200 min-w-[100px]"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primeColor flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                            {getUserInitials(userInfo.name)}
                                        </div>
                                        <div className="flex-1 flex flex-col items-start">
                                            <span className="text-sm font-semibold text-gray-800">
                                                {userInfo.name
                                                    ? userInfo.name.split(" ")[0]
                                                    : "User"}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            className={`w-4 h-4 text-gray-900 transition-transform duration-200 ${
                                                isUserDropdownOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {isUserDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {userInfo.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {userInfo.email}
                                                </p>
                                            </div>

                                            <div className="py-1">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span>My Profile</span>
                                                </Link>

                                                <Link
                                                    to="/orders"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    <Package className="w-4 h-4" />
                                                    <span>My Orders</span>
                                                </Link>

                                                <Link
                                                    to="/settings"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    <span>Settings</span>
                                                </Link>
                                            </div>

                                            <div className="border-t border-gray-100 py-1">
                                                <button
                                                    onClick={handleLogout}
                                                    disabled={loading}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-primeColor hover:bg-red-50 transition-colors w-full"
                                                >
                                                    {loading ? (
                                                        <LoaderCircle className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <LogOut className="w-4 h-4" />
                                                    )}
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link
                                        className="link transition text-[15px] font-[500] text-gray-700 hover:text-primeColor"
                                        to="/signin"
                                    >
                                        Login
                                    </Link>
                                    <span className="mx-2 text-gray-400">|</span>
                                    <Link
                                        className="link transition text-[15px] font-[500] text-gray-700 hover:text-primeColor"
                                        to="/signup"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </li>

                        <li>
                            <Link to="/my-list" aria-label="Wishlist">
                                <button className="p-2 relative" type="button">
                                    <div className="relative">
                                        <Heart className="w-6 h-6 text-gray-600 hover:text-primeColor" />
                                        <span className="absolute -top-2 -right-2 bg-primeColor text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                            {wishlist?.length}
                                        </span>
                                    </div>
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link to="/cart">
                                <button className="p-2 relative" type="button">
                                    <div className="relative">
                                        <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-primeColor" />
                                        <span className="absolute -top-2 -right-2 bg-primeColor text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                            {totalQuantity}
                                        </span>
                                    </div>
                                </button>
                            </Link>
                        </li>
                        <li className="lg:hidden">
                            <button
                                className="p-2"
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="lg:hidden mt-4 pb-4 border-t pt-4 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col space-y-2">
                            {userInfo ? (
                                <>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                                        <div className="w-12 h-12 rounded-full bg-primeColor flex items-center justify-center text-white font-semibold">
                                            {getUserInitials(userInfo.name)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {userInfo.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {userInfo.email}
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="font-medium">My Profile</span>
                                    </Link>

                                    <Link
                                        to="/orders"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                                    >
                                        <Package className="w-5 h-5" />
                                        <span className="font-medium">My Orders</span>
                                    </Link>

                                    <Link
                                        to="/settings"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                                    >
                                        <Settings className="w-5 h-5" />
                                        <span className="font-medium">Settings</span>
                                    </Link>

                                    <hr className="my-2" />

                                    <button
                                        onClick={handleLogout}
                                        disabled={loading}
                                        className="flex items-center gap-3 p-3 text-primeColor hover:bg-red-50 rounded-lg font-medium"
                                    >
                                        {loading ? (
                                            <LoaderCircle className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <LogOut className="w-5 h-5" />
                                        )}
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/signin"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-gray-700 font-medium hover:text-primeColor p-3 hover:bg-gray-50 rounded-lg"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-gray-700 font-medium hover:text-primeColor p-3 hover:bg-gray-50 rounded-lg"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                            <hr />
                            <Link
                                to="/my-list"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                            >
                                <Heart className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-700 font-medium">
                                    Wishlist
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;