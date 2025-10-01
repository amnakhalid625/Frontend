import React from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  deleteItem,
  drecreaseQuantity,
  increaseQuantity,
} from "../../redux/orebiSlice";

const ItemCard = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <div className="w-full grid grid-cols-5 items-center gap-4 border p-4 rounded-lg shadow-sm bg-white">
      {/* Product Info */}
      <div className="col-span-5 md:col-span-2 flex items-center gap-4">
        <div className="w-32 h-32 flex-shrink-0">
          <img
            className="w-full h-full object-cover rounded-md"
            src={item.image}
            alt="productImage"
          />
        </div>
        <div>
          <h1 className="font-semibold text-gray-800 text-lg">{item.name}</h1>
          <p className="text-sm text-gray-500">
            Color: {item.colors || "N/A"}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-2 md:col-span-1 text-center">
        <p className="text-lg font-semibold text-gray-800">
          Rs. {item.price.toFixed(2)}
        </p>
      </div>

      {/* Quantity */}
      <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-4 text-lg">
        <div className="flex items-center border rounded-md">
          <button
            onClick={() => dispatch(drecreaseQuantity({ _id: item._id }))}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer duration-300"
          >
            -
          </button>
          <p className="w-10 text-center">{item.quantity}</p>
          <button
            onClick={() => dispatch(increaseQuantity({ _id: item._id }))}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer duration-300"
          >
            +
          </button>
        </div>
      </div>

      {/* Sub Total & Remove */}
      <div className="col-span-1 flex md:flex-col items-center justify-between md:justify-center md:gap-2 text-center">
        <p className="text-lg font-bold text-primeColor">
          Rs. {(item.quantity * item.price).toFixed(2)}
        </p>
        <button onClick={() => dispatch(deleteItem(item._id))}>
          <X className="text-gray-500 hover:text-primeColor/90 duration-300 cursor-pointer w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
