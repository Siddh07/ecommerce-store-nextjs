'use client'; // This makes the button interactive

import { useCart, Product } from '../app/CartContext';
import { useState } from 'react';


export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop click from bubbling up
    addToCart(product);
    
    // Cool visual feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleClick}
      style={{
        padding: '15px 30px',
        backgroundColor: isAdded ? '#28a745' : '#0070f3',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: '100%',
        transition: 'background-color 0.3s'
      }}
    >
      {isAdded ? '✅ Added!' : 'Add to Cart 🛒'}
    </button>
  );
}