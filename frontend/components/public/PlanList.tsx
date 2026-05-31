'use client';

import { useState } from 'react';
import { Modal } from 'antd';
import { Plan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import CardsGrid from '@/components/public/CardsGrid';
import PlanCard from '@/components/public/PlanCard';

interface PlanListProps {
  plans: Plan[];
}

export default function PlanList({ plans }: PlanListProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  return (
    <>
      <CardsGrid>
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onClick={() => setSelectedPlan(plan)}
          />
        ))}
      </CardsGrid>

      <Modal
        title={
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {selectedPlan?.name}
          </span>
        }
        open={!!selectedPlan}
        onCancel={() => setSelectedPlan(null)}
        footer={null}
        width={600}
        className="plan-detail-modal"
      >
        {selectedPlan && (
          <div className="plan-modal-content">
            {selectedPlan.description && (
              <p className="plan-modal-description">{selectedPlan.description}</p>
            )}

            {selectedPlan.features && selectedPlan.features.length > 0 && (
              <div>
                <h4 className="plan-modal-features-title">What&apos;s included</h4>
                <ul className="plan-modal-features">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <div
              className="card-price-badge card-price-badge--modal"
              aria-label={`Price ${formatCurrency(selectedPlan.price)} per ${selectedPlan.duration}`}
            >
              <span className="card-price-badge__amount">
                {formatCurrency(selectedPlan.price)}
              </span>
              <span className="card-price-badge__sub">/ {selectedPlan.duration}</span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
