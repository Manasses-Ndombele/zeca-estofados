'use client';
// Carrossel inspirado no componente "Carousel" (React Bits), sem imagens de fundo.
import { useCallback, useEffect, useRef, useState } from 'react';

export interface CarouselItem { title: string; description: string; subtitle?: string }
interface Props {
  items: CarouselItem[]; baseWidth?: number; aspectRatio?: number; effect?: 'scale' | 'none';
  indicator?: 'bars' | 'none'; arrows?: boolean; loop?: boolean; autoplay?: boolean; autoplayDelay?: number;
  pauseOnHover?: boolean; peek?: number; gap?: number; radius?: number; draggable?: boolean;
}

export default function Carousel({
  items, baseWidth = 640, aspectRatio = 1.6, effect = 'scale', indicator = 'bars', arrows = true, loop = true,
  autoplay = true, autoplayDelay = 4000, pauseOnHover = true, peek = 64, gap = 16, radius = 20, draggable = true,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);
  const n = items.length;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.offsetWidth));
    ro.observe(el);
    setWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const go = useCallback((i: number) => {
    setIndex(loop ? (i + n) % n : Math.max(0, Math.min(n - 1, i)));
  }, [loop, n]);

  useEffect(() => {
    if (!autoplay || paused) return;
    const id = setInterval(() => setIndex((i) => (loop ? (i + 1) % n : Math.min(n - 1, i + 1))), autoplayDelay);
    return () => clearInterval(id);
  }, [autoplay, paused, autoplayDelay, loop, n]);

  const side = width < 640 ? 28 : peek;
  const slideW = Math.max(220, Math.min(baseWidth, width - side * 2));
  const offset = (width - slideW) / 2 - index * (slideW + gap);

  return (
    <div
      className="carousel"
      onPointerEnter={() => pauseOnHover && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div
        ref={wrap}
        className="carousel-viewport"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={(e) => { if (draggable) startX.current = e.clientX; }}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="carousel-track" style={{ gap, transform: `translateX(${offset}px)`, visibility: width ? 'visible' : 'hidden' }}>
          {items.map((it, i) => (
            <article
              key={i}
              className={`carousel-slide ${i === index ? 'is-active' : ''} ${effect === 'scale' ? 'fx-scale' : ''}`}
              style={{ width: slideW, minHeight: Math.max(slideW / aspectRatio, 250), borderRadius: radius }}
              aria-hidden={i !== index}
            >
              <div className="stars" aria-label="5 estrelas">★★★★★</div>
              <p className="carousel-text">“{it.description}”</p>
              <footer>
                <strong>{it.title}</strong>
                {it.subtitle && <span>{it.subtitle}</span>}
              </footer>
            </article>
          ))}
        </div>
      </div>

      <div className="carousel-controls">
        {arrows && <button type="button" className="carousel-arrow" onClick={() => go(index - 1)} aria-label="Anterior">←</button>}
        {indicator === 'bars' && (
          <div className="carousel-bars">
            {items.map((_, i) => (
              <button key={i} type="button" className={i === index ? 'on' : ''} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        )}
        {arrows && <button type="button" className="carousel-arrow" onClick={() => go(index + 1)} aria-label="Seguinte">→</button>}
      </div>
    </div>
  );
}
