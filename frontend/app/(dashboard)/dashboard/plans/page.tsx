'use client';

import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Modal, Spin, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, CreditCardOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Plan } from '@/lib/types';
import {
  createPlan,
  deletePlan,
  fetchPlans,
  updatePlan,
  type PlanInput,
} from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import PlanForm from '@/components/dashboard/PlanForm';
import ErrorState from '@/components/shared/ErrorState';
import { useAuth } from '@/hooks/useAuth';

export default function PlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlans();
      setPlans(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load plans';
      setError(msg === 'Failed to fetch' ? 'Cannot reach the API server.' : msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleAdd = () => {
    if (!user?.gymId) {
      message.warning('Link a gym to your account before adding plans.');
      return;
    }
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleDelete = (plan: Plan) => {
    Modal.confirm({
      title: 'Delete Plan',
      content: `Are you sure you want to delete "${plan.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deletePlan(plan.id);
          message.success('Plan deleted');
          await loadPlans();
        } catch (err) {
          message.error(err instanceof Error ? err.message : 'Delete failed');
        }
      },
    });
  };

  const handleSubmit = async (planData: PlanInput) => {
    setSubmitting(true);
    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id, {
          ...planData,
          features: editingPlan.features,
          description: editingPlan.description,
        });
        message.success('Plan updated');
      } else {
        await createPlan(planData);
        message.success('Plan created');
      }
      setIsFormOpen(false);
      setEditingPlan(null);
      await loadPlans();
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Save failed');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<Plan> = [
    {
      title: 'No',
      key: 'index',
      width: 80,
      render: (_: unknown, __: Plan, index: number) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Plan) => (
        <Space size="small">
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" tip="Loading plans..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadPlans} />;
  }

  return (
    <div>
      <div
        className="dashboard-page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1 className="dashboard-page-title">
          <span className="dashboard-page-title-icon">
            <CreditCardOutlined />
          </span>
          Plans
        </h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Plan
        </Button>
      </div>

      {!user?.gymId && (
        <p style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>
          No gym is linked to your account. Assign yourself as gym owner in Django admin to
          manage plans.
        </p>
      )}

      <Table
        columns={columns}
        dataSource={plans}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `Total ${total} plans`,
        }}
        bordered
        locale={{ emptyText: 'No plans yet. Add your first plan.' }}
      />
      <PlanForm
        isOpen={isFormOpen}
        onClose={() => {
          if (!submitting) {
            setIsFormOpen(false);
            setEditingPlan(null);
          }
        }}
        onSubmit={handleSubmit}
        plan={editingPlan}
        submitting={submitting}
      />
    </div>
  );
}
