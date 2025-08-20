import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography, Divider } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from 'urql';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

const REQUEST_RESET_MUTATION = `
  mutation RequestAdminPasswordReset($input: AdminPasswordResetRequestInput!) {
    requestAdminPasswordReset(input: $input) {
      success
      message
      token
    }
  }
`;

export const AdminForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [, executeRequest] = useMutation(REQUEST_RESET_MUTATION);

  const handleRequestReset = async (values: { email: string }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeRequest({
        input: { email: values.email },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const { success, message, token } = result.data.requestAdminPasswordReset;

      if (success) {
        setSuccess(true);
        // Store token for next step
        sessionStorage.setItem('resetToken', token);
        sessionStorage.setItem('resetEmail', values.email);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
        <Card style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <Title level={3}>Check Your Email</Title>
          <Text>
            We've sent a 4-digit verification code to your email address. Please
            check your inbox and enter the code to reset your password.
          </Text>
          <Button
            type='primary'
            block
            style={{ marginTop: '20px' }}
            onClick={() => navigate('/auth/reset-password')}
          >
            Enter Verification Code
          </Button>
        </Card>
      </div>
    );
  }

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
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2}>Forgot Password</Title>
          <Text type='secondary'>
            Enter your email address and we'll send you a reset code
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type='error'
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <Form
          form={form}
          layout='vertical'
          onFinish={handleRequestReset}
          size='large'
        >
          <Form.Item
            name='email'
            label='Email Address'
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

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block
              loading={loading}
              style={{ height: '44px' }}
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Link onClick={() => navigate('/auth/login')}>Back to Login</Link>
        </div>
      </Card>
    </div>
  );
};
