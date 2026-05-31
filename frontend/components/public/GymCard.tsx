'use client';

import Link from 'next/link';
import { Gym } from '@/lib/types';
import { getAssetPath } from '@/lib/utils';

interface GymCardProps {
  gym: Gym;
}

export default function GymCard({ gym }: GymCardProps) {
  return (
    <Link href={`/gym/${gym.id}`} className="gym-card">
      <div className="gym-card-image-container">
        <img
          src={getAssetPath(gym.image)}
          alt={gym.name}
          className="gym-card-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      <div className="gym-card-content">
        <h3 className="gym-card-name">{gym.name}</h3>
        <p className="gym-card-location">{gym.location}</p>
      </div>
    </Link>
  );
}




