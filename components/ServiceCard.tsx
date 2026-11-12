import BorderGlow from './BorderGlow';
import type { Service } from '@/data';

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <BorderGlow
      edgeSensitivity={30} backgroundColor="#020e26" borderRadius={4} glowRadius={40} glowIntensity={1}
      coneSpread={25} animated={false} colors={['#bf964b', '#f2f2f0', '#053959']}
    >
      <div className="service">
        <img src={service.image} alt={service.title} loading="lazy" />
        <div className="service-text">
          <h3>{service.title}</h3>
          <p>{service.text}</p>
        </div>
      </div>
    </BorderGlow>
  );
}
