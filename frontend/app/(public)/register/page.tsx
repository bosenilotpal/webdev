'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Alert, Spin } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    gymName: string;
    gymLocation: string;
    gymPhone?: string;
    gymEmail?: string;
    gymDescription?: string;
  }) => {
    setError('');
    setLoading(true);

    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        gymName: values.gymName,
        gymLocation: values.gymLocation,
        gymPhone: values.gymPhone,
        gymEmail: values.gymEmail,
        gymDescription: values.gymDescription,
      });
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(
        message === 'Failed to fetch'
          ? 'Cannot reach the server. Make sure Django is running on port 8000.'
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="public-page">
        <Header />
        <main className="public-main">
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <Spin size="large" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="public-page">
      <Header />
      <main className="public-main">
        <div className="container">
          <div
            style={{
              maxWidth: '520px',
              margin: '0 auto',
              background: 'var(--color-white)',
              padding: 'var(--spacing-2xl)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <h1
              style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                marginBottom: 'var(--spacing-sm)',
                textAlign: 'center',
                color: 'var(--color-text-primary)',
              }}
            >
              List Your Gym
            </h1>
            <p
              style={{
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-xl)',
              }}
            >
              Create an account and add your gym to FitConnect Ads
            </p>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
              requiredMark={false}
            >
              <h2
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                Account
              </h2>

              <Form.Item
                label="Full name"
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Your name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="you@example.com" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please enter a password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>

              <Form.Item
                label="Confirm password"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm password"
                />
              </Form.Item>

              <h2
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  margin: 'var(--spacing-lg) 0 var(--spacing-md)',
                }}
              >
                Gym details
              </h2>

              <Form.Item
                label="Gym name"
                name="gymName"
                rules={[{ required: true, message: 'Please enter your gym name' }]}
              >
                <Input prefix={<ShopOutlined />} placeholder="e.g., PowerHouse Fitness" />
              </Form.Item>

              <Form.Item
                label="Location"
                name="gymLocation"
                rules={[{ required: true, message: 'Please enter a location' }]}
              >
                <Input
                  prefix={<EnvironmentOutlined />}
                  placeholder="City, area, or full address"
                />
              </Form.Item>

              <Form.Item label="Phone (optional)" name="gymPhone">
                <Input prefix={<PhoneOutlined />} placeholder="Contact number" />
              </Form.Item>

              <Form.Item
                label="Gym email (optional)"
                name="gymEmail"
                rules={[{ type: 'email', message: 'Please enter a valid email' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="contact@gym.com" />
              </Form.Item>

              <Form.Item label="Short description (optional)" name="gymDescription">
                <Input.TextArea
                  rows={3}
                  placeholder="Tell visitors what makes your gym special"
                />
              </Form.Item>

              {error && (
                <Form.Item>
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError('')}
                  />
                </Form.Item>
              )}

              <Form.Item style={{ marginBottom: 'var(--spacing-md)' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
              </Form.Item>

              <p style={{ textAlign: 'center', margin: 0 }}>
                Already have an account?{' '}
                <Link href="/login" style={{ color: 'var(--color-primary)' }}>
                  Log in
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
