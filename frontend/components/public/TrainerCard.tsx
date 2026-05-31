'use client';

import { Trainer } from '@/lib/types';
import { getAssetPath } from '@/lib/utils';

interface TrainerCardProps {
  trainer: Trainer;
}

export default function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <div className="trainer-card">
      <div className="trainer-card-image-container">
        <img
          src={getAssetPath(trainer.image)}
          alt={trainer.name}
          className="trainer-card-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div className="trainer-card-overlay">
          <h3 className="trainer-card-name">{trainer.name}</h3>
        </div>
      </div>
    </div>
  );
}





