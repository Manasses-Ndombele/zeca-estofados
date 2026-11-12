// Todos os dados de produtos e serviços do site (fonte única para todas as páginas).

export const CURRENCY = { locale: 'pt-PT', code: 'EUR' }; // altere aqui a moeda do site
export const formatPrice = (v: number) =>
  v === 0 ? 'Grátis' : new Intl.NumberFormat(CURRENCY.locale, { style: 'currency', currency: CURRENCY.code }).format(v);

export const company = {
  name: 'Zeca Estofados',
  email: 'contato@zecaestofados.com',
  phones: ['+00 000 000 001', '+00 000 000 002'],
  socials: [
    { label: 'Facebook', href: 'https://facebook.com/zecaestofados' },
    { label: 'Instagram', href: 'https://instagram.com/zecaestofados' },
    { label: 'TikTok', href: 'https://tiktok.com/@zecaestofados' },
  ],
  // Substitua pelo link "Incorporar um mapa" do Google Maps da sua loja
  mapEmbedUrl: 'https://www.google.com/maps?q=Zeca+Estofados&output=embed',
  footerText: [
    'Fabricamos e restauramos sofás, camas, cadeiras de salão e bancos automotivos, em napa e tecido.',
    'Design • Precisão • Qualidade • Acabamento impecável',
    'Transformamos cada peça com inovação, atenção aos detalhes e excelência em cada acabamento.',
  ],
};

/* ------------------------------ PRODUTOS ------------------------------ */

export type Fabric = 'linho' | 'camurça' | 'cabedal' | 'veludo' | 'couro';
export type Category = 'Sofás' | 'Camas' | 'Cadeiras' | 'Sofás restaurados';
export interface ProductColor { name: string; hex: string }
export interface Product {
  id: number;
  name: string;
  category: Category;
  image: string;
  fabrics: Fabric[];
  colors: ProductColor[];
  price: number;
  shipping: number; // 0 = frete grátis
}

export const categories: Category[] = ['Sofás', 'Camas', 'Cadeiras', 'Sofás restaurados'];

const fabricList: Fabric[] = ['linho', 'camurça', 'cabedal', 'veludo', 'couro'];
const palette: ProductColor[] = [
  { name: 'Cinza', hex: '#8a8a8a' },
  { name: 'Azul-marinho', hex: '#1f2a44' },
  { name: 'Bege', hex: '#d8c8a8' },
  { name: 'Preto', hex: '#1a1a1a' },
  { name: 'Caramelo', hex: '#a8672c' },
  { name: 'Verde', hex: '#3b5d4a' },
  { name: 'Vinho', hex: '#5e1f2b' },
  { name: 'Off-white', hex: '#e8e4d8' },
];

// Imagens de exemplo (troque pelas fotos reais de cada produto)
const catalog: Record<Category, { image: string; base: number; names: string[] }> = {
  'Sofás': {
    image: '/images/hero-sofa.png', base: 1290,
    names: ['Sofá Milão', 'Sofá Toscana', 'Sofá Veneza', 'Sofá Capri', 'Sofá Verona', 'Sofá Roma', 'Sofá Siena', 'Sofá Bari', 'Sofá Florença', 'Sofá Módena', 'Sofá Parma', 'Sofá Turim', 'Sofá Gênova', 'Sofá Pádua'],
  },
  'Camas': {
    image: '/images/servicos-2.jpeg', base: 890,
    names: ['Cama Lisboa', 'Cama Porto', 'Cama Évora', 'Cama Sintra', 'Cama Braga', 'Cama Faro', 'Cama Coimbra', 'Cama Aveiro', 'Cama Tavira', 'Cama Setúbal', 'Cama Viseu', 'Cama Leiria', 'Cama Óbidos', 'Cama Cascais'],
  },
  'Cadeiras': {
    image: '/images/servicos-3.jpeg', base: 190,
    names: ['Cadeira Aurora', 'Cadeira Luna', 'Cadeira Vênus', 'Cadeira Sol', 'Cadeira Íris', 'Cadeira Dália', 'Cadeira Jade', 'Cadeira Safira', 'Cadeira Opala', 'Cadeira Pérola', 'Cadeira Rubi', 'Cadeira Ônix', 'Cadeira Topázio', 'Cadeira Ágata'],
  },
  'Sofás restaurados': {
    image: '/images/servicos-4.jpeg', base: 690,
    names: ['Chesterfield restaurado', 'Retrô anos 60 restaurado', 'Clássico 3 lugares restaurado', 'Canto em L restaurado', 'Namoradeira restaurada', 'Sofá-cama restaurado', 'Cabedal vintage restaurado', 'Sofá colonial restaurado', 'Poltrona-sofá restaurada', 'Sofá reclinável restaurado', 'Sofá art déco restaurado', 'Sofá nórdico restaurado', 'Sofá capitonê restaurado', 'Sofá rústico restaurado'],
  },
};

