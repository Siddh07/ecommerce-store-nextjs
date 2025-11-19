'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the Product interface (what comes from API)
interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    thumbnail: string;
    rating: number;
    brand: string;
    category: string;
    images: string[];
}

// CartItem contains Product + quantity
interface CartItem {
    product: Product;
    quantity: number;
}

interface CartTotals {
    totalItems: number;
    totalPrice: number;
}

interface CartState {
    items: CartItem[];
    totals: CartTotals;
}

// Context provides cart state AND functions to modify it
const CartContext = createContext<{
    cart: CartState;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
} | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartState>({
        items: [],
        totals: {
            totalItems: 0,
            totalPrice: 0,
        },
    });

    // Load cart from localStorage when component mounts
    useEffect(() => {
        const savedCart = localStorage.getItem('shopEasy-cart');
        if (savedCart) {
            try {
                const cartData = JSON.parse(savedCart);
                setCart(cartData);
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('shopEasy-cart', JSON.stringify(cart));
    }, [cart]);

    // Add product to cart
    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.items.find(
                item => item.product.id === product.id
            );

            let newItems: CartItem[];
            
            if (existingItem) {
                // Product already in cart - increase quantity
                newItems = prevCart.items.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Product not in cart - add new item
                newItems = [...prevCart.items, { product, quantity: 1 }];
            }

            // Calculate new totals
            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = newItems.reduce(
                (sum, item) => sum + (item.product.price * item.quantity), 
                0
            );

            return {
                items: newItems,
                totals: { totalItems, totalPrice }
            };
        });
    };

    // Remove product from cart
    const removeFromCart = (productId: number) => {
        setCart(prevCart => {
            const newItems = prevCart.items.filter(
                item => item.product.id !== productId
            );
            
            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = newItems.reduce(
                (sum, item) => sum + (item.product.price * item.quantity), 
                0
            );

            return {
                items: newItems,
                totals: { totalItems, totalPrice }
            };
        });
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Hook to use the cart context
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}