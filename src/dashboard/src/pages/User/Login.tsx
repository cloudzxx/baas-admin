import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Form, Input, Button, Card, Tabs, Alert, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin, useRegister } from '@/lib/services';
import { useAuthStore } from '@/stores/auth';

export default function LoginPage() {
  const intl = useIntl();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [loginError, setLoginError] = useState('');

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleLogin = (values: { email: string; password: string }) => {
    setLoginError('');
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        login(data.token, data.user.role);
        message.success('Login successful');
        navigate('/overview');
      },
      onError: () => {
        setLoginError(
          intl.formatMessage({
            id: 'app.login.message-invalid-credentials',
            defaultMessage: 'Invalid username or password.',
          })
        );
      },
    });
  };

  const handleRegister = (values: {
    email: string;
    password: string;
    org_name: string;
    agent_url: string;
    passwordAgain: string;
  }) => {
    const { passwordAgain: _, ...data } = values;
    registerMutation.mutate(data as Parameters<typeof registerMutation.mutate>[0], {
      onSuccess: () => {
        message.success(
          intl.formatMessage({
            id: 'app.register.success',
            defaultMessage: 'Registration successful! Please log in.',
          })
        );
      },
      onError: () => {
        message.error('Registration failed');
      },
    });
  };

  const tabItems = [
    {
      key: 'login',
      label: intl.formatMessage({ id: 'app.login.login', defaultMessage: 'Login' }),
      children: (
        <div className="max-w-sm mx-auto mt-8">
          <Card bordered={false}>
            {loginError && (
              <Alert message={loginError} type="error" showIcon style={{ marginBottom: 16 }} />
            )}
            <Form onFinish={handleLogin} layout="vertical">
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'validation.email.required' }) },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'validation.password.required' }) },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loginMutation.isPending} block>
                  {intl.formatMessage({ id: 'app.login.login' })}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      ),
    },
    {
      key: 'register',
      label: intl.formatMessage({ id: 'app.register.register', defaultMessage: 'Register' }),
      children: (
        <div className="max-w-sm mx-auto mt-8">
          <Card bordered={false}>
            <Alert
              message={intl.formatMessage({ id: 'app.register.info' })}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Form onFinish={handleRegister} layout="vertical">
              <Form.Item
                name="org_name"
                label="Organization Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="orgname.example.com" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true }]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
              <Form.Item
                name="passwordAgain"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  { required: true },
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
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
              <Form.Item
                name="agent_url"
                label="Agent URL"
                rules={[{ required: true }]}
              >
                <Input placeholder="http://example.com" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={registerMutation.isPending}
                  block
                >
                  {intl.formatMessage({ id: 'app.register.register' })}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <Tabs defaultActiveKey="login" centered items={tabItems} />
      </div>
    </div>
  );
}
