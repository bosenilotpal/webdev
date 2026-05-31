'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

export default function TopBar() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  const handleLogout = () => {
    logout();
    router.push('/login');
    setIsPopoverOpen(false);
  };



  const userInitials = user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';

  return (
    <div className="dashboard-topbar">
      <div className="dashboard-topbar-content">
        <div className="dashboard-topbar-spacer"></div>
        <div className="dashboard-topbar-actions">
          <button
            ref={buttonRef}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="dashboard-topbar-avatar-button"
            aria-label="User menu"
          >
            <div className="dashboard-topbar-avatar">
              {userInitials}
            </div>
            <FaChevronDown className={`dashboard-topbar-chevron ${isPopoverOpen ? 'open' : ''}`} />
          </button>
          {isPopoverOpen && (
            <div ref={popoverRef} className="dashboard-topbar-popover">
              <div className="dashboard-topbar-popover-header">
                <div className="dashboard-topbar-popover-avatar">
                  {userInitials}
                </div>
                <div className="dashboard-topbar-popover-info">
                  <div className="dashboard-topbar-popover-name">
                    {user?.name || user?.email || 'User'}
                  </div>
                  <div className="dashboard-topbar-popover-email">
                    {user?.email || ''}
                  </div>
                </div>
              </div>
              <div className="dashboard-topbar-popover-divider"></div>
              <button
                onClick={handleLogout}
                className="dashboard-topbar-popover-item"
              >
                <FaSignOutAlt className="dashboard-topbar-popover-icon" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
