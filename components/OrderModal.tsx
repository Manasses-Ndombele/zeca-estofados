'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { formatPrice, type Product } from '@/data';

const brandOf = (n: string) =>
  /^4/.test(n) ? 'Visa' : /^(5[1-5]|2(2[2-9][1-9]|2[3-9]\d|[3-6]\d\d|7[01]\d|720))/.test(n) ? 'Mastercard' : null;

export default function OrderModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const digits = number.replace(/\s/g, '');
  const brand = brandOf(digits);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (name.trim().length < 3) err.name = 'Informe o nome impresso no cartão.';
    if (digits.length !== 16 || !brand) err.number = 'Use um cartão Visa ou Mastercard válido (16 dígitos).';
    const m = expiry.match(/^(\d{2})\/(\d{2})$/);
    const month = m ? +m[1] : 0, year = m ? 2000 + +m[2] : 0;
    const now = new Date();
    if (!m || month < 1 || month > 12 || year * 12 + month < now.getFullYear() * 12 + now.getMonth() + 1) err.expiry = 'Validade inválida.';
    if (!/^\d{3}$/.test(cvv)) err.cvv = 'CVV com 3 dígitos.';
    setErrors(err);
    if (Object.keys(err).length) return;

    // Pagamento simulado
    window.alert(`Pagamento aprovado com sucesso! Obrigado pela sua encomenda de "${product.name}".`);
    setName(''); setNumber(''); setExpiry(''); setCvv(''); setErrors({});
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Pagamento">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
        <p className="eyebrow">Finalizar encomenda</p>
        <h3>{product.name}</h3>
        <p className="modal-price">
          {formatPrice(product.price)}
          <small>{product.shipping === 0 ? ' · Frete grátis' : ` + frete ${formatPrice(product.shipping)}`}</small>
        </p>

        <form onSubmit={submit} noValidate>
          <label>Nome no cartão
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="NOME COMPLETO" autoComplete="cc-name" />
            {errors.name && <em>{errors.name}</em>}
          </label>
          <label>Número do cartão {brand && <span className="brand">{brand}</span>}
            <input inputMode="numeric" value={number} placeholder="0000 0000 0000 0000" autoComplete="cc-number"
              onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())} />
            {errors.number && <em>{errors.number}</em>}
          </label>
          <div className="form-split">
            <label>Validade
              <input inputMode="numeric" value={expiry} placeholder="MM/AA" autoComplete="cc-exp"
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                }} />
              {errors.expiry && <em>{errors.expiry}</em>}
            </label>
            <label>CVV
              <input inputMode="numeric" value={cvv} placeholder="123" autoComplete="cc-csc"
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} />
              {errors.cvv && <em>{errors.cvv}</em>}
            </label>
          </div>
          <button type="submit" className="btn-96 btn-block">Pagar {formatPrice(product.price + product.shipping)}</button>
        </form>
      </div>
    </div>
  );
}
