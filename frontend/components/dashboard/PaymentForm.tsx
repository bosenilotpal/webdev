'use client';

import { useState } from 'react';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { mockPaymentMethods } from '@/lib/constants';

export default function PaymentForm() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    fullName: '',
    country: '',
    billingAddress: '',
    state: '',
    phoneNumber: '',
    zipCode: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment submission
    console.log('Payment submitted', { selectedMethod, selectedPlan, paymentInfo });
  };

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-2xl)', flexWrap: 'wrap' }}>
      <div style={{ flex: '1', minWidth: '300px', background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-lg)', textTransform: 'uppercase' }}>PAYMENT METHODS</h3>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
          {mockPaymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              style={{
                padding: 'var(--spacing-md) var(--spacing-lg)',
                border: `2px solid ${selectedMethod === method.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                background: selectedMethod === method.id ? 'var(--color-primary-light)' : 'transparent',
                transition: 'all var(--transition-base)'
              }}
            >
              <span>{method.name}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
            <input
              type="radio"
              id="premium"
              name="plan"
              value="premium"
              checked={selectedPlan === 'premium'}
              onChange={(e) => setSelectedPlan(e.target.value)}
            />
            <label htmlFor="premium">
              <strong>PREMIUM</strong> - $7
            </label>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <li>• Enjoy limitless use with interactive export options</li>
            <li>• Custom profile and more</li>
            <li>• HD video streaming</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="dashboard-form" style={{ flex: '1', minWidth: '300px' }}>
        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-lg)', textTransform: 'uppercase' }}>PAYMENT INFORMATION</h3>
        <div className="input-group">
          <label className="input-label">Select a payment method</label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            required
            className="input"
          >
            <option value="">Select...</option>
            {mockPaymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
          <Input
            label="Expiration date (MM/YYYY)"
            value={paymentInfo.expirationDate}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, expirationDate: e.target.value })
            }
            placeholder="MM/YYYY"
            required
          />
          <Input
            label="Card Number"
            value={paymentInfo.cardNumber}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
            }
            required
          />
        </div>
        <Input
          label="Security code"
          value={paymentInfo.securityCode}
          onChange={(e) =>
            setPaymentInfo({ ...paymentInfo, securityCode: e.target.value })
          }
          required
        />

        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)', textTransform: 'uppercase' }}>BILLING INFORMATION</h3>
        <Input
          label="Full name"
          value={paymentInfo.fullName}
          onChange={(e) =>
            setPaymentInfo({ ...paymentInfo, fullName: e.target.value })
          }
          required
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
          <div className="input-group">
            <label className="input-label">Country</label>
            <select
              value={paymentInfo.country}
              onChange={(e) =>
                setPaymentInfo({ ...paymentInfo, country: e.target.value })
              }
              required
              className="input"
            >
              <option value="">Select...</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">State</label>
            <select
              value={paymentInfo.state}
              onChange={(e) =>
                setPaymentInfo({ ...paymentInfo, state: e.target.value })
              }
              required
              className="input"
            >
              <option value="">Select...</option>
              <option value="NY">New York</option>
              <option value="CA">California</option>
              <option value="TX">Texas</option>
            </select>
          </div>
        </div>
        <Input
          label="Billing Address"
          value={paymentInfo.billingAddress}
          onChange={(e) =>
            setPaymentInfo({ ...paymentInfo, billingAddress: e.target.value })
          }
          required
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
          <Input
            label="Phone Number"
            value={paymentInfo.phoneNumber}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, phoneNumber: e.target.value })
            }
            required
          />
          <Input
            label="Zip or Postal Code"
            value={paymentInfo.zipCode}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, zipCode: e.target.value })
            }
            required
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={paymentInfo.rememberMe}
            onChange={(e) =>
              setPaymentInfo({ ...paymentInfo, rememberMe: e.target.checked })
            }
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>
        <div style={{ padding: 'var(--spacing-lg)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)' }}>
          <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-xs)' }}>Total Amount: 84/yr</p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>fund will be not refundable</p>
        </div>
        <Button type="submit" variant="primary" size="lg" style={{ width: '100%' }}>
          Continue
        </Button>
      </form>
    </div>
  );
}





