import { useEffect, useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Card, Button, Modal, Form, Input, Select, Badge, message } from 'antd';
import { PlusOutlined, NodeIndexOutlined } from '@ant-design/icons';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { useNodes, useCreateNode, useRegisterUserToNode } from '@/lib/services';
import { useTableManagement } from '@/hooks/useTableManagement';
import { getAuthority } from '@/lib/utils';

const badgeStatus = (status: string) => {
  const map: Record<string, string> = {
    running: 'success',
    paused: 'warning',
    restarting: 'error',
  };
  return map[status.toLowerCase()] || 'default';
};

export default function NodePage() {
  const intl = useIntl();
  const [createOpen, setCreateOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const { handleTableChange, refreshList, selectedRows, handleSelectRows } = useTableManagement({
    onList: () => refetch(),
  });

  const { data, isLoading, refetch } = useNodes();
  const createNode = useCreateNode();
  const registerUser = useRegisterUserToNode();

  const nodes = data?.data || [];
  const pagination = { total: data?.total || 0, current: 1, pageSize: 10 };
  const userRole = getAuthority()[0];

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCreate = useCallback(
    (values: { name: string; type: string }) => {
      createNode.mutate(values, {
        onSuccess: (res) => {
          if ((res as Record<string, unknown>).status === 'successful') {
            message.success('Create node succeed');
            createForm.resetFields();
            setCreateOpen(false);
            refetch();
          } else {
            message.error('Create node failed');
          }
        },
        onError: () => message.error('Create node failed'),
      });
    },
    [createNode, createForm, refetch]
  );

  const handleRegisterUser = useCallback(
    (values: { name: string; secret: string; user_type: string }) => {
      registerUser.mutate(
        { id: '', data: values },
        { onSuccess: () => { message.success('Registered User Successful.'); setRegisterOpen(false); } }
      );
    },
    [registerUser]
  );

  const columns = [
    {
      title: intl.formatMessage({ id: 'app.node.table.header.name', defaultMessage: 'Name' }),
      dataIndex: 'name' as const,
    },
    {
      title: intl.formatMessage({ id: 'app.node.table.header.type', defaultMessage: 'Type' }),
      dataIndex: 'type' as const,
      render: (text: string) => text?.toLowerCase(),
    },
    {
      title: intl.formatMessage({ id: 'app.node.table.header.creationTime', defaultMessage: 'Creation Time' }),
      dataIndex: 'created_at' as const,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({ id: 'app.node.table.header.status', defaultMessage: 'Status' }),
      dataIndex: 'status' as const,
      render: (text: string) => (
        <Badge status={badgeStatus(text) as 'success' | 'warning' | 'error' | 'default'} text={text?.toLowerCase()} />
      ),
    },
  ];

  return (
    <PageHeaderWrapper
      title={
        <span>
          <NodeIndexOutlined style={{ marginRight: 15 }} />
          {intl.formatMessage({ id: 'app.node.title', defaultMessage: 'Node Management' })}
        </span>
      }
    >
      <Card bordered={false}>
        <div className="mb-4 flex gap-2">
          {userRole !== 'operator' && (
            <Button type="primary" onClick={() => setCreateOpen(true)}>
              <PlusOutlined />
              {intl.formatMessage({ id: 'form.button.new', defaultMessage: 'New' })}
            </Button>
          )}
        </div>
        <StandardTable
          loading={isLoading}
          rowKey="id"
          data={{ list: nodes, pagination }}
          columns={columns}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRows}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        destroyOnClose
        title={intl.formatMessage({ id: 'app.node.new.title', defaultMessage: 'Create Node' })}
        open={createOpen}
        confirmLoading={createNode.isPending}
        onOk={() => createForm.submit()}
        onCancel={() => setCreateOpen(false)}
      >
        <Form form={createForm} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'app.node.new.name', defaultMessage: 'Name' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label={intl.formatMessage({ id: 'app.node.new.type', defaultMessage: 'Type' })}
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="ORDERER">ORDERER</Select.Option>
              <Select.Option value="PEER">PEER</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        destroyOnClose
        title={intl.formatMessage({
          id: 'app.node.table.operation.registerUser',
          defaultMessage: 'Register User',
        })}
        open={registerOpen}
        confirmLoading={registerUser.isPending}
        onOk={() => registerForm.submit()}
        onCancel={() => setRegisterOpen(false)}
      >
        <Form form={registerForm} onFinish={handleRegisterUser} layout="vertical">
          <Form.Item name="name" label="User name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="secret" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="user_type" label="Type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="peer">peer</Select.Option>
              <Select.Option value="orderer">orderer</Select.Option>
              <Select.Option value="user">user</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
}
