'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/servicos', label: 'Serviços' },
  { href: '/#loja', label: 'Loja' },
];

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo" aria-label="Zeca Estofados - Início" onClick={() => setOpen(false)}>
          <img src="/images/logo.png" alt="Zeca Estofados" />
        </Link>
        <button type="button" className="menu-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
        <nav className={`nav ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <Link key={l.label} href={l.href} className={path === l.href ? 'active' : ''} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
