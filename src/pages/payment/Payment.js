import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CreditCard, Truck, Lock } from "lucide-react";

import { resetCart } from "../../redux/orebiSlice";
import { usePlaceOrder } from "../../api/internal"; // IMPORT THE NEW HOOK

const Payment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, userInfo } = useSelector((state) => state.orebiReducer);

    const { placeOrder, loading: isPlacingOrder } = usePlaceOrder();

    const [clientName, setClientName] = useState(userInfo?.name || "");
    const [email, setEmail] = useState(userInfo?.email || "");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("cod");

    const [totalAmt, setTotalAmt] = useState(0);
    const [shippingCharge, setShippingCharge] = useState(0);

    useEffect(() => {
        let price = 0;
        products.forEach((item) => {
            price += item.price * item.quantity;
        });
        setTotalAmt(price);
    }, [products]);

    useEffect(() => {
        if (totalAmt > 0 && totalAmt <= 500) {
            setShippingCharge(50);
        } else if (totalAmt > 500) {
            setShippingCharge(0);
        } else {
            setShippingCharge(0);
        }
    }, [totalAmt]);

    useEffect(() => {
        if (products.length === 0 && !isPlacingOrder) {
            navigate("/cart");
        }
    }, [products, navigate, isPlacingOrder]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!clientName || !email || !phone || !address || !city || !zip) {
            toast.error("Please fill in all shipping details.");
            return;
        }

        const orderDetails = {
            orderItems: products.map((item) => ({
                quantity: item.quantity,
                _id: item._id,
            })),
            shippingAddress: {
                fullName: clientName,
                address,
                city,
                zipCode: zip,
                phone,
            },
            paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Stripe",
            itemsPrice: totalAmt,
            shippingPrice: shippingCharge,
            totalPrice: totalAmt + shippingCharge,
        };

        try {
            const data = await placeOrder(orderDetails);

            // IF STRIPE PAYMENT, REDIRECT TO CHECKOUT URL
            if (data && data.url) {
                // Redirect to Stripe's checkout page
                window.location.href = data.url;
            } else {
                // THIS IS FOR CASH ON DELIVERY
                toast.success("Order placed successfully!");
                dispatch(resetCart());
                navigate("/");
            }
        } catch (error) {
            toast.error(
                error.message || "Could not place order. Please try again."
            );
        }
    };

    const CustomBreadcrumbs = ({ title }) => (
        <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-primeColor">
                {title}
            </h1>
            <p className="text-sm font-normal text-gray-500 capitalize mt-2 flex items-center">
                <span>Home</span>
                <span className="px-1">/</span>
                <span className="capitalize font-semibold text-gray-700">
                    Paymentgateway
                </span>
            </p>
        </div>
    );

    return (
        <div className="max-w-container mx-auto px-4 py-12">
            <CustomBreadcrumbs title="Checkout" />
            <form
                onSubmit={handlePlaceOrder}
                className="grid grid-cols-1 lg:grid-cols-5 gap-10"
            >
                {/* Left Side: Shipping & Payment */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Shipping Details */}
                    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800">
                            Shipping Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) =>
                                        setClientName(e.target.value)
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primeColor"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primeColor"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primeColor"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primeColor"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primeColor"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    ZIP / Postal Code
                                </label>
                                <input
                                    type="text"
                                    value={zip}
                                    onChange={(e) => setZip(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primeColor"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800">
                            Payment Method
                        </h2>
                        <div className="space-y-4">
                            <div
                                onClick={() => setPaymentMethod("cod")}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "cod"
                                        ? "border-primeColor bg-orange-50 ring-2 ring-primeColor"
                                        : "border-gray-300 hover:border-gray-400"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment"
                                        id="cod"
                                        checked={paymentMethod === "cod"}
                                        readOnly
                                        className="h-4 w-4 text-primeColor focus:ring-primeColor border-gray-300"
                                    />
                                    <label
                                        htmlFor="cod"
                                        className="ml-3 flex items-center text-sm font-medium text-gray-900 cursor-pointer"
                                    >
                                        <Truck className="w-5 h-5 mr-3 text-gray-600" />
                                        Cash on Delivery (COD)
                                    </label>
                                </div>
                            </div>
                            <div
                                onClick={() => setPaymentMethod("stripe")}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "stripe"
                                        ? "border-primeColor bg-orange-50 ring-2 ring-primeColor"
                                        : "border-gray-300 hover:border-gray-400"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment"
                                        id="stripe"
                                        checked={paymentMethod === "stripe"}
                                        readOnly
                                        className="h-4 w-4 text-primeColor focus:ring-primeColor border-gray-300"
                                    />
                                    <label
                                        htmlFor="stripe"
                                        className="ml-3 flex items-center text-sm font-medium text-gray-900 cursor-pointer"
                                    >
                                        <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                                        Pay with Card (Stripe)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm sticky top-24">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800">
                            Order Summary
                        </h2>
                        <div className="space-y-4 divide-y divide-gray-200">
                            {products.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex justify-between items-start pt-4 first:pt-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-md object-cover border"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-gray-900 text-right">
                                        Rs.{" "}
                                        {(item.price * item.quantity).toFixed(
                                            2
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                            <p className="flex justify-between text-md">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold text-gray-900">
                                    Rs. {totalAmt.toFixed(2)}
                                </span>
                            </p>
                            <p className="flex justify-between text-md">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-semibold text-gray-900">
                                    Rs. {shippingCharge.toFixed(2)}
                                </span>
                            </p>
                            <p className="flex justify-between text-xl font-bold mt-2 text-gray-800">
                                <span>Total</span>
                                <span className="text-primeColor">
                                    Rs. {(totalAmt + shippingCharge).toFixed(2)}
                                </span>
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={isPlacingOrder}
                            className="w-full mt-8 h-12 bg-primeColor text-white font-bold text-lg rounded-md hover:bg-black duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <Lock className="w-5 h-5" />
                            <span>
                                {isPlacingOrder
                                    ? "Processing..."
                                    : paymentMethod === "cod"
                                        ? "Place Order"
                                        : "Pay Now"}
                            </span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Payment;