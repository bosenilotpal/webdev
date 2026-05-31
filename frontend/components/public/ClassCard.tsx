'use client';

import { Class } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface ClassCardProps {
  classItem: Class;
}

export default function ClassCard({ classItem }: ClassCardProps) {
  return (
    <article className="class-card">
      <div className="class-card-body">
        <h3 className="class-card-title">{classItem.name}</h3>
        <div className="class-card-meta">
          <span className="class-card-pill">{classItem.duration}</span>
          <span className="class-card-pill">
            {classItem.numberOfClasses} classes
          </span>
        </div>
        <p className="class-card-description">
          {classItem.description ||
            'Expert-led training to help you achieve your fitness goals.'}
        </p>
      </div>
      <div className="card-price-badge" aria-label={`Price ${formatCurrency(classItem.price)}`}>
        <span className="card-price-badge__amount">
          {formatCurrency(classItem.price)}
        </span>
      </div>
    </article>
  );
}
