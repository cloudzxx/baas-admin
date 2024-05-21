import { useEffect, useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import {
  Card, Button, Modal, Form, Input, Select, message, Dropdown, Space,
} from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { useUsers, useCreateUser, useDeleteUser, useOrganizations } from '@/lib/services';
import { useTableManagement } from '@/hooks/useTableManagement';
import { getAuthority } from '@/lib/utils';

export default function UserManagementPage() {
  const intl = useIntl();
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const userRole = getAuthority()[0];

  const { handleTableChange, refreshList, selectedRows, handleSelectRows, clearSelectedRows } =
    useTableManagement({ onList: () => refetch() });

  const { data, isLoading, refetch } = useUsers();
  const { data: orgData } = useOrganizations();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const users = data?.data || [];
  const organizations = orgData?.data || [];
  const pagination = { total: data?.total || 0, current: 1, pageSize: 10 };

  useEffect(() => { refetch(); }, [refetch]);

  const handleSubmit = useCallback(
    (values: Record<string, unknown>) => {
      const { passwordConfirm: _, ...payload } = values;
      createUser.mutate(payload, {
        onSuccess: (res) => {
          if ((res as Record<string, unknown>).id) {
            message.success('Create user success');
            setModalOpen(false);
            form.resetFields();
            refetch();
          } else {
            message.error('Create user failed');
          }
        },
        onError: () => message.error('Create user failed'),
      });
    },
    [createUser, form, refetch]
  );

  const handleDelete = useCallback(() => {
    const names = selectedRows.map((r) => r.username as string);
    Modal.confirm({
      title: intl.formatMessage({ id: 'app.user.form.delete.title', defaultMessage: 'Delete User' }),
      content: intl.formatMessage(
        { id: 'app.user.form.delete.content', defaultMessage: 'Confirm to delete user {name}' },
        { name: names.join(', ') }
      ),
      onOk: () => {
        selectedRows.forEach((item) => {
          deleteUser.mutate(item.id as string, {
            onSuccess: () => {
              message.success(`Deleted user ${item.username}`);
              clearSelectedRows();
              refetch();
            },
          });
        });
      },
    });
  }, [selectedRows, intl, deleteUser, clearSelectedRows, refetch]);

  const columns = [
    {
      title: intl.formatMessage({ id: 'app.user.table.header.name', defaultMessage: 'User Name' }),
      dataIndex: 'email' as const,
    },
    {
      title: intl.formatMessage({ id: 'app.user.table.header.role', defaultMessage: 'User Role' }),
      dataIndex: 'role' as const,
      render: (text: string) =>
        intl.formatMessage({
          id: `app.user.role.${(text || '').toLowerCase()}`,
          defaultMessage: 'User',
        }),
    },
    {
      title: intl.formatMessage({ id: 'app.user.table.header.organization', defaultMessage: 'Organization' }),
      dataIndex: 'organization' as const,
      render: (text: { name?: string }) => (text?.name || ''),
    },
    {
      title: intl.formatMessage({ id: 'app.organization.table.header.createTime', defaultMessage: 'Create Time' }),
      dataIndex: 'created_at' as const,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <PageHeaderWrapper
      title={
        <span>
          <UserOutlined style={{ marginRight: 15 }} />
          {intl.formatMessage({ id: 'app.user.title', defaultMessage: 'User Management' })}
        </span>
      }
    >
      <Card bordered={false}>
        <div className="mb-4 flex gap-2">
          <Button type="primary" onClick={() => { form.resetFields(); setModalOpen(true); }}>
            {intl.formatMessage({ id: 'form.button.new', defaultMessage: 'New' })}
          </Button>
          {selectedRows.length > 0 && (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'delete',
                    label: intl.formatMessage({ id: 'form.menu.item.delete', defaultMessage: 'Delete' }),
                    onClick: handleDelete,
                  },
                ],
              }}
            >
              <Button>
                <Space>
                  {intl.formatMessage({ id: 'form.button.moreActions', defaultMessage: 'More Actions' })}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          )}
        </div>
        <StandardTable
          loading={isLoading}
          rowKey="id"
          data={{ list: users, pagination }}
          columns={columns}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRows}
          onChange={handleTableChange}
        />
      </Card>
      <Modal
        destroyOnClose
        title={intl.formatMessage({
          id: 'app.user.form.new.title',
          defaultMessage: 'New User',
        })}
        open={modalOpen}
        confirmLoading={createUser.isPending}
        onOk={() => form.submit()}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="username" label="User Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select>
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="administrator">Administrator</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="passwordConfirm"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          {userRole === 'administrator' && (
            <Form.Item name="organization" label="Organization">
              <Select>
                {organizations.map((org) => (
                  <Select.Option key={org.id} value={org.id}>
                    {org.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
}
