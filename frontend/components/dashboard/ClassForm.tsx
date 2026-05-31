'use client';

import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, Space } from 'antd';
import { Class } from '@/lib/types';

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classItem: Omit<Class, 'id'>) => void | Promise<void>;
  classItem?: Class | null;
  submitting?: boolean;
}

export default function ClassForm({
  isOpen,
  onClose,
  onSubmit,
  classItem,
  submitting = false,
}: ClassFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      if (classItem) {
        form.setFieldsValue({
          name: classItem.name,
          duration: classItem.duration,
          numberOfClasses: classItem.numberOfClasses,
          price: classItem.price,
        });
      } else {
        form.resetFields();
      }
    }
  }, [classItem, isOpen, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      // Validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={classItem ? 'Edit Class' : 'Add Class'}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
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
            { required: true, message: 'Please enter class name' },
            { min: 2, message: 'Class name must be at least 2 characters' },
          ]}
        >
          <Input placeholder="e.g., Yoga Class" />
        </Form.Item>

        <Form.Item
          label="Duration"
          name="duration"
          rules={[
            { required: true, message: 'Please enter class duration' },
          ]}
        >
          <Input placeholder="e.g., 1 Hour, 45 Minutes" />
        </Form.Item>

        <Form.Item
          label="Number of Classes"
          name="numberOfClasses"
          rules={[
            { required: true, message: 'Please enter number of classes' },
            { type: 'number', min: 1, message: 'Must be at least 1' },
          ]}
        >
          <InputNumber
            placeholder="1"
            style={{ width: '100%' }}
            min={1}
          />
        </Form.Item>

        <Form.Item
          label="Price ($)"
          name="price"
          rules={[
            { required: true, message: 'Please enter class price' },
            { type: 'number', min: 0, message: 'Price must be positive' },
          ]}
        >
          <InputNumber
            placeholder="0.00"
            style={{ width: '100%' }}
            min={0}
            step={0.01}
            precision={2}
            prefix="$"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {classItem ? 'Update' : 'Add'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}





