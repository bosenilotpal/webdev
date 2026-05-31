'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FaUser, FaBell, FaLock, FaCreditCard, FaExclamationTriangle, FaCog } from 'react-icons/fa';
import AccountSettings from '@/components/dashboard/AccountSettings';
import NotificationSettings from '@/components/dashboard/NotificationSettings';
import PrivacySettings from '@/components/dashboard/PrivacySettings';
import SubscriptionSettings from '@/components/dashboard/SubscriptionSettings';
import DangerZone from '@/components/dashboard/DangerZone';
import Button from '@/components/shared/Button';

type SettingsTab = 'account' | 'notifications' | 'privacy' | 'subscription' | 'danger';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'account' as SettingsTab, label: 'Account', icon: FaUser },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: FaBell },
    { id: 'privacy' as SettingsTab, label: 'Privacy', icon: FaLock },
    { id: 'subscription' as SettingsTab, label: 'Subscription', icon: FaCreditCard },
    { id: 'danger' as SettingsTab, label: 'Danger Zone', icon: FaExclamationTriangle },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">
            <span className="dashboard-page-title-icon">
              <FaCog />
            </span>
            Settings
          </h1>
          <p className="dashboard-page-subtitle">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* <div className="settings-tabs-container">
        <nav className="settings-tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`settings-tab ${
                  activeTab === tab.id ? 'active' : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent className="settings-tab-icon" />
                <span className="settings-tab-label">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          {activeTab === 'account' && <AccountSettings user={user} />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'privacy' && <PrivacySettings />}
          {activeTab === 'subscription' && <SubscriptionSettings />}
          {activeTab === 'danger' && <DangerZone />}
        </div>

        {activeTab !== 'danger' && (
          <div className="settings-actions">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Cancel
            </Button>
          </div>
        )}
      </div> */}
    </div>
  );
}
