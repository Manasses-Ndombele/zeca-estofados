import type { FaqItem } from '@/data';

export default function Faq({ items, title = 'Perguntas frequentes' }: { items: FaqItem[]; title?: string }) {
  return (
    <section className="section section-alt">
      <div className="container narrow">
        <h2 className="section-title">F.A.Q</h2>
        <p className="section-sub">{title}</p>
        {items.map((it) => (
          <details key={it.q} className="faq">
            <summary>{it.q}</summary>
            <p>{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
