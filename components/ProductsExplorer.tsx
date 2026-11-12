'use client';
import { useState } from 'react';
import { categories, products, type Category } from '@/data';
import JellyRadio from './JellyRadio';
import ProductGrid from './ProductGrid';

const FIRST = 10, STEP = 5;

export default function ProductsExplorer() {
  const [category, setCategory] = useState<Category>(categories[0]);
  const [visible, setVisible] = useState(FIRST);
  const filtered = products.filter((p) => p.category === category);

  return (
    <>
      <section className="section section-tight" aria-label="Categorias">
        <div className="container center">
          <JellyRadio
            items={categories} defaultValue={categories[0]}
            onChange={(v) => { setCategory(v as Category); setVisible(FIRST); }}
            chipColor="#020e26" activeColor="#bf964b" textColor="#f2f2f0" activeTextColor="#01070d"
            size="md" gap={10} radius={18} stagger={22}
          />
        </div>
      </section>
      <section className="section section-tight">
        <div className="container">
          <ProductGrid items={filtered.slice(0, visible)} />
          {visible < filtered.length && (
            <div className="center cta-row">
              <button type="button" className="btn-96" onClick={() => setVisible((v) => v + STEP)}>Ver mais</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
