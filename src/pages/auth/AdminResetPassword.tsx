import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography, Divider } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'urql';

const { Title, Text, Link } = Typography;

const VERIFY_CODE_MUTATION = `
  mutation VerifyAdminResetCode($input: VerifyAdminResetCodeInput!) {
    verifyAdminResetCode(input: $input) {
      success
      message
    }
  }
`;

const RESET_PASSWORD_MUTATION = `
  mutation ResetAdminPassword($input: ResetAdminPasswordInput!) {
    resetAdminPassword(input: $input) {
      success
      message
    }
  }
`;

export const AdminResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [error, setError] = useState<string | null>(null);
  const [verifiedCode, setVerifiedCode] = useState<string>('');
  const navigate = useNavigate();

  const [, executeVerifyCode] = useMutation(VERIFY_CODE_MUTATION);
  const [, executeResetPassword] = useMutation(RESET_PASSWORD_MUTATION);

  const resetToken = sessionStorage.getItem('resetToken');
  const resetEmail = sessionStorage.getItem('resetEmail');

  if (!resetToken || !resetEmail) {
    navigate('/auth/forgot-password');
    return null;
  }

  const handleVerifyCode = async (values: { code: string }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeVerifyCode({
        input: {
          email: resetEmail,
          code: values.code,
          token: resetToken,
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.data.verifyAdminResetCode.success) {
        setVerifiedCode(values.code);
        setStep('reset');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await executeResetPassword({
        input: {
          email: resetEmail,
          code: verifiedCode,
          token: resetToken,
          newPassword: values.newPassword,
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.data.resetAdminPassword.success) {
        // Clear session storage
        sessionStorage.removeItem('resetToken');
        sessionStorage.removeItem('resetEmail');

        // Navigate to login with success message
        navigate('/auth/login?reset=success');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
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
      <Card style={{ width: '100%', maxWidth: 400 }}>
        {step === 'verify' ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Title level={2}>Enter Verification Code</Title>
              <Text type='secondary'>
                Enter the 4-digit code sent to {resetEmail}
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
              onFinish={handleVerifyCode}
              size='large'
            >
              <Form.Item
                name='code'
                label='Verification Code'
                rules={[
                  {
                    required: true,
                    message: 'Please enter the verification code',
                  },
                  { len: 4, message: 'Code must be 4 digits' },
                  {
                    pattern: /^\d{4}$/,
                    message: 'Code must contain only numbers',
                  },
                ]}
              >
                <Input
                  placeholder='Enter 4-digit code'
                  maxLength={4}
                  style={{
                    textAlign: 'center',
                    fontSize: '18px',
                    letterSpacing: '8px',
                  }}
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
                  {loading ? 'Verifying...' : 'Verify Code'}
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Title level={2}>Set New Password</Title>
              <Text type='secondary'>
                Create a new password for your account
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
              onFinish={handleResetPassword}
              size='large'
            >
              <Form.Item
                name='newPassword'
                label='New Password'
                rules={[
                  { required: true, message: 'Please enter your new password' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      'Password must contain uppercase, lowercase, and number',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder='Enter new password'
                />
              </Form.Item>

              <Form.Item
                name='confirmPassword'
                label='Confirm Password'
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Passwords do not match')
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder='Confirm new password'
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
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        <div style={{ textAlign: 'center' }}>
          <Link onClick={() => navigate('/auth/login')}>Back to Login</Link>
        </div>
      </Card>
    </div>
  );
};
