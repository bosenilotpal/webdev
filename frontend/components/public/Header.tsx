'use client';

import Link from 'next/link';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="public-header">
      <div className="public-header-content">
        <div className="public-header-branding-container">
          <Link href="/" className="public-header-branding-link">
            <p className="public-header-branding">FitConnect Ads</p>
          </Link>
        </div>
        <div className="public-header-actions">
          {isAuthenticated ? (
            <Link href="/dashboard" className="public-header-login-link">
              {user?.name || 'Dashboard'}
            </Link>
          ) : (
            <Link href="/login" className="public-header-login-link">
              Login
            </Link>
          )}
          <Link href="/register">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="public-header-post-button"
            >
              List Your Gym
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
