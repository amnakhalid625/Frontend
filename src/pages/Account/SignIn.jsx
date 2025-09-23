import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/orebiSlice";
import toast from "react-hot-toast";
import { useLogin } from "../../api/internal";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { login, loading } = useLogin();

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return toast.error("Please fill in all fields");
        }

        try {
            const data = await login(email, password);

            dispatch(loginUser(data.user));
            toast.success("Login successful!");
            navigate("/");
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : "Invalid email or password.";
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100/50 p-8 md:p-10">
                    {/* Logo Section */}
                    <Link to="/" className="flex justify-center mb-8">
                        <div className="relative">
                            <img
                                src="https://serviceapi.spicezgold.com/download/1750047766437_logo.jpg"
                                alt="Logo"
                                className="w-32 md:w-36 transition-transform hover:scale-105 duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 rounded-lg"></div>
                        </div>
                    </Link>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            Sign in to continue your shopping journey
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignIn} className="space-y-6">
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
                                    className="w-full h-12 pl-12 pr-4 text-base rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-primeColor focus:bg-white focus:ring-2 focus:ring-primeColor/10 transition-all duration-300"
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
                                    className="w-full h-12 pl-12 pr-12 text-base rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-primeColor focus:bg-white focus:ring-2 focus:ring-primeColor/10 transition-all duration-300"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
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

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primeColor hover:text-primeColor/80 font-medium transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primeColor to-primeColor/90 hover:from-primeColor/90 hover:to-primeColor text-white h-12 rounded-xl font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primeColor/25 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing In...
                                </div>
                            ) : (
                                <>
                                    Sign In
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
                            <span className="px-4 bg-white text-gray-500">New to our platform?</span>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">
                            Join thousands of happy customers
                        </p>
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 text-primeColor hover:text-primeColor/80 font-semibold text-sm transition-colors group"
                        >
                            Create your account
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-500">
                        By signing in, you agree to our{" "}
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

export default SignIn;