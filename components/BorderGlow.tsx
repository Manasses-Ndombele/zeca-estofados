'use client';
// Recriação do efeito "BorderGlow" (React Bits): brilho na borda que segue o cursor.
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

interface Props {
  children: ReactNode; edgeSensitivity?: number; glowColor?: string; backgroundColor?: string;
  borderRadius?: number; glowRadius?: number; glowIntensity?: number; coneSpread?: number;
  animated?: boolean; colors?: string[]; className?: string;
}

export default function BorderGlow({
  children, edgeSensitivity = 30, backgroundColor = '#120F17', borderRadius = 28, glowRadius = 40,
  glowIntensity = 1, coneSpread = 25, animated = false, colors = ['#c084fc', '#f472b6', '#38bdf8'], className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let spin = 0, raf = 0, hovering = false;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const outX = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const outY = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      const inside = outX === 0 && outY === 0;
      const dist = inside
        ? Math.min(e.clientX - r.left, r.right - e.clientX, e.clientY - r.top, r.bottom - e.clientY)
        : Math.hypot(outX, outY);
      const reach = (edgeSensitivity / 100) * Math.min(r.width, r.height) + glowRadius;
      const op = Math.max(0, Math.min(1, 1 - dist / reach)) * glowIntensity;
      hovering = op > 0.02;
      el.style.setProperty('--glow-opacity', String(op));
      if (!animated) el.style.setProperty('--glow-angle', `${(Math.atan2(dy, dx) * 180) / Math.PI + 90}deg`);
    };
    window.addEventListener('pointermove', onMove);
    if (animated) {
      const tick = () => {
        spin = (spin + 0.6) % 360;
        el.style.setProperty('--glow-angle', `${spin}deg`);
        if (!hovering) el.style.setProperty('--glow-opacity', String(0.45 * glowIntensity));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, [edgeSensitivity, glowRadius, glowIntensity, animated]);

  const span = coneSpread * 2;
  const stops = colors.map((c, i) => `${c} ${(0.15 + (0.7 * i) / Math.max(colors.length - 1, 1)) * span}deg`).join(', ');
  const style = {
    borderRadius, background: backgroundColor, '--glow-angle': '0deg', '--glow-opacity': 0,
    '--glow-grad': `conic-gradient(from calc(var(--glow-angle) - ${coneSpread}deg), transparent 0deg, ${stops}, transparent ${span}deg, transparent 360deg)`,
  } as CSSProperties;

  return (
    <div ref={ref} className={`border-glow ${className}`} style={style}>
      <span className="border-glow-ring" aria-hidden />
      <span className="border-glow-ring border-glow-blur" aria-hidden />
      <div className="border-glow-content">{children}</div>
    </div>
  );
}
