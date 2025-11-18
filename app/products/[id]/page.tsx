// app/products/[id]/page.tsx (Debug Version)
import Link from 'next/link';

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  
  console.log('🔄 Fetching product with ID:', id); // Debug log
  
  try {
    const apiUrl = `https://dummyjson.com/products/${id}`;
    console.log('📡 API URL:', apiUrl); // Debug log
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 60 }
    });
    
    console.log('📊 Response status:', response.status); // Debug log
    console.log('📊 Response ok:', response.ok); // Debug log
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const productData = await response.json();
    console.log('✅ Product data received:', productData); // Debug log
    
    const product: Product = productData;
    
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <h1>🛍️ ShopEasy</h1>
          <nav>
            <Link href="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#0070f3' }}>Home</Link>
            <Link href="/products" style={{ textDecoration: 'none', color: '#0070f3' }}>Products</Link>
          </nav>
        </header>
        
        <main style={{ padding: '40px 20px' }}>
          <h1>{product.title}</h1>
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            style={{ width: '300px', height: '300px', objectFit: 'cover' }}
          />
          <p>{product.description}</p>
          <p><strong>Price: ${product.price}</strong></p>
          <p>Rating: {product.rating}/5 ⭐</p>
          <p>Brand: {product.brand}</p>
          <p>Category: {product.category}</p>
        </main>
      </div>
    );
  } catch (error) {
    console.error('❌ Error fetching product:', error); // Debug log
    
    return (
      <div style={{ padding: '20px' }}>
        <header style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <h1>🛍️ ShopEasy</h1>
          <nav>
            <Link href="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#0070f3' }}>Home</Link>
            <Link href="/products" style={{ textDecoration: 'none', color: '#0070f3' }}>Products</Link>
          </nav>
        </header>
        
        <main style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h1>Product Not Found</h1>
          <p>Sorry, we couldn't find product {id}</p>
          <p style={{ color: 'red', fontSize: '0.9rem' }}>
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Link href="/products" style={{ color: '#0070f3', textDecoration: 'none' }}>
            ← Back to Products
          </Link>
        </main>
      </div>
    );
  }
}