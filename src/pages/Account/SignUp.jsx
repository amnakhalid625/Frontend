import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/orebiSlice";
import toast from "react-hot-toast";
import { useSignUp } from "../../api/internal";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <div className="w-full flex-grow flex items-center justify-center p-4 py-12 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                <form onSubmit={handleSignUp} className="flex flex-col gap-6">
                    <Link to="/" className="flex justify-center mb-4">
                        <img
                            src="https://serviceapi.spicezgold.com/download/1750047766437_logo.jpg"
                            alt="Logo"
                            className="w-36"
                        />
                    </Link>
                    <h1 className="text-center font-bold text-2xl text-gray-800">
                        Create a New Account
                    </h1>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className="w-full h-12 px-4 text-base rounded-md border border-gray-300 outline-none focus:border-primeColor"
                            type="text"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="w-full h-12 px-4 text-base rounded-md border border-gray-300 outline-none focus:border-primeColor"
                            type="email"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="w-full h-12 px-4 text-base rounded-md border border-gray-300 outline-none focus:border-primeColor"
                            type="password"
                            placeholder="Create a password"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            onChange={() => setChecked(!checked)}
                            className="w-4 h-4 cursor-pointer accent-primeColor"
                            type="checkbox"
                            id="terms"
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm text-gray-600 cursor-pointer"
                        >
                            I agree to the{" "}
                            <span className="text-primeColor hover:underline">
                                Terms of Service
                            </span>
                            .
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !checked}
                        className="bg-primeColor hover:bg-black text-white w-full text-base font-medium h-12 rounded-md duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                    <p className="text-sm text-center text-gray-600">
                        Already have an Account?{" "}
                        <Link
                            to="/signin"
                            className="text-primeColor hover:underline font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;