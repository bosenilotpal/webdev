'use client';

import { FaHome } from 'react-icons/fa';

export default function DashboardPage() {
  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">
            <span className="dashboard-page-title-icon">
              <FaHome />
            </span>
            Dashboard
          </h1>
          <p className="dashboard-page-subtitle">Welcome to your dashboard</p>
        </div>
      </div>
    </div>
  );
}


