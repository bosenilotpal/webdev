'use client';

import { Plan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface PlanCardProps {
  plan: Plan;
  onClick?: () => void;
}

export default function PlanCard({ plan, onClick }: PlanCardProps) {
  return (
    <article
      className={`plan-card ${onClick ? 'plan-card--clickable' : ''}`}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="plan-card-body">
        <h3 className="plan-card-title">{plan.name}</h3>
        <div className="plan-card-price">
          <span className="plan-card-price-amount">{formatCurrency(plan.price)}</span>
          <span className="plan-card-duration">/ {plan.duration}</span>
        </div>
        {plan.description && (
          <p className="plan-card-description">{plan.description}</p>
        )}
        {plan.features && plan.features.length > 0 && (
          <ul className="plan-card-features">
            {plan.features.slice(0, 4).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
            {plan.features.length > 4 && (
              <li className="plan-card-features-more">
                +{plan.features.length - 4} more
              </li>
            )}
          </ul>
        )}
        {onClick && (
          <span className="plan-card-cta">View details</span>
        )}
      </div>
    </article>
  );
}
