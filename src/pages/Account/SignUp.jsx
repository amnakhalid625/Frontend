import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/orebiSlice";
import toast from "react-hot-toast";
import { useSignUp } from "../../api/internal";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { signUp, loading } = useSignUp();

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!checked) {
            return toast.error("Please agree to the Terms of Service.");
        }
        if (!name || !email || !password) {
            return toast.error("Please fill in all fields.");
        }
        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters.");
        }

        try {
            const data = await signUp(name, email, password);

            // 1. REMOVED: No longer automatically logging the user in.
            // dispatch(loginUser(data.user)); 

            // 2. UPDATED: Toast message is more informative.
            toast.success("User registered successfully!");

            // 3. UPDATED: Navigate to the sign-in page instead of home.
            navigate("/signin");
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : "An unknown error occurred.";
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Main Card */}
                <div className=" backdrop-blur-sm rounded-3xl shadow-xl border  p-8 md:p-10">
                    {/* Logo Section */}
                    <Link to="/" className="flex justify-center mb-8">
                        <div className="relative">
                            <img
                                src="/newlogo.png"
                                alt="Logo"
                                className="w-32 md:w-36 transition-transform hover:scale-105 duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 rounded-lg"></div>
                        </div>
                    </Link>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 ">
                            Create Account
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            Join thousands of happy customers
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignUp} className="space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    className="w-full h-12 pl-12 pr-4 text-base rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10 transition-all duration-300"
                                    type="text"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    className="w-full h-12 pl-12 pr-4 text-base rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10 transition-all duration-300"
                                    type="email"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="w-full h-12 pl-12 pr-12 text-base rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10 transition-all duration-300"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-3">
                            <input
                                onChange={() => setChecked(!checked)}
                                className="w-4 h-4 mt-0.5 cursor-pointer accent-gray-900"
                                type="checkbox"
                                id="terms"
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm text-gray-600 cursor-pointer leading-relaxed"
                            >
                                I agree to the{" "}
                                <Link to="/terms" className="text-gray-900 hover:underline font-medium">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-gray-900 hover:underline font-medium">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !checked}
                            className="w-full bg-gradient-to-r from-primeColor to-primeColor/90 hover:from-primeColor/90 hover:to-primeColor text-white h-12 rounded-xl font-semibold text-base transition-all duration-300  disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primeColor/25 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-t-white rounded-full animate-spin"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                        </div>
                    </div>

                    {/* Sign In Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">
                            Welcome back to our platform
                        </p>
                        <Link
                            to="/signin"
                            className="inline-flex items-center gap-2 text-primeColor  font-semibold text-sm transition-colors group"
                        >
                            Sign in to your account
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-500">
                        By creating an account, you agree to our{" "}
                        <Link to="/terms" className="text-primeColor hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-primeColor hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;