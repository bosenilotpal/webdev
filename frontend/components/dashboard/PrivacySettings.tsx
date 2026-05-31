'use client';

import { useState } from 'react';
import Input from '@/components/shared/Input';

export default function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: true,
    allowDirectMessages: true,
    dataSharing: false,
    analyticsTracking: true,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setPrivacy({ ...privacy, [field]: value });
  };

  return (
    <div>
      <h2 className="dashboard-page-title" style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-md)' }}>Privacy Settings</h2>
      <p className="dashboard-page-subtitle" style={{ marginBottom: 'var(--spacing-xl)' }}>
        Control your privacy and data sharing preferences
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
        <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-md)' }}>Profile Visibility</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              <input
                type="radio"
                name="profileVisibility"
                value="public"
                checked={privacy.profileVisibility === 'public'}
                onChange={(e) => handleChange('profileVisibility', e.target.value)}
              />
              <div>
                <span style={{ display: 'block', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-xs)' }}>Public</span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Your profile is visible to everyone
                </span>
              </div>
            </label>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              <input
                type="radio"
                name="profileVisibility"
                value="private"
                checked={privacy.profileVisibility === 'private'}
                onChange={(e) => handleChange('profileVisibility', e.target.value)}
              />
              <div>
                <span style={{ display: 'block', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-xs)' }}>Private</span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  Only you can see your profile
                </span>
              </div>
            </label>
          </div>
        </div>

        <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-md)' }}>Contact Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={privacy.showEmail}
                onChange={(e) => handleChange('showEmail', e.target.checked)}
              />
              <span>Show email address on public profile</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={privacy.showPhone}
                onChange={(e) => handleChange('showPhone', e.target.checked)}
              />
              <span>Show phone number on public profile</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={privacy.allowDirectMessages}
                onChange={(e) => handleChange('allowDirectMessages', e.target.checked)}
              />
              <span>Allow direct messages from users</span>
            </label>
          </div>
        </div>

        <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-md)' }}>Data & Analytics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={privacy.dataSharing}
                onChange={(e) => handleChange('dataSharing', e.target.checked)}
              />
              <span>Allow data sharing with partners</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={privacy.analyticsTracking}
                onChange={(e) => handleChange('analyticsTracking', e.target.checked)}
              />
              <span>Enable analytics tracking</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}




