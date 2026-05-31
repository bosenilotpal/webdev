'use client';

import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Modal, Segmented, Avatar, Image, Spin, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  TableOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Trainer } from '@/lib/types';
import {
  createTrainer,
  deleteTrainer,
  fetchTrainers,
  updateTrainer,
  type TrainerInput,
} from '@/lib/api';
import TrainerCard from '@/components/dashboard/TrainerCard';
import TrainerForm from '@/components/dashboard/TrainerForm';
import ErrorState from '@/components/shared/ErrorState';
import { useAuth } from '@/hooks/useAuth';

type ViewMode = 'table' | 'card';

export default function TrainersPage() {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [submitting, setSubmitting] = useState(false);

  const loadTrainers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTrainers();
      setTrainers(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load trainers';
      setError(msg === 'Failed to fetch' ? 'Cannot reach the API server.' : msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrainers();
  }, [loadTrainers]);

  const handleAdd = () => {
    if (!user?.gymId) {
      message.warning('Link a gym to your account in Django admin before adding trainers.');
      return;
    }
    setEditingTrainer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setIsFormOpen(true);
  };

  const handleDelete = (trainer: Trainer) => {
    Modal.confirm({
      title: 'Delete Trainer',
      content: `Are you sure you want to delete "${trainer.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteTrainer(trainer.id);
          message.success('Trainer deleted');
          await loadTrainers();
        } catch (err) {
          message.error(err instanceof Error ? err.message : 'Delete failed');
        }
      },
    });
  };

  const handleSubmit = async (
    trainerData: Omit<Trainer, 'id'>,
    imageFile?: File
  ) => {
    const input: TrainerInput = {
      name: trainerData.name,
      experience: trainerData.experience,
      bio: trainerData.bio,
    };
    setSubmitting(true);
    try {
      if (editingTrainer) {
        await updateTrainer(editingTrainer.id, input, imageFile);
        message.success('Trainer updated');
      } else {
        await createTrainer(input, imageFile);
        message.success('Trainer created');
      }
      setIsFormOpen(false);
      setEditingTrainer(null);
      await loadTrainers();
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Save failed');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<Trainer> = [
    {
      title: 'No',
      key: 'index',
      width: 80,
      render: (_: unknown, __: Trainer, index: number) => index + 1,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image: string, record: Trainer) =>
        image ? (
          <Image
            src={image}
            alt={record.name}
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            preview={false}
          />
        ) : (
          <Avatar size={50} icon={<UserOutlined />} />
        ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Trainer) => (
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
        <Spin size="large" tip="Loading trainers..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadTrainers} />;
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
            <UserOutlined />
          </span>
          Trainers
        </h1>
        <Space size="middle">
          <Segmented
            value={viewMode}
            onChange={(value) => setViewMode(value as ViewMode)}
            options={[
              { label: 'Table', value: 'table', icon: <TableOutlined /> },
              { label: 'Card', value: 'card', icon: <AppstoreOutlined /> },
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Trainer
          </Button>
        </Space>
      </div>

      {!user?.gymId && (
        <p style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>
          No gym is linked to your account. Assign yourself as gym owner in Django admin to
          manage trainers.
        </p>
      )}

      {viewMode === 'table' ? (
        <Table
          columns={columns}
          dataSource={trainers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Total ${total} trainers`,
          }}
          bordered
          locale={{ emptyText: 'No trainers yet. Add your first trainer.' }}
        />
      ) : (
        <div className="dashboard-trainer-cards-grid">
          {trainers.length === 0 ? (
            <p>No trainers yet. Add your first trainer.</p>
          ) : (
            trainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}
      <TrainerForm
        isOpen={isFormOpen}
        onClose={() => {
          if (!submitting) {
            setIsFormOpen(false);
            setEditingTrainer(null);
          }
        }}
        onSubmit={handleSubmit}
        trainer={editingTrainer}
        submitting={submitting}
      />
    </div>
  );
}
