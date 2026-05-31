'use client';

import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Space, Upload, Avatar, message } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { Trainer } from '@/lib/types';

interface TrainerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    trainer: Omit<Trainer, 'id'>,
    imageFile?: File
  ) => void | Promise<void>;
  trainer?: Trainer | null;
  submitting?: boolean;
}

function readFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function TrainerForm({
  isOpen,
  onClose,
  onSubmit,
  trainer,
  submitting = false,
}: TrainerFormProps) {
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (trainer) {
      form.setFieldsValue({
        name: trainer.name,
        experience: trainer.experience,
      });
      setImagePreview(trainer.image || '');
      setSelectedFile(null);
      if (trainer.image) {
        setFileList([
          {
            uid: '-1',
            name: 'current-image.jpg',
            status: 'done',
            url: trainer.image,
          },
        ]);
      } else {
        setFileList([]);
      }
    } else {
      form.resetFields();
      setImagePreview('');
      setSelectedFile(null);
      setFileList([]);
    }
  }, [trainer, isOpen, form]);

  const validateImageFile = (file: RcFile): boolean => {
    if (!file.type.startsWith('image/')) {
      message.error('Please select a valid image file');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error('Image size should be less than 5MB');
      return false;
    }
    return true;
  };

  const handleBeforeUpload = async (file: RcFile) => {
    if (!validateImageFile(file)) {
      return Upload.LIST_IGNORE;
    }

    setSelectedFile(file);
    try {
      const preview = await readFilePreview(file);
      setImagePreview(preview);
    } catch {
      message.error('Could not preview image');
    }

    setFileList([
      {
        uid: file.uid,
        name: file.name,
        status: 'done',
        originFileObj: file,
      },
    ]);

    return false;
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setImagePreview(trainer?.image || '');
    setFileList([]);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await onSubmit(
        {
          name: values.name,
          experience: values.experience,
          image: imagePreview || trainer?.image || '',
          bio: trainer?.bio,
        },
        selectedFile ?? undefined
      );
    } catch {
      // validation or API error — parent shows message
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImagePreview('');
    setSelectedFile(null);
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title={trainer ? 'Edit Trainer' : 'Add Trainer'}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Please enter trainer name' },
            { min: 2, message: 'Name must be at least 2 characters' },
          ]}
        >
          <Input placeholder="e.g., John Doe" />
        </Form.Item>

        <Form.Item
          label="Experience"
          name="experience"
          rules={[{ required: true, message: 'Please enter experience' }]}
        >
          <Input placeholder="e.g., 3+ Years" />
        </Form.Item>

        <Form.Item label="Profile Image">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {imagePreview && (
              <Avatar
                src={imagePreview}
                size={120}
                icon={<UserOutlined />}
                style={{ border: '2px solid #f0f0f0' }}
              />
            )}

            <Upload
              fileList={fileList}
              beforeUpload={handleBeforeUpload}
              onRemove={handleRemove}
              maxCount={1}
              accept="image/jpeg,image/png,image/webp,image/gif"
              listType="picture"
            >
              <Button icon={<UploadOutlined />} block>
                {selectedFile || fileList.length > 0
                  ? 'Change Image'
                  : 'Upload Image'}
              </Button>
            </Upload>
          </Space>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {trainer ? 'Update' : 'Add'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
