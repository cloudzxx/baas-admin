import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Card, Button, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { PlusOutlined, FireOutlined } from '@ant-design/icons';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { useFiscoGroups, useCreateFiscoGroup } from '@/lib/services';
import { useTableManagement } from '@/hooks/useTableManagement';

export default function FiscoPage() {
  const intl = useIntl();
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { handleTableChange, selectedRows, handleSelectRows } = useTableManagement({
    onList: () => refetch(),
  });

  const { data, isLoading, refetch } = useFiscoGroups();
  const createGroup = useCreateFiscoGroup();

  const groups = data?.data || [];
  const pagination = { total: data?.total || 0, current: 1, pageSize: 10 };

  useEffect(() => { refetch(); }, [refetch]);

  const handleCreate = (values: Record<string, unknown>) => {
    createGroup.mutate(values, {
      onSuccess: () => {
        message.success(intl.formatMessage({ id: 'app.fisco.create.success', defaultMessage: 'Create FISCO node succeed' }));
        form.resetFields();
        setModalOpen(false);
        refetch();
      },
      onError: () => {
        message.error(intl.formatMessage({ id: 'app.fisco.create.fail', defaultMessage: 'Create FISCO node failed' }));
      },
    });
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'app.fisco.table.header.name', defaultMessage: 'Name' }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'app.fisco.table.header.type', defaultMessage: 'Type' }),
      dataIndex: 'type',
      render: (text: string) => text?.toLowerCase(),
    },
    {
      title: intl.formatMessage({ id: 'app.fisco.table.header.groupId', defaultMessage: 'Group ID' }),
      dataIndex: 'group_id',
    },
    {
      title: intl.formatMessage({ id: 'app.fisco.table.header.chainId', defaultMessage: 'Chain ID' }),
      dataIndex: 'chain_id',
    },
    {
      title: intl.formatMessage({ id: 'app.fisco.table.header.status', defaultMessage: 'Status' }),
      dataIndex: 'status',
      render: (text: string) => text?.toLowerCase(),
    },
    {
      title: intl.formatMessage({ id: 'app.fisco.table.header.createTime', defaultMessage: 'Create Time' }),
      dataIndex: 'created_at',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <PageHeaderWrapper
      title={
        <span>
          <FireOutlined style={{ marginRight: 15 }} />
          {intl.formatMessage({ id: 'app.fisco.title', defaultMessage: 'FISCO BCOS Management' })}
        </span>
      }
    >
      <Card bordered={false}>
        <div className="mb-4">
          <Button type="primary" onClick={() => { form.resetFields(); setModalOpen(true); }}>
            <PlusOutlined />
            {intl.formatMessage({ id: 'form.button.new', defaultMessage: 'New' })}
          </Button>
        </div>
        <StandardTable
          loading={isLoading}
          rowKey="id"
          data={{ list: groups, pagination }}
          columns={columns}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRows}
          onChange={handleTableChange}
        />
      </Card>
      <Modal
        destroyOnClose
        title={intl.formatMessage({ id: 'app.fisco.form.new.title', defaultMessage: 'Create FISCO Node' })}
        open={modalOpen}
        confirmLoading={createGroup.isPending}
        onOk={() => form.submit()}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'app.fisco.form.name', defaultMessage: 'Node Name' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label={intl.formatMessage({ id: 'app.fisco.form.role', defaultMessage: 'Role' })}
            rules={[{ required: true }]}
            initialValue="GROUP_NODE"
          >
            <Select>
              <Select.Option value="GROUP_NODE">GROUP_NODE</Select.Option>
              <Select.Option value="OBSERVER">OBSERVER</Select.Option>
              <Select.Option value="FREEZER">FREEZER</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="group_id"
            label={intl.formatMessage({ id: 'app.fisco.form.groupId', defaultMessage: 'Group ID' })}
            initialValue={1}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="chain_id"
            label={intl.formatMessage({ id: 'app.fisco.form.chainId', defaultMessage: 'Chain ID' })}
            initialValue={1}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
}
