'use client';

import { useState } from 'react';

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    subscriptionReminders: true,
    newFeatures: true,
    securityAlerts: true,
    weeklyReports: false,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const notificationOptions = [
    {
      key: 'emailNotifications' as const,
      label: 'Email Notifications',
      description: 'Receive notifications via email',
    },
    {
      key: 'smsNotifications' as const,
      label: 'SMS Notifications',
      description: 'Receive notifications via SMS',
    },
    {
      key: 'marketingEmails' as const,
      label: 'Marketing Emails',
      description: 'Receive promotional emails and updates',
    },
    {
      key: 'subscriptionReminders' as const,
      label: 'Subscription Reminders',
      description: 'Get reminders before subscription expires',
    },
    {
      key: 'newFeatures' as const,
      label: 'New Features',
      description: 'Notifications about new platform features',
    },
    {
      key: 'securityAlerts' as const,
      label: 'Security Alerts',
      description: 'Important security-related notifications',
    },
    {
      key: 'weeklyReports' as const,
      label: 'Weekly Reports',
      description: 'Receive weekly performance reports',
    },
  ];

  return (
    <div>
      <h2 className="dashboard-page-title" style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-md)' }}>Notification Preferences</h2>
      <p className="dashboard-page-subtitle" style={{ marginBottom: 'var(--spacing-xl)' }}>
        Choose how you want to receive notifications
      </p>

      <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {notificationOptions.map((option) => (
            <div key={option.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-md)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-xs)' }}>{option.label}</h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {option.description}
                </p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                <input
                  type="checkbox"
                  checked={notifications[option.key]}
                  onChange={() => handleToggle(option.key)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: notifications[option.key] ? 'var(--color-primary)' : '#ccc',
                  transition: 'var(--transition-base)',
                  borderRadius: '24px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    transition: 'var(--transition-base)',
                    borderRadius: '50%',
                    transform: notifications[option.key] ? 'translateX(26px)' : 'translateX(0)'
                  }} />
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




