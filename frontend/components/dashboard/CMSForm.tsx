'use client';

import { useEffect } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import { CMSItem } from '@/lib/types';

const { TextArea } = Input;

interface CMSFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: CMSItem) => void | Promise<void>;
  item?: CMSItem | null;
  submitting?: boolean;
}

export default function CMSForm({
  isOpen,
  onClose,
  onSubmit,
  item,
  submitting = false,
}: CMSFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen && item) {
      form.setFieldsValue({
        content: item.content,
      });
    } else {
      form.resetFields();
    }
  }, [item, isOpen, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (item) {
        await onSubmit({ ...item, content: values.content });
      }
    } catch (error) {
      // Validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const isMultiline = item?.type === 'text' || item?.type === 'banner';

  return (
    <Modal
      title={`Edit ${item?.name || 'CMS Item'}`}
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
          label="Content"
          name="content"
          rules={[
            { required: true, message: 'Please enter content' },
          ]}
        >
          {isMultiline ? (
            <TextArea rows={6} placeholder="Enter content" />
          ) : (
            <Input placeholder="Enter content" />
          )}
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Update
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
