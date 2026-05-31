'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Modal from '@/components/shared/Modal';

export default function DangerZone() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    // Simulate account deletion
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      logout();
      router.push('/');
      alert('Your account has been deleted');
    }, 2000);
  };

  const handleExportData = () => {
    alert('Data export initiated. You will receive an email with your data shortly.');
  };

  return (
    <div className="settings-section">
      <h2 className="dashboard-page-title" style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-md)' }}>Danger Zone</h2>
      <p className="dashboard-page-subtitle" style={{ marginBottom: 'var(--spacing-xl)' }}>
        Irreversible and destructive actions. Please proceed with caution.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
        <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-sm)' }}>Export Account Data</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                Download all your account data, including gym information, plans, classes, and trainers.
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              Export Data
            </Button>
          </div>
        </div>

        <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-sm)' }}>Delete Account</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
      >
        <div>
          <div style={{ padding: 'var(--spacing-lg)', background: '#fee', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)' }}>
            <p style={{ color: '#c33', fontSize: 'var(--font-size-sm)' }}>
              <strong>Warning:</strong> This action cannot be undone. This will permanently delete
              your account and remove all of your data from our servers.
            </p>
          </div>

          <p style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}>
            To confirm, please type <strong>DELETE</strong> in the box below:
          </p>

          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
          />

          <div className="dashboard-form-actions">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setConfirmText('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteAccount}
              disabled={confirmText !== 'DELETE' || isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete My Account'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}




