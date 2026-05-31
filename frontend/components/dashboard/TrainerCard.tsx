'use client';

import { Card, Button, Space, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Trainer } from '@/lib/types';
import { getAssetPath } from '@/lib/utils';

interface TrainerCardProps {
  trainer: Trainer;
  onEdit?: (trainer: Trainer) => void;
  onDelete?: (trainer: Trainer) => void;
}

export default function TrainerCard({ trainer, onEdit, onDelete }: TrainerCardProps) {
  return (
    <Card
      hoverable
      cover={
        trainer.image ? (
          <img
            src={getAssetPath(trainer.image)}
            alt={trainer.name}
            style={{
              height: '200px',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f0f0f0'
          }}>
            <Avatar size={80} icon={<UserOutlined />} />
          </div>
        )
      }
      actions={[
        onEdit && (
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(trainer)}
          >
            Edit
          </Button>
        ),
        onDelete && (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(trainer)}
          >
            Delete
          </Button>
        ),
      ].filter(Boolean)}
    >
      <Card.Meta
        title={trainer.name}
        description={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div>{trainer.experience}</div>
            {trainer.bio && <div style={{ color: '#8c8c8c' }}>{trainer.bio}</div>}
          </Space>
        }
      />
    </Card>
  );
}

