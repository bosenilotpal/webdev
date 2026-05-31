'use client';

import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Modal, Spin, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Class } from '@/lib/types';
import {
  createClass,
  deleteClass,
  fetchClasses,
  updateClass,
  type ClassInput,
} from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import ClassForm from '@/components/dashboard/ClassForm';
import ErrorState from '@/components/shared/ErrorState';
import { useAuth } from '@/hooks/useAuth';

export default function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClasses();
      setClasses(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load classes';
      setError(msg === 'Failed to fetch' ? 'Cannot reach the API server.' : msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleAdd = () => {
    if (!user?.gymId) {
      message.warning('Link a gym to your account in Django admin before adding classes.');
      return;
    }
    setEditingClass(null);
    setIsFormOpen(true);
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setIsFormOpen(true);
  };

  const handleDelete = (classItem: Class) => {
    Modal.confirm({
      title: 'Delete Class',
      content: `Are you sure you want to delete "${classItem.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteClass(classItem.id);
          message.success('Class deleted');
          await loadClasses();
        } catch (err) {
          message.error(err instanceof Error ? err.message : 'Delete failed');
        }
      },
    });
  };

  const handleSubmit = async (classData: ClassInput) => {
    setSubmitting(true);
    try {
      if (editingClass) {
        await updateClass(editingClass.id, classData);
        message.success('Class updated');
      } else {
        await createClass(classData);
        message.success('Class created');
      }
      setIsFormOpen(false);
      setEditingClass(null);
      await loadClasses();
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Save failed');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<Class> = [
    {
      title: 'No',
      key: 'index',
      width: 80,
      render: (_: unknown, __: Class, index: number) => index + 1,
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
      title: 'No of Classes',
      dataIndex: 'numberOfClasses',
      key: 'numberOfClasses',
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
      render: (_: unknown, record: Class) => (
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
        <Spin size="large" tip="Loading classes..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadClasses} />;
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
            <CalendarOutlined />
          </span>
          Classes
        </h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Class
        </Button>
      </div>

      {!user?.gymId && (
        <p style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>
          No gym is linked to your account. Assign yourself as gym owner in Django admin to
          manage classes.
        </p>
      )}

      <Table
        columns={columns}
        dataSource={classes}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `Total ${total} classes`,
        }}
        bordered
        locale={{ emptyText: 'No classes yet. Add your first class.' }}
      />
      <ClassForm
        isOpen={isFormOpen}
        onClose={() => {
          if (!submitting) {
            setIsFormOpen(false);
            setEditingClass(null);
          }
        }}
        onSubmit={handleSubmit}
        classItem={editingClass}
        submitting={submitting}
      />
    </div>
  );
}
