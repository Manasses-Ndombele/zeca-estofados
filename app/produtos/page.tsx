import PageHero from '@/components/PageHero';
import ProductsExplorer from '@/components/ProductsExplorer';
import Faq from '@/components/Faq';
import { productFaq } from '@/data';

export const metadata = { title: 'Produtos | Zeca Estofados' };

export default function ProdutosPage() {
  return (
    <>
      <PageHero
        image="/images/hero-produtos.jpeg"
        title="Produtos feitos sob medida para o seu estilo"
        text="Explore a nossa coleção de sofás, camas, cadeiras e sofás restaurados. Escolha o tecido, a cor e receba uma peça fabricada com materiais selecionados e acabamento impecável."
      />
      <ProductsExplorer />
      <Faq items={productFaq} title="Dúvidas frequentes sobre os nossos produtos" />
    </>
  );
}
