import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);

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
      setShippingCharge(0); // Free shipping for orders above 500
    } else {
      setShippingCharge(0);
    }
  }, [totalAmt]);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Cart" />
      {products.length > 0 ? (
        <div className="pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="w-full h-20 bg-gray-100 text-primeColor hidden md:grid grid-cols-5 place-content-center px-6 text-lg font-semibold rounded-t-lg">
                <h2 className="col-span-2">Product</h2>
                <h2>Price</h2>
                <h2>Quantity</h2>
                <h2>Sub Total</h2>
              </div>
              <div className="mt-5 flex flex-col gap-5">
                {products.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => dispatch(resetCart())}
                  className="py-2 px-6 bg-red-500 text-white font-semibold uppercase hover:bg-red-600 duration-300 rounded-md"
                >
                  Reset Cart
                </button>
                <div className="flex items-center gap-2">
                  <input
                    className="w-44 h-10 px-4 border text-primeColor text-sm outline-none border-gray-300 rounded-md focus:border-primeColor"
                    type="text"
                    placeholder="Coupon Code"
                  />
                  <button className="h-10 px-4 bg-gray-800 text-white rounded-md hover:bg-black transition-colors">
                    Apply Coupon
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Totals */}
            <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg h-fit sticky top-32">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Cart Totals</h2>
              <div className="space-y-4 text-lg">
                <p className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Subtotal</span>
                  <span className="font-bold text-gray-800">
                    Rs. {totalAmt.toFixed(2)}
                  </span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-600">Shipping Charge</span>
                  <span className="font-bold text-gray-800">
                    Rs. {shippingCharge.toFixed(2)}
                  </span>
                </p>
                <p className="flex justify-between text-xl">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="font-extrabold text-primeColor">
                    Rs. {(totalAmt + shippingCharge).toFixed(2)}
                  </span>
                </p>
              </div>
              <div className="mt-8">
                <Link to="/paymentgateway">
                  <button className="w-full h-12 bg-primeColor text-white font-bold text-lg rounded-md hover:bg-black duration-300">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Your Cart feels lonely.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Your Shopping cart lives to serve. Give it purpose – fill it with
              great products and make it happy.
            </p>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