function buildProducts(): Product[] {
  let id = 1;
  const list: Product[] = [];
  for (const category of categories) {
    const { names, image, base } = catalog[category];
    names.forEach((name, i) => {
      const nf = 1 + (i % 3 === 2 ? 1 : 0) + (i % 5 === 0 ? 1 : 0);
      const nc = 2 + (i % 3);
      list.push({
        id: id++,
        name,
        category,
        image,
        fabrics: Array.from({ length: nf }, (_, k) => fabricList[(i + k * 2) % 5]),
        colors: Array.from({ length: nc }, (_, k) => palette[(i * 3 + k * 2) % 8]),
        price: Math.round((base * (1 + ((i * 7) % 10) * 0.06)) / 10) * 10,
        shipping: i % 3 === 0 ? 0 : 29 + (i % 4) * 10,
      });
    });
  }
  return list;
}

export const products: Product[] = buildProducts();

// 8 produtos (2 de cada categoria) para a Home
export const featuredProducts: Product[] = categories.flatMap((c) =>
  products.filter((p) => p.category === c).filter((_, i) => [1, 5].includes(i)),
);

/* ------------------------------ SERVIÇOS ------------------------------ */

export interface Service { id: number; title: string; image: string; text: string }

export const services: Service[] = [
  {
    id: 1, title: 'Restauração de sofás', image: '/images/servicos-1.jpeg',
    text: 'Devolvemos vida ao seu sofá com um processo completo: desmontamos a peça, avaliamos a estrutura de madeira, reforçamos ou substituímos molas e cintas, trocamos espumas desgastadas e aplicamos um novo revestimento em napa, couro ou tecido de sua escolha. Cada costura é feita com máquinas industriais e acabamento manual, garantindo simetria, conforto e durabilidade. Seja um clássico de família ou uma peça moderna que perdeu o brilho, entregamos o sofá com aparência de novo e a assinatura de qualidade da Zeca Estofados.',
  },
  {
    id: 2, title: 'Restauração de camas', image: '/images/servicos-2.jpeg',
    text: 'Camas estofadas sofrem com o tempo: cabeceiras que cedem, tecidos que desbotam e estruturas que rangem. Nosso serviço recupera a base de madeira, substitui ripas e fixações, renova a espuma e refaz todo o estofamento com materiais de alta resistência. Podemos ainda modernizar o design, adicionando capitonê, novos formatos de cabeceira ou outras cores. O resultado é uma cama firme, silenciosa e elegante, pronta para proporcionar muitos anos de descanso e conforto.',
  },
  {
    id: 3, title: 'Restauração de cadeiras estofadas', image: '/images/servicos-3.jpeg',
    text: 'Das cadeiras de jantar às cadeiras de salão, restauramos cada peça com atenção aos detalhes. Retiramos o revestimento antigo, reparamos encaixes e estrutura, substituímos cintas e espumas e aplicamos o novo tecido ou couro com tensão perfeita e pregagem uniforme. Trabalhamos com lotes grandes, mantendo o mesmo padrão em todas as unidades, ideal para restaurantes, salões de beleza, barbearias e escritórios que querem renovar o ambiente sem trocar o mobiliário.',
  },
  {
    id: 4, title: 'Restauração de bancos de carro', image: '/images/servicos-4.jpeg',
    text: 'Bancos automotivos exigem precisão e materiais específicos. Restauramos assentos e encostos recuperando espumas, reparando estruturas e refazendo o revestimento em napa, couro ou tecido automotivo, com costuras reforçadas e acabamento fiel ao original, ou personalizado conforme o seu gosto. O serviço elimina rasgos, desgaste e odores, devolve o conforto ao condutor e valoriza o interior do veículo, seja um carro de uso diário ou um clássico de coleção.',
  },
];

/* ------------------------------ SOBRE / DEPOIMENTOS ------------------------------ */

export const about = [
  'A Zeca Estofados nasceu da paixão do Zeca pelo ofício de transformar madeira, espuma e tecido em peças que contam histórias. O que começou numa pequena oficina, com uma máquina de costura e muita dedicação, cresceu graças à confiança de clientes que voltaram e indicaram o nosso trabalho.',
  'Hoje, com uma equipa experiente, fabricamos sofás, camas e cadeiras sob medida e restauramos móveis e bancos automotivos com o mesmo cuidado do primeiro dia. Unimos técnica artesanal, materiais selecionados e um acabamento impecável, porque acreditamos que cada peça merece durar e embelezar a vida de quem a usa.',
];

