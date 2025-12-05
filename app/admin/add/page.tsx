'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    thumbnail: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // 👈 The translation happening here!
      });

      if (!response.ok) throw new Error('Failed to create');

      alert('Product Created! 🎉');
      router.push('/admin'); 
      router.refresh();
    } catch (error) {
      // 1. Check if the error is a standard Error object
      if (error instanceof Error) {
        alert(error.message); // ✅ Shows "Product already exists" or "Failed to create"
      } else {
        alert('An unknown error occurred'); // Fallback
      }
    }
}
                                                                                                                                                               
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h1>Add New Product 📦</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="text" name="title" placeholder="Product Title" required
          value={formData.title} onChange={handleChange}
          style={{ padding: '10px', fontSize: '1rem' }}
        />

        <textarea 
          name="description" placeholder="Description" required
          value={formData.description} onChange={handleChange}
          style={{ padding: '10px', fontSize: '1rem', minHeight: '100px' }}
        />

        <input 
          type="number" name="price" placeholder="Price ($)" required
          value={formData.price} onChange={handleChange}
          style={{ padding: '10px', fontSize: '1rem' }}
        />

        <input 
          type="text" name="category" placeholder="Category (e.g. beauty)" required
          value={formData.category} onChange={handleChange}
          style={{ padding: '10px', fontSize: '1rem' }}
        />

        <input 
          type="url" name="thumbnail" placeholder="Image URL (https://...)" required
          value={formData.thumbnail} onChange={handleChange}
          style={{ padding: '10px', fontSize: '1rem' }}
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '15px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Saving...' : 'Create Product'}
        </button>

      </form>
    </div>
  );
}