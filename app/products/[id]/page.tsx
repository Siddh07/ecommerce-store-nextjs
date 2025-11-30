import Link from 'next/link';
import AddToCartButton from '@/app/AddToCartButton';// ✅ 1. DEFINE THE TYPE
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
  rating: number;
  brand: string;
  category: string;
}

// ✅ 2. CORRECT PROPS TYPE (Next.js 15/16 style)
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    // Determine base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/products/${id}`;
    
    console.log('📡 Fetching from:', apiUrl);

    const response = await fetch(apiUrl, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const product: Product = await response.json();
    
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <h1>🛍️ ShopEasy</h1>
          <nav>
            <Link href="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#0070f3' }}>Home</Link>
            <Link href="/cart" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>Cart</Link>
          </nav>
        </header>
        
        <main style={{ padding: '40px 20px' }}>
          <h1>{product.title}</h1>
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
          />
          <p style={{ fontSize: '1.2rem', color: '#555' }}>{product.description}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0070f3' }}>Price: ${product.price}</p>
          <p>Rating: {product.rating}/5 ⭐</p>
          <p>Brand: {product.brand}</p>
          <p>Category: {product.category}</p>

          {/* ✅ 3. ADD THE BUTTON BACK */}
          <div style={{ marginTop: '20px' }}>
            <AddToCartButton product={product} />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Product Not Found</h1>
        <p>Could not load product ID: {id}</p>
        <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>← Back to Products</Link>
      </div>
    );
  }
}