import { useState, useEffect } from "react";
import {
    Search,
    Heart,
    ShoppingCart,
    Menu,
    X,
    LogOut,
    LoaderCircle,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/orebiSlice"; // Import logoutUser
import toast from "react-hot-toast";
import { useLogout } from "../../api/internal";

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { logout, loading } = useLogout();

    const { userInfo, products, wishlist } = useSelector(
        (state) => state.orebiReducer
    );

    // FIX: Calculate the total quantity of items in the cart
    const [totalQuantity, setTotalQuantity] = useState(0);
    useEffect(() => {
        let quantity = 0;
        products.forEach((item) => {
            quantity += item.quantity;
        });
        setTotalQuantity(quantity);
    }, [products]);


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

    return (
        <header className="header py-2 lg:py-4 border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="col1 w-[40%] lg:w-[25%]">
                    <Link to="/" className="block">
                        <img
                            src="https://serviceapi.spicezgold.com/download/1750047766437_logo.jpg"
                            alt="Logo"
                            className="max-w-[140px] lg:max-w-[200px] h-auto"
                        />
                    </Link>
                </div>

                <div
                    className={`col2 ${isSearchOpen
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

                        <li className="hidden lg:block list-none">
                            {userInfo ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium">
                                        Hi,{" "}
                                        {userInfo.name
                                            ? userInfo.name.split(" ")[0]
                                            : "User"}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
                                    >
                                        {loading ? (
                                            <LoaderCircle size={16} />
                                        ) : (
                                            <>
                                                <LogOut size={16} /> Logout
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        className="link transition text-[15px] font-[500] text-gray-700 hover:text-primeColor"
                                        to="/signin"
                                    >
                                        Login
                                    </Link>
                                    <span className="mx-2 text-gray-400">
                                        |
                                    </span>
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
                                            {/* FIX: Display total quantity instead of array length */}
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
                        <div className="flex flex-col space-y-4">
                            {userInfo ? (
                                <>
                                    <p className="p-2 font-medium">
                                        Welcome, {userInfo.name}
                                    </p>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-500 font-medium p-2 text-left hover:bg-gray-50 rounded-lg"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/signin"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="text-gray-700 font-medium hover:text-primeColor p-2"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="text-gray-700 font-medium hover:text-primeColor p-2"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                            <hr />
                            <Link
                                to="/my-list"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
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