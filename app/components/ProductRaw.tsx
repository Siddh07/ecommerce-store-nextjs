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
    const confirmed = confirm(`Are you sure you want to delete "${product.title}"?`);
    if (!confirmed) return;

    await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
    router.refresh(); 
  };

  return (
    <tr style={{ borderTop: '1px solid #eee' }}>
      <td style={{ padding: '15px' }}>{product.id}</td>
      <td style={{ padding: '15px' }}>{product.title}</td>
      <td style={{ padding: '15px' }}>${product.price}</td>
      <td style={{ padding: '15px' }}>
        
        {/*  DELETE BUTTON */}
        <button 
          onClick={handleDelete}
          style={{ color: 'red', fontWeight: 'bold', cursor: 'pointer', border: 'none', background: 'none', marginRight: '15px' }}
        >
          Delete
        </button>

        {/*  EDIT BUTTON (Here it is!) */}
        <button 
          onClick={() => router.push(`/admin/edit/${product.id}`)}
          style={{ color: 'blue', fontWeight: 'bold', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          Edit
        </button>

      </td>
    </tr>
  );
}