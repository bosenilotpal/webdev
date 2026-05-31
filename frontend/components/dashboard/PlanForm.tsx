'use client';

import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, Space } from 'antd';
import { Plan } from '@/lib/types';

interface PlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: Omit<Plan, 'id'>) => void | Promise<void>;
  plan?: Plan | null;
  submitting?: boolean;
}

export default function PlanForm({
  isOpen,
  onClose,
  onSubmit,
  plan,
  submitting = false,
}: PlanFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      if (plan) {
        form.setFieldsValue({
          name: plan.name,
          duration: plan.duration,
          price: plan.price,
        });
      } else {
        form.resetFields();
      }
    }
  }, [plan, isOpen, form]);

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
      title={plan ? 'Edit Plan' : 'Add Plan'}
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
            { required: true, message: 'Please enter plan name' },
            { min: 2, message: 'Plan name must be at least 2 characters' },
          ]}
        >
          <Input placeholder="e.g., Premium Plan" />
        </Form.Item>

        <Form.Item
          label="Duration"
          name="duration"
          rules={[
            { required: true, message: 'Please enter plan duration' },
          ]}
        >
          <Input placeholder="e.g., 3 Months, 1 Year" />
        </Form.Item>

        <Form.Item
          label="Price ($)"
          name="price"
          rules={[
            { required: true, message: 'Please enter plan price' },
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
            <Button onClick={handleCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {plan ? 'Update' : 'Add'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}





