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
        {onClick && <span className="plan-card-cta">View details</span>}
      </div>
      <div
        className="card-price-badge card-price-badge--plan"
        aria-label={`Price ${formatCurrency(plan.price)} per ${plan.duration}`}
      >
        <span className="card-price-badge__amount">
          {formatCurrency(plan.price)}
        </span>
        <span className="card-price-badge__sub">/ {plan.duration}</span>
      </div>
    </article>
  );
}
