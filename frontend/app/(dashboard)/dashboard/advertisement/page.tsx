'use client';

import QRCodeDisplay from '@/components/dashboard/QRCodeDisplay';
import { FaBullhorn } from 'react-icons/fa';

export default function AdvertisementPage() {
  return (
    <div>
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">
            <span className="dashboard-page-title-icon">
              <FaBullhorn />
            </span>
            Advertisement
          </h1>
          <p className="dashboard-page-subtitle">Share your gym's QR code</p>
        </div>
      </div>
      <QRCodeDisplay />
    </div>
  );
}


