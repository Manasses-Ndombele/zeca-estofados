import PageHero from '@/components/PageHero';
import ServiceCard from '@/components/ServiceCard';
import Faq from '@/components/Faq';
import { serviceFaq, services } from '@/data';

export const metadata = { title: 'Serviços | Zeca Estofados' };

export default function ServicosPage() {
  return (
    <>
      <PageHero
        image="/images/hero-produtos.jpeg"
        title="Restauração com acabamento de peça nova"
        text="Recuperamos sofás, camas, cadeiras e bancos de carro com técnica artesanal, materiais de qualidade e atenção a cada detalhe, para que a sua peça volte a brilhar."
      />
      <section className="section">
        <div className="container">
          <h2 className="section-title">Nossos Serviços</h2>
          <div className="service-list">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      </section>
      <Faq items={serviceFaq} title="Dúvidas frequentes sobre os nossos serviços" />
    </>
  );
}
