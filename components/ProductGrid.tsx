'use client';
import { useState } from 'react';
import type { Product } from '@/data';
import ProfileCard from './ProfileCard';
import OrderModal from './OrderModal';

export default function ProductGrid({ items }: { items: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);
  return (
    <>
      <div className="product-grid">
        {items.map((p) => <ProfileCard key={p.id} product={p} onOrder={setSelected} />)}
      </div>
      {selected && <OrderModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
