'use client';

import { useState } from 'react';
import { advertisementSubscription } from '@/lib/constants';
import Button from '@/components/shared/Button';

export default function SubscriptionSettings() {
  const [subscription] = useState({
    plan: 'Basic',
    status: 'Active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    amount: advertisementSubscription.rate,
    autoRenew: true,
  });

  const handleRenew = () => {
    alert('Redirecting to payment page...');
    // In real app, redirect to payment page
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel auto-renewal?')) {
      alert('Auto-renewal cancelled');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const daysRemaining = Math.ceil(
    (new Date(subscription.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div>
      <h2 className="dashboard-page-title" style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-md)' }}>Subscription Management</h2>
      <p className="dashboard-page-subtitle" style={{ marginBottom: 'var(--spacing-xl)' }}>
        Manage your subscription and billing information
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
        <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)', paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-sm)' }}>{subscription.plan} Plan</h3>
              <span
                style={{
                  display: 'inline-block',
                  padding: 'var(--spacing-xs) var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  background: subscription.status === 'Active' ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
                  color: subscription.status === 'Active' ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                }}
              >
                {subscription.status}
              </span>
            </div>
            <div>
              <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>${subscription.amount}</span>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>/month</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Start Date:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {formatDate(subscription.startDate)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>End Date:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {formatDate(subscription.endDate)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Days Remaining:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Auto-Renewal:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                {subscription.autoRenew ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <Button variant="primary" onClick={handleRenew}>
              Renew Subscription
            </Button>
            {subscription.autoRenew && (
              <Button variant="outline" onClick={handleCancel}>
                Cancel Auto-Renewal
              </Button>
            )}
          </div>
        </div>

        <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-lg)' }}>Billing History</h3>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr className="data-table-header-row">
                <th className="data-table-header-cell">Date</th>
                <th className="data-table-header-cell">Amount</th>
                <th className="data-table-header-cell">Status</th>
                <th className="data-table-header-cell">Invoice</th>
              </tr>
            </thead>
            <tbody>
              <tr className="data-table-row">
                <td className="data-table-cell">{formatDate(subscription.startDate)}</td>
                <td className="data-table-cell">${subscription.amount}</td>
                <td className="data-table-cell" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)' }}>Paid</td>
                <td className="data-table-cell">
                  <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}>Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}




