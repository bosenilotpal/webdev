'use client';

import { useState } from 'react';
import { Modal, Button as AntButton } from 'antd';
import { Plan } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import CardsGrid from '@/components/public/CardsGrid';
import PlanCard from '@/components/public/PlanCard';

interface PlanListProps {
  plans: Plan[];
}

export default function PlanList({ plans }: PlanListProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

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
        onCancel={handleCloseModal}
        footer={[
          <AntButton key="close" onClick={handleCloseModal}>
            Close
          </AntButton>,
          <AntButton key="select" type="primary">
            Select Plan
          </AntButton>,
        ]}
        width={600}
      >
        {selectedPlan && (
          <div className="plan-modal-content">
            <div className="plan-modal-price">
              {formatCurrency(selectedPlan.price)}
              <span> / {selectedPlan.duration}</span>
            </div>

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
          </div>
        )}
      </Modal>
    </>
  );
}
