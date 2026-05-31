'use client';

import { useState } from 'react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { advertisementSubscription } from '@/lib/constants';

interface PublishPaymentSectionProps {
  onPaymentComplete: () => void;
  paymentCompleted: boolean;
}

export default function PublishPaymentSection({
  onPaymentComplete,
  paymentCompleted,
}: PublishPaymentSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card'>('paypal');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    basic: {
      name: 'Basic',
      price: advertisementSubscription.rate,
      duration: advertisementSubscription.duration,
      features: ['Standard listing', '30 days visibility', 'Basic support'],
    },
    premium: {
      name: 'Premium',
      price: 7,
      duration: advertisementSubscription.duration,
      features: ['Featured placement', '30 days visibility', 'Priority support', 'Analytics'],
    },
  };

  const selectedPlanData = plans[selectedPlan];
  const totalAmount = selectedPlanData.price;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      if (!cardInfo.cardNumber || !cardInfo.expirationDate || !cardInfo.securityCode) {
        alert('Please fill in all card details');
        return;
      }
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
      alert('Payment successful! You can now publish your gym.');
    }, 2000);
  };

  if (paymentCompleted) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-4xl)', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ fontSize: 'var(--font-size-5xl)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }}>✓</div>
        <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-md)' }}>Payment Completed</h3>
        <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-sm)' }}>
          Your payment of ${totalAmount} has been processed successfully.
        </p>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          Your gym will be live for {selectedPlanData.duration} days after publishing.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-lg)', textTransform: 'uppercase' }}>Select Subscription Plan</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
          <div
            onClick={() => setSelectedPlan('basic')}
            style={{
              padding: 'var(--spacing-xl)',
              border: `2px solid ${selectedPlan === 'basic' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              background: selectedPlan === 'basic' ? 'var(--color-primary-light)' : 'var(--color-white)',
              transition: 'all var(--transition-base)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
              <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>Basic</h4>
              <div>
                <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>${plans.basic.price}</span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>/month</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--font-size-sm)' }}>
              {plans.basic.features.map((feature, index) => (
                <li key={index} style={{ marginBottom: 'var(--spacing-xs)' }}>• {feature}</li>
              ))}
            </ul>
          </div>

          <div
            onClick={() => setSelectedPlan('premium')}
            style={{
              padding: 'var(--spacing-xl)',
              border: `2px solid ${selectedPlan === 'premium' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              background: selectedPlan === 'premium' ? 'var(--color-primary-light)' : 'var(--color-white)',
              transition: 'all var(--transition-base)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
              <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>Premium</h4>
              <div>
                <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>${plans.premium.price}</span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>/month</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--font-size-sm)' }}>
              {plans.premium.features.map((feature, index) => (
                <li key={index} style={{ marginBottom: 'var(--spacing-xs)' }}>• {feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handlePayment} className="dashboard-form">
        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-lg)', textTransform: 'uppercase' }}>Payment Method</h3>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
          <button
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            style={{
              flex: 1,
              padding: 'var(--spacing-md)',
              border: `2px solid ${paymentMethod === 'paypal' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              background: paymentMethod === 'paypal' ? 'var(--color-primary-light)' : 'transparent',
              cursor: 'pointer',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            PayPal
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            style={{
              flex: 1,
              padding: 'var(--spacing-md)',
              border: `2px solid ${paymentMethod === 'card' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              background: paymentMethod === 'card' ? 'var(--color-primary-light)' : 'transparent',
              cursor: 'pointer',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            Credit Card
          </button>
        </div>

        {paymentMethod === 'card' && (
          <div>
            <Input
              label="Card Number"
              value={cardInfo.cardNumber}
              onChange={(e) =>
                setCardInfo({ ...cardInfo, cardNumber: e.target.value })
              }
              placeholder="1234 5678 9012 3456"
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
              <Input
                label="Expiration (MM/YY)"
                value={cardInfo.expirationDate}
                onChange={(e) =>
                  setCardInfo({ ...cardInfo, expirationDate: e.target.value })
                }
                placeholder="MM/YY"
                required
              />
              <Input
                label="CVV"
                value={cardInfo.securityCode}
                onChange={(e) =>
                  setCardInfo({ ...cardInfo, securityCode: e.target.value })
                }
                placeholder="123"
                required
              />
            </div>
          </div>
        )}

        <div style={{ padding: 'var(--spacing-lg)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
            <span>Plan:</span>
            <span>{selectedPlanData.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
            <span>Duration:</span>
            <span>{selectedPlanData.duration} days</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-lg)' }}>
            <span>Total Amount:</span>
            <span>${totalAmount}</span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isProcessing}
          style={{ width: '100%' }}
        >
          {isProcessing ? 'Processing...' : `Pay $${totalAmount}`}
        </Button>

        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
          By proceeding, you agree to our Terms of Service. Payment is non-refundable.
        </p>
      </form>
    </div>
  );
}




