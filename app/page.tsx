'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useCart } from '../app/CartContext'; // Adjust path if needed
import Link from 'next/link';

// Define interfaces
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

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { addToCart, cart } = useCart();
  
  // ✅ 1. Search State
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ProductsResponse>(
          'https://dummyjson.com/products?limit=12' // Increased limit so you can search more items
        );
        setProducts(response.data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // This runs automatically every time you type.
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    // Logic removed from here - it lives above now!
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header style={{ 
        padding: '20px', 
        borderBottom: '1px solid #e9ecef',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, color: '#0070f3' }}>🛍️ ShopEasy</h1>
          <nav>
            <Link href="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#495057' }}>Home</Link>
            <Link href="/products" style={{ marginRight: '20px', textDecoration: 'none', color: '#495057' }}>Products</Link>
            <Link href="/cart" style={{ textDecoration: 'none', color: '#495057', fontWeight: 'bold' }}>
               🛒 Cart ({cart.totals.totalItems})
            </Link>          
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#212529' }}>Welcome to ShopEasy</h2>
          <p style={{ fontSize: '1.2rem', color: '#6c757d', marginBottom: '2rem' }}>
            Your one-stop shop for amazing products
          </p>

          {/* ✅ 3. Search Bar UI */}
          <div style={{ margin: '30px auto', maxWidth: '500px' }}>
            <input 
              type="text" 
              placeholder="🔍 Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '15px 25px',
                fontSize: '1.1rem',
                border: '1px solid #ddd',
                borderRadius: '50px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                outline: 'none',
                transition: 'box-shadow 0.3s ease'
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 4px 20px rgba(0,112,243,0.2)'}
              onBlur={(e) => e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)'}
            />
          </div>
          
          {/* Featured Products Section */}
          <section style={{ marginTop: '50px' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#343a40' }}>
               {searchQuery ? `Searching for "${searchQuery}"` : "Featured Products"}
            </h3>
            
            {loading && (
              <div style={{ padding: '40px' }}>
                <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>🔄 Loading products...</p>
              </div>
            )}
            
            {error && (
              <div style={{ padding: '40px', color: '#dc3545' }}>
                <p>❌ Error: {error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Retry
                </button>
              </div>
            )}
            
            {/* Empty State Check */}
            {!loading && !error && filteredProducts.length === 0 && (
                <div style={{ padding: '40px', color: '#6c757d' }}>
                    <p>No products found matching "{searchQuery}"</p>
                </div>
            )}
            
            {!loading && !error && filteredProducts.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '30px',
                margin: '40px auto'
              }}>
                {/* ✅ 4. Map over filteredProducts */}
                {filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    style={{
                      border: '1px solid #dee2e6',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'white',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => handleProductClick(product.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  >
                    {/* Product Image */}
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: '8px', marginBottom: '15px' }}>
                      <img 
                        src={product.thumbnail} 
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%236c757d'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    
                    <h4 style={{ margin: '10px 0', fontSize: '1.2rem', color: '#212529', fontWeight: '600' }}>
                      {product.title}
                    </h4>
                    
                    <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#0070f3', margin: '10px 0' }}>
                      ${product.price}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', margin: '15px 0', fontSize: '0.9rem', color: '#6c757d' }}>
                      <span>⭐ {product.rating}/5</span>
                      <span>🏷️ {product.brand}</span>
                    </div>
                    
                    <button 
                      style={{
                        padding: '12px 24px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px',
                        cursor: 'pointer', fontWeight: '600', fontSize: '1rem', width: '100%'
                      }}
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <button 
            style={{ padding: '15px 30px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', marginTop: '30px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: '600' }}
            onClick={() => router.push('/products')}
          >
            Browse All Products
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '30px 20px', textAlign: 'center', borderTop: '1px solid #e9ecef', marginTop: '60px', backgroundColor: 'white', color: '#6c757d' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p>© 2024 ShopEasy. Built with Next.js & TypeScript</p>
        </div>
      </footer>
    </div>
  );
}