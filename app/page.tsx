import Link from 'next/link';
import Aurora from '@/components/Aurora';
import ProductGrid from '@/components/ProductGrid';
import ServiceCard from '@/components/ServiceCard';
import Carousel from '@/components/Carousel';
import { about, company, featuredProducts, services, testimonials } from '@/data';

export default function Home() {
  return (
    <>
      {/* 1.1 Hero */}
      <section className="hero">
        <Aurora
          colorStops={['#053959', '#bf964b', '#053959']}
          amplitude={1} blend={0.5} height={0.45} speed={1} glow={0.6} scale={1} brightness={1}
          layers={1} direction="top" opacity={1} mouseInteraction intro lightMode={false}
        />
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>Estofados que transformam o seu espaço</h1>
            <p>
              Fabricamos e restauramos sofás, camas, cadeiras e bancos automotivos com design, precisão e
              acabamento impecável. Cada peça é feita sob medida, em napa, couro ou tecido, para trazer
              conforto e elegância à sua casa ou ao seu negócio.
            </p>
          </div>
        </div>
      </section>

      {/* 1.2 Produtos */}
      <section className="section" id="produtos">
        <div className="container">
          <h2 className="section-title">Nossos Produtos</h2>
          <ProductGrid items={featuredProducts} />
          <div className="center cta-row">
            <Link href="/produtos" className="btn-96">Ver mais</Link>
          </div>
        </div>
      </section>

      {/* 1.3 Serviços */}
      <section className="section section-alt" id="servicos">
        <div className="container">
          <h2 className="section-title">Nossos Serviços</h2>
          <div className="service-list">
            {services.slice(0, 3).map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
          <div className="center cta-row">
            <Link href="/servicos" className="btn-96">Ver todos serviços</Link>
          </div>
        </div>
      </section>

      {/* 1.4 Loja */}
      <section className="section" id="loja">
        <div className="container">
          <h2 className="section-title">Nossa localização</h2>
          <iframe
            className="map" src={company.mapEmbedUrl} title="Localização da Zeca Estofados"
            loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen
          />
        </div>
      </section>

      {/* 1.5 Sobre */}
      <section className="section section-alt" id="sobre">
        <div className="container about">
          <img src="/images/sobre.jpeg" alt="Equipa da Zeca Estofados" />
          <div>
            <h2 className="section-title left">Sobre a Zeca Estofados</h2>
            {about.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* 1.6 Depoimentos */}
      <section className="section section-dark" id="depoimentos">
        <div className="container">
          <h2 className="section-title light">O que dizem os nossos clientes</h2>
          <Carousel
            items={testimonials.map((t) => ({ title: t.name, subtitle: t.role, description: t.text }))}
            baseWidth={640} aspectRatio={1.6} effect="scale" indicator="bars" arrows loop autoplay
            autoplayDelay={4000} pauseOnHover peek={64} gap={16} radius={20} draggable
          />
        </div>
      </section>
    </>
  );
}
