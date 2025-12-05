import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductRow from '../components/ProductRaw';




export default async function AdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' } 
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* --- HEADER SECTION --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admin Dashboard 🛠️</h1>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* ✅ 1. THE ADD BUTTON */}
            <Link 
              href="/admin/add" 
              style={{ 
                backgroundColor: '#28a745', 
                color: 'white', 
                padding: '10px 20px', 
                borderRadius: '5px', 
                textDecoration: 'none', 
                fontWeight: 'bold' 
              }}
            >
              + Add Product
            </Link>

            <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
              Back to Shop
            </Link>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f4f4f4' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Price</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* ✅ 2. THE ROWS (Edit button is inside here!) */}
            {products.map(product => (
              <ProductRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}