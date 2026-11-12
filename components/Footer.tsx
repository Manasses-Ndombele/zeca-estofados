import { company } from '@/data';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/images/logo.png" alt="Zeca Estofados" />
          {company.footerText.map((l) => <p key={l}>{l}</p>)}
        </div>
        <div>
          <h4>Redes sociais</h4>
          <ul>
            {company.socials.map((s) => (
              <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Contactos</h4>
          <ul>
            <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
            {company.phones.map((p) => <li key={p}><a href={`tel:${p.replace(/\s/g, '')}`}>{p}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} {company.name}. Todos os direitos reservados.</div>
    </footer>
  );
}
