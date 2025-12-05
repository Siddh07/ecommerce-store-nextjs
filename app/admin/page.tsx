import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductRow from '../components/ProductRaw';


export default async function AdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' } // Show Descending newest 
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Admin Dashboard 🛠️</h1>
        <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>Back to Shop</Link>
      </div>

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
            {/* ✅ CLEAN LOOP: Just the component, nothing else! */}
            {products.map(product => (
              <ProductRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}