'use client';

import PaymentForm from '@/components/dashboard/PaymentForm';
import { FaMoneyBillWave } from 'react-icons/fa';

export default function PaymentPage() {
  return (
    <div>
      <div className="dashboard-page-header">
        <h1 className="dashboard-page-title">
          <span className="dashboard-page-title-icon">
            <FaMoneyBillWave />
          </span>
          Payment Gateway
        </h1>
      </div>
      <PaymentForm />
    </div>
  );
}


