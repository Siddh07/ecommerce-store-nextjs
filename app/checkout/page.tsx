"use client";

import { useForm } from "react-hook-form";
import { useCart } from "@/app/CartContext"; // Ensure this path is correct
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CheckoutFormData {
  name: string;
  address: string;
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function CheckoutPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();
  
  // ✅ FIX 1: Get data from the Hook, not the Page file
  const { cart, clearCart } = useCart(); 
  const router = useRouter();
  
  // ✅ FIX 2: Define the missing state variable
  const [isProcessing, setIsProcessing] = useState(false);

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log("Order Submitted:", data);
    clearCart();
    alert("Order placed successfully!");
    router.push("/");
  };

  // ✅ FIX 3: Check cart.items, not CartPage.items
  if (cart.items.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p>Add some products to your cart to see them here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Name Field */}
        <div>
          <label className="block font-bold mb-1">Full Name</label>
          <input 
            {...register("name", { required: "Name is required" })}
            className="w-full border p-2 rounded"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label className="block font-bold mb-1">Email</label>
          <input 
            {...register("email", { required: "Email is required" })}
            className="w-full border p-2 rounded"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Address Field */}
        <div>
          <label className="block font-bold mb-1">Address</label>
          <input 
            {...register("address", { required: "Address is required" })}
            className="w-full border p-2 rounded"
            placeholder="123 Main St"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        {/* Fake Card Number */}
        <div>
          <label className="block font-bold mb-1">Card Number</label>
          <input 
            {...register("cardNumber", { required: "Card number is required" })}
            className="w-full border p-2 rounded"
            placeholder="0000 0000 0000 0000"
          />
          {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isProcessing}
          className={`w-full py-3 mt-4 text-white font-bold rounded ${
            isProcessing ? "bg-gray-400" : "bg-black hover:bg-gray-800"
          }`}
        >
          {isProcessing ? "Processing..." : `Pay $${cart.totals.totalPrice.toFixed(2)}`}
        </button>

      </form>
    </div>
  );
}