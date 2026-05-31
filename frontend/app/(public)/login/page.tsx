'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Alert, Spin } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError('');
    setLoading(true);

    try {
      await login(values.email, values.password);
      router.push('/dashboard');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Invalid email or password';
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
            className="login-container"
            style={{
              maxWidth: '450px',
              margin: '0 auto',
              background: 'var(--color-white)',
              padding: 'var(--spacing-2xl)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <h1
              className="login-title"
              style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                marginBottom: 'var(--spacing-xl)',
                textAlign: 'center',
                color: 'var(--color-text-primary)',
              }}
            >
              Login
            </h1>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
              requiredMark={false}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
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
                  icon={<LoginOutlined />}
                  block
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form.Item>

              <p style={{ textAlign: 'center', margin: 0 }}>
                New gym owner?{' '}
                <Link href="/register" style={{ color: 'var(--color-primary)' }}>
                  List your gym
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
