'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams(); // Get the ID from the URL
  const id = params?.id; // Safely access ID

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    thumbnail: ''
  });

  // 1. Fetch Existing Data on Load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        
        const data = await res.json();
        
        // Pre-fill the form
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price.toString(), // Convert number to string for input
          category: data.category,
          thumbnail: data.thumbnail
        });
      } catch (error) {
        alert('Error loading product');
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 2. Send PUT Request to Update
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT', // 👈 The "Update" Verb
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update');

      alert('Product Updated! 🎉');
      router.push('/admin');
      router.refresh();
      
    } catch (error) {
      alert('Error updating product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h1>Edit Product ✏️</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" name="title" required
          value={formData.title} onChange={handleChange}
          style={{ padding: '10px', fontSize: '1rem' }}
        />
        <textarea 
          name="description" required
          value={formData.description} onChange={handleChange}
          style={{ padding: '10px', fontSize: '1rem', minHeight: '100px' }}
        />
        <input 
          type="number" name="price" required
          value={formData.price} onChange={handleChange}
          style={{ padding: '10px', fontSize: '1rem' }}
        />
        <input 
          type="text" name="category" required
          value={formData.category} onChange={handleChange}
          style={{ padding: '10px', fontSize: '1rem' }}
        />
        <input 
          type="url" name="thumbnail" required
          value={formData.thumbnail} onChange={handleChange}
          style={{ padding: '10px', fontSize: '1rem' }}
        />
        <button 
          type="submit" 
          disabled={saving}
          style={{ 
            padding: '15px', 
            background: saving ? '#ccc' : 'orange', // Orange for Edit!
            color: 'white', 
            border: 'none', 
            cursor: saving ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            borderRadius: '5px'
          }}
        >
          {saving ? 'Saving...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}