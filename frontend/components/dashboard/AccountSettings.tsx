'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import { FaEdit } from 'react-icons/fa';

interface AccountSettingsProps {
  user: User | null;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [originalData, setOriginalData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name,
        email: user.email,
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setOriginalData(formData);
      setIsEditMode(false);
      setIsSaving(false);
      alert('Account information updated successfully!');
    }, 1000);
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      setIsPasswordModalOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('Password changed successfully!');
    }, 1000);
  };

  return (
    <div>
      <h2 className="dashboard-page-title" style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-md)' }}>Account Information</h2>
      <p className="dashboard-page-subtitle" style={{ marginBottom: 'var(--spacing-xl)' }}>
        Manage your account information and password
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
        <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>Personal Information</h3>
            {!isEditMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-sm)' }}
                title="Edit"
              >
                <FaEdit />
              </Button>
            )}
          </div>

          {isEditMode ? (
            <div className="dashboard-form">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter your email"
              />
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)', justifyContent: 'flex-end' }}>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                  Full Name
                </label>
                <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                  {formData.name || 'Not set'}
                </p>
              </div>
              <div>
                <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                  Email Address
                </label>
                <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                  {formData.email || 'Not set'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>Password</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </Button>
          </div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Last changed: Never
          </p>
        </div>
      </div>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }}
        title="Change Password"
      >
        <div className="dashboard-form">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
            placeholder="Enter current password"
            required
          />
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            placeholder="Enter new password"
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            placeholder="Confirm new password"
            required
          />
          {passwordData.newPassword &&
            passwordData.confirmPassword &&
            passwordData.newPassword !== passwordData.confirmPassword && (
              <p className="input-error-message">
                Passwords do not match
              </p>
            )}
          <div className="dashboard-form-actions">
            <Button
              variant="outline"
              onClick={() => {
                setIsPasswordModalOpen(false);
                setPasswordData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
              }}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleChangePassword}
              disabled={isChangingPassword || passwordData.newPassword !== passwordData.confirmPassword}
            >
              {isChangingPassword ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}




