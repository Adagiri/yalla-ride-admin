import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography, Divider } from 'antd';
import {  LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from 'urql';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

const ADMIN_LOGIN_MUTATION = `
  mutation AdminLogin($input: AdminLoginInput!) {
    adminLogin(input: $input) {
      token
      admin {
        id
        firstname
        lastname
        email
        role
        department
      }
      expiresAt
    }
  }
`;

interface LoginFormData {
  email: string;
  password: string;
}

export const AdminLogin: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [, executeLogin] = useMutation(ADMIN_LOGIN_MUTATION);

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeLogin({
        input: {
          email: values.email,
          password: values.password,
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const { token, admin, expiresAt } = result.data.adminLogin;

      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(admin));
      localStorage.setItem('expiresAt', expiresAt);

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>
            Admin Login
          </Title>
          <Text type='secondary'>Sign in to your admin account</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type='error'
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <Form form={form} layout='vertical' onFinish={handleLogin} size='large'>
          <Form.Item
            name='email'
            label='Email'
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder='admin@company.com'
              autoComplete='email'
            />
          </Form.Item>

          <Form.Item
            name='password'
            label='Password'
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='Enter your password'
              autoComplete='current-password'
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block
              loading={loading}
              style={{ height: '44px', borderRadius: '8px' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Link onClick={() => navigate('/auth/forgot-password')}>
            Forgot your password?
          </Link>
        </div>
      </Card>
    </div>
  );
};

