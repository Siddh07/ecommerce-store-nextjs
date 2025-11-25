"use client";

import React from "react";
import { useCart } from "@/app/CartContext"; // Make sure this path is correct!
import Link from "next/link";


export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  // 1. Handle Empty State
  if (cart.items.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p>Add some products to your cart to see them here.</p>
      </div>
    ); // End of return
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <ul>
        {cart.items.map((item) => (
          /* FIX: Use item.product.id for the key */
          <li key={item.product.id} className="mb-4 border-b pb-2">
            {/* FIX: Drill down to item.product for details */}
            <span className="font-bold">{item.product.title}</span>

            <span className="mx-2">- ${item.product.price}</span>

            <span className="mx-2 text-gray-600">Qty: {item.quantity}</span>

            <button
              className="ml-2 text-red-500 border border-red-500 px-2 rounded"
              /* FIX: Pass item.product.id */
              onClick={() => removeFromCart(item.product.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t pt-4">
        <p className="font-bold">Total Items: {cart.totals.totalItems}</p>
        <p className="font-bold text-xl">
          Total Price: ${cart.totals.totalPrice.toFixed(2)}
        </p>
      </div>
<Link href="/checkout" >  
 <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" >
        Proceed to Checkout
      </button>
      </Link>  
    </div>
  );
}
