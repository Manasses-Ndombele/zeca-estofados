'use client';
// Recriação do "JellyRadio" (React Bits): chips que balançam como gelatina ao serem selecionados.
import { useState, type CSSProperties, type ReactNode } from 'react';

export type JellyItem = string | { value: string; label: string; icon?: ReactNode; disabled?: boolean };
interface Props {
  items: JellyItem[]; defaultValue?: string; onChange?: (value: string, index: number) => void;
  chipColor?: string; activeColor?: string; textColor?: string; activeTextColor?: string;
  size?: 'sm' | 'md' | 'lg'; gap?: number; radius?: number; stagger?: number; disabled?: boolean;
}
const pad = { sm: '8px 16px', md: '12px 24px', lg: '16px 32px' };
const font = { sm: 13, md: 15, lg: 17 };

export default function JellyRadio({
  items, defaultValue, onChange, chipColor = '#27272a', activeColor = '#f5f5f5', textColor = '#f5f5f5',
  activeTextColor = '#18181b', size = 'md', gap = 8, radius = 18, stagger = 22, disabled = false,
}: Props) {
  const list = items.map((i) => (typeof i === 'string' ? { value: i, label: i, icon: undefined, disabled: false } : { icon: undefined, disabled: false, ...i }));
  const [value, setValue] = useState(defaultValue ?? list[0]?.value);
  const [pulse, setPulse] = useState({ i: -1, n: 0 });

  const select = (i: number) => {
    const it = list[i];
    if (disabled || it.disabled || it.value === value) return;
    setValue(it.value);
    setPulse((p) => ({ i, n: p.n + 1 }));
    onChange?.(it.value, i);
  };

  return (
    <div role="radiogroup" className="jelly" style={{ gap }}>
      {list.map((it, i) => {
        const active = it.value === value;
        const style: CSSProperties = {
          background: active ? activeColor : chipColor, color: active ? activeTextColor : textColor,
          borderRadius: radius, padding: pad[size], fontSize: font[size],
          animation: pulse.n ? `jelly${pulse.n % 2} 650ms ${Math.abs(i - pulse.i) * stagger}ms cubic-bezier(.3,1.6,.5,1) both` : undefined,
        };
        return (
          <button key={it.value} type="button" role="radio" aria-checked={active} disabled={disabled || it.disabled}
            className="jelly-chip" style={style} onClick={() => select(i)}>
            {it.icon}{it.label}
          </button>
        );
      })}
    </div>
  );
}