export const testimonials = [
  { name: 'Marta Ferreira', role: 'Cliente · Sofá Milão', text: 'O sofá ficou exatamente como eu imaginei. O tecido é lindo, o acabamento é perfeito e a entrega foi dentro do prazo. Super recomendo!' },
  { name: 'João Pacheco', role: 'Cliente · Restauração de sofá', text: 'Pensei que o sofá do meu avô não tinha mais conserto. A equipa devolveu a vida a ele e ainda manteve o charme original. Trabalho de mestre.' },
  { name: 'Ana Beatriz', role: 'Proprietária de salão', text: 'Renovaram todas as cadeiras do meu salão em poucos dias. O padrão ficou idêntico em todas e o conforto melhorou muito.' },
  { name: 'Ricardo Lemos', role: 'Cliente · Banco de carro', text: 'Restauraram os bancos do meu carro antigo em couro. Parece que saiu da fábrica agora. Atendimento excelente e preço justo.' },
  { name: 'Carla Monteiro', role: 'Cliente · Cama Lisboa', text: 'A cabeceira em veludo transformou o meu quarto. Material de qualidade e uma cama super firme e silenciosa.' },
  { name: 'Paulo Andrade', role: 'Dono de restaurante', text: 'Precisava renovar 40 cadeiras sem parar o restaurante. Organizaram tudo por lotes e cumpriram cada prazo. Muito profissionais.' },
  { name: 'Sofia Rocha', role: 'Cliente · Poltrona restaurada', text: 'Cuidado em cada detalhe, desde o orçamento até a entrega. Já indiquei para toda a família e amigos.' },
];

/* ------------------------------ F.A.Q ------------------------------ */

export interface FaqItem { q: string; a: string }

export const productFaq: FaqItem[] = [
  { q: 'Quais tecidos estão disponíveis?', a: 'Trabalhamos com linho, camurça, cabedal, veludo e couro. Cada produto indica os tecidos disponíveis no próprio cartão.' },
  { q: 'Posso escolher a cor do meu produto?', a: 'Sim. As cores disponíveis aparecem em cada cartão e, se desejar outra, entre em contacto: fazemos sob medida e sob encomenda.' },
  { q: 'Qual é o prazo de fabrico e entrega?', a: 'O prazo médio é de 15 a 30 dias úteis, dependendo do produto, do tecido e da fila de produção. Informamos a data exacta ao confirmar a encomenda.' },
  { q: 'Como funciona o frete?', a: 'Alguns produtos têm frete grátis; nos restantes o valor aparece no cartão do produto e é somado ao total no pagamento.' },
  { q: 'Quais formas de pagamento são aceitas?', a: 'Aceitamos cartões Visa e Mastercard diretamente no site. Outras formas podem ser combinadas diretamente com a nossa equipa.' },
  { q: 'Os produtos têm garantia?', a: 'Sim. Todos os nossos produtos têm garantia contra defeitos de fabrico na estrutura e nas costuras.' },
];

export const serviceFaq: FaqItem[] = [
  { q: 'Como solicito um orçamento de restauração?', a: 'Envie fotos da peça por email ou telefone, ou visite a nossa loja. Avaliamos o estado da estrutura e do revestimento e apresentamos o orçamento sem compromisso.' },
  { q: 'Quanto tempo demora uma restauração?', a: 'Em geral entre 7 e 20 dias úteis, conforme o tipo de peça e a complexidade do trabalho.' },
  { q: 'Vocês recolhem e entregam a peça em casa?', a: 'Sim, oferecemos serviço de recolha e entrega mediante consulta de disponibilidade e valor para a sua região.' },
  { q: 'Posso mudar o tecido ou a cor durante a restauração?', a: 'Claro. Pode manter o revestimento original ou escolher entre napa, couro, linho, veludo, camurça e outros tecidos do nosso mostruário.' },
  { q: 'Vale a pena restaurar em vez de comprar novo?', a: 'Na maioria dos casos sim: peças com boa estrutura de madeira ficam como novas por uma fração do preço, e você mantém um móvel com história.' },
  { q: 'Fazem restauração em grande quantidade para empresas?', a: 'Sim. Atendemos restaurantes, salões, escritórios e hotéis, com padronização entre unidades e prazos combinados por lotes.' },
];
