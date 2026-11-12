'use client';
// Cartão de produto no estilo "ProfileCard" (React Bits): tilt 3D, brilho holográfico e parallax.
import { useRef, type CSSProperties, type PointerEvent } from 'react';
import { formatPrice, type Product } from '@/data';

interface Props {
  product: Product; onOrder: (p: Product) => void;
  holo?: number; glare?: number; tiltStrength?: number; parallax?: number; radius?: number;
  enableTilt?: boolean; intro?: boolean; enableMobileTilt?: boolean;
}

export default function ProfileCard({
  product, onOrder, holo = 0.8, glare = 0.5, tiltStrength = 12, parallax = 8, radius = 16,
  enableTilt = true, intro = true, enableMobileTilt = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  const move = (e: PointerEvent) => {
    const el = ref.current;
    if (!el || !enableTilt || (e.pointerType !== 'mouse' && !enableMobileTilt)) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * tiltStrength * 2}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * tiltStrength * 2}deg`);
    el.style.setProperty('--px', `${x * 100}%`);
    el.style.setProperty('--py', `${y * 100}%`);
    el.style.setProperty('--mx', String(x - 0.5));
    el.style.setProperty('--my', String(y - 0.5));
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    ['--rx', '--ry', '--mx', '--my'].forEach((k) => el.style.setProperty(k, '0'));
    el.style.setProperty('--px', '50%'); el.style.setProperty('--py', '50%');
  };

  const vars = { '--holo': holo, '--glare': glare, '--par': `${parallax}px`, borderRadius: radius } as CSSProperties;

  return (
    <article ref={ref} className={`pcard ${intro ? 'pcard-intro' : ''}`} style={vars} onPointerMove={move} onPointerLeave={leave}>
      <div className="pcard-holo" aria-hidden />
      <div className="pcard-glare" aria-hidden />
      <div className="pcard-media">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="pcard-cat">{product.category}</span>
      </div>
      <div className="pcard-body">
        <h3>{product.name}</h3>
        <div className="pcard-row">
          <span className="pcard-label">Tecidos</span>
          <div className="chips">{product.fabrics.map((f) => <span key={f} className="chip">{f}</span>)}</div>
        </div>
        <div className="pcard-row">
          <span className="pcard-label">Cores</span>
          <div className="swatches">
            {product.colors.map((c) => <span key={c.name} className="swatch" title={c.name} style={{ background: c.hex }} />)}
          </div>
        </div>
        <div className="pcard-price">
          <strong>{formatPrice(product.price)}</strong>
          <span>{product.shipping === 0 ? 'Frete grátis' : `Frete ${formatPrice(product.shipping)}`}</span>
        </div>
        <button type="button" className="btn-96" onClick={() => onOrder(product)}>Encomendar</button>
      </div>
    </article>
  );
}
