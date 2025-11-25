'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the Product interface
export interface Product {
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

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartTotals {
    totalItems: number;
    totalPrice: number;
}

export interface CartState {
    items: CartItem[];
    totals: CartTotals;
}

// ✅ UPDATE 1: Add new functions to the Context Type
interface CartContextType {
    cart: CartState;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    decreaseQuantity: (productId: number) => void; // <--- New
    clearCart: () => void; // <--- New
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartState>({
        items: [],
        totals: { totalItems: 0, totalPrice: 0 },
    });

    // Load from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('shopEasy-cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('shopEasy-cart', JSON.stringify(cart));
    }, [cart]);

    // Helper to calculate totals (DRY Principle)
    const calculateTotals = (items: CartItem[]) => {
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        return { totalItems, totalPrice };
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.items.find(item => item.product.id === product.id);
            let newItems;
            if (existing) {
                newItems = prev.items.map(item => 
                    item.product.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
                );
            } else {
                newItems = [...prev.items, { product, quantity: 1 }];
            }
            return { items: newItems, totals: calculateTotals(newItems) };
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => {
            const newItems = prev.items.filter(item => item.product.id !== productId);
            return { items: newItems, totals: calculateTotals(newItems) };
        });
    };

    // ✅ UPDATE 2: Implement decreaseQuantity
    const decreaseQuantity = (productId: number) => {
        setCart(prev => {
            const existing = prev.items.find(item => item.product.id === productId);
            if (!existing || existing.quantity === 1) return prev;

            const newItems = prev.items.map(item => 
                item.product.id === productId 
                ? { ...item, quantity: item.quantity - 1 } 
                : item
            );
            return { items: newItems, totals: calculateTotals(newItems) };
        });
    };

    // ✅ UPDATE 3: Implement clearCart
    const clearCart = () => {
        setCart({
            items: [],
            totals: { totalItems: 0, totalPrice: 0 }
        });
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            decreaseQuantity, // <--- Exported
            clearCart         // <--- Exported
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}