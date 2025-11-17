

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // 🎯 AXIOS - SIMPLE & CLEAN
        const response = await axios.get('https://dummyjson.com/products?limit=6');
        
        // ✅ Axios automatically handles JSON conversion
console.log('API Response:', response.data); // ← Add this
        
      } catch (err) {
        setError(err.message);
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Header */}
      <header style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
        <h1>🛍️ ShopEasy</h1>
        <nav>
          <a href="/" style={{ marginRight: '15px' }}>Home</a>
          <a href="/products" style={{ marginRight: '15px' }}>Products</a>
          <a href="/cart">Cart (0)</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Welcome to ShopEasy</h2>
        <p>Your one-stop shop for amazing products</p>
        
        {/* 🎯 FEATURED PRODUCTS FROM API */}
        <section style={{ marginTop: '50px' }}>
          <h3>Featured Products</h3>
          
          {loading && <p>🔄 Loading products...</p>}
          {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
          
          {!loading && !error && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              maxWidth: '1000px',
              margin: '30px auto'
            }}>
              {products.map(product => (
                <div key={product.id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <img 
                    src={product.thumbnail} 
                    alt={product.title}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                  <h4 style={{ margin: '10px 0' }}>{product.title}</h4>
                  <p style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 'bold',
                    color: '#0070f3'
                  }}>
                    ${product.price}
                  </p>
                  <button style={{
                    padding: '8px 16px',
                    background: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <button style={{ 
          padding: '10px 20px', 
          background: '#0070f3', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          marginTop: '20px'
        }}>
          Browse All Products
        </button>
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '20px', 
        textAlign: 'center', 
        borderTop: '1px solid #eee',
        marginTop: '40px'
      }}>
        <p>© 2024 ShopEasy. Built with Next.js</p>
      </footer>
    </div>
  );
}