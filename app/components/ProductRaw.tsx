'use client';

import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  title: string;
  price: number;
}

export default function ProductRow({ product }: { product: Product }) {
  const router = useRouter();

  const handleDelete = async () => {
    // 1. Confirm (Safety First!)
    const confirmed = confirm(`Are you sure you want to delete "${product.title}"?`);
    if (!confirmed) return;

    // 2. Call the API (The Hitman)
    await fetch(`/api/products/${product.id}`, {
      method: 'DELETE',
    });

    // 3. Refresh the Page (The Cleanup)
    // This tells Next.js: "The data changed. Re-fetch the server component!"
    router.refresh();
  };








  
  return (
    <tr style={{ borderTop: '1px solid #eee' }}>
      <td style={{ padding: '15px' }}>{product.id}</td>
      <td style={{ padding: '15px' }}>{product.title}</td>
      <td style={{ padding: '15px' }}>${product.price}</td>
      <td style={{ padding: '15px' }}>
        <button 
          onClick={handleDelete}
          style={{ color: 'red', fontWeight: 'bold', cursor: 'pointer', border: 'none', background: 'none' }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}