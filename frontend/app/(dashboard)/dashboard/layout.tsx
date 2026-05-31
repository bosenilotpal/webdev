'use client';

import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content-wrapper">
          <TopBar />
          <main className="dashboard-main">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

