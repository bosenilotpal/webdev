'use client';

import { useState, useEffect, useCallback } from 'react';
import { Table, Spin, message } from 'antd';
import { EditOutlined, BgColorsOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { CMSItem } from '@/lib/types';
import { fetchCmsItems, updateCmsItem } from '@/lib/api';
import CMSForm from '@/components/dashboard/CMSForm';
import ErrorState from '@/components/shared/ErrorState';
import { useAuth } from '@/hooks/useAuth';

export default function CMSPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<CMSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CMSItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCmsItems();
      setItems(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load CMS items';
      setError(msg === 'Failed to fetch' ? 'Cannot reach the API server.' : msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleEdit = (item: CMSItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSubmit = async (item: CMSItem) => {
    setSubmitting(true);
    try {
      const updated = await updateCmsItem(item.id, item.content);
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      message.success(`"${updated.name}" updated`);
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<CMSItem> = [
    {
      title: 'No',
      key: 'index',
      width: 80,
      render: (_: unknown, __: CMSItem, index: number) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Preview',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (content: string) =>
        content.length > 80 ? `${content.slice(0, 80)}…` : content,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_: unknown, record: CMSItem) => (
        <EditOutlined
          style={{ cursor: 'pointer', fontSize: '16px' }}
          onClick={() => handleEdit(record)}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" tip="Loading CMS items..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadItems} />;
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
            <BgColorsOutlined />
          </span>
          CMS / Branding
        </h1>
      </div>

      {!user?.gymId && (
        <p style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>
          Link a gym to your account in Django admin to manage branding content.
        </p>
      )}

      <Table
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `Total ${total} items`,
        }}
        bordered
        locale={{ emptyText: 'No CMS items found for your gym.' }}
      />
      <CMSForm
        isOpen={isFormOpen}
        onClose={() => {
          if (!submitting) {
            setIsFormOpen(false);
            setEditingItem(null);
          }
        }}
        onSubmit={handleSubmit}
        item={editingItem}
        submitting={submitting}
      />
    </div>
  );
}
