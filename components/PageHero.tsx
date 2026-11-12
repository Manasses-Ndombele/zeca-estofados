export default function PageHero({ title, text, image }: { title: string; text: string; image: string }) {
  return (
    <section className="page-hero" style={{ backgroundImage: `linear-gradient(rgba(2,14,38,.78), rgba(2,14,38,.78)), url(${image})` }}>
      <div className="container">
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}
