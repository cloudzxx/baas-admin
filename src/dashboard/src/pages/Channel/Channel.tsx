import { useEffect, useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Card, Button, Modal, Form, Input, Select, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { useChannels, useCreateChannel, useUpdateChannel } from '@/lib/services';
import { useTableManagement } from '@/hooks/useTableManagement';

export default function ChannelPage() {
  const intl = useIntl();
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateChannelId, setUpdateChannelId] = useState('');
  const [newFile, setFile] = useState<File | null>(null);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const { handleTableChange, refreshList, selectedRows, handleSelectRows } = useTableManagement({
    onList: () => refetch(),
  });

  const { data, isLoading, refetch } = useChannels();
  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();

  const channels = data?.data || [];
  const pagination = { total: data?.total || 0, current: 1, pageSize: 10 };

  useEffect(() => { refetch(); }, [refetch]);

  const handleCreate = useCallback(
    (values: { name: string }) => {
      createChannel.mutate(values, {
        onSuccess: (res) => {
          const result = res as Record<string, unknown>;
          if ((result.status as string)?.toLowerCase() === 'successful') {
            message.success('Create channel succeed');
            createForm.resetFields();
            setCreateOpen(false);
            refetch();
          } else {
            message.error('Create channel failed');
          }
        },
        onError: () => message.error('Create channel failed'),
      });
    },
    [createChannel, createForm, refetch]
  );

  const handleUpdate = useCallback(
    (values: { msp_id: string; org_type: string }) => {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => formData.append(k, v as string));
      if (newFile) formData.append('data', newFile);

      updateChannel.mutate(
        { id: updateChannelId, data: formData },
        {
          onSuccess: () => {
            message.success('Update channel succeed');
            setUpdateOpen(false);
            setFile(null);
            refetch();
          },
          onError: () => message.error('Update channel failed'),
        }
      );
    },
    [updateChannel, updateChannelId, newFile, refetch]
  );

  const columns = [
    {
      title: intl.formatMessage({ id: 'app.channel.table.header.name', defaultMessage: 'Channel Name' }),
      dataIndex: 'name' as const,
    },
  ];

  const uploadProps = {
    onRemove: () => setFile(null),
    beforeUpload: (file: File) => { setFile(file); return false; },
  };

  return (
    <PageHeaderWrapper
      title={
        <span>
          <DeploymentUnitOutlined style={{ marginRight: 15 }} />
          {intl.formatMessage({ id: 'app.channel.title', defaultMessage: 'Channel Management' })}
        </span>
      }
    >
      <Card bordered={false}>
        <div className="mb-4">
          <Button type="primary" onClick={() => { createForm.resetFields(); setCreateOpen(true); }}>
            <PlusOutlined />
            {intl.formatMessage({ id: 'form.button.new', defaultMessage: 'New' })}
          </Button>
        </div>
        <StandardTable
          loading={isLoading}
          rowKey="id"
          data={{ list: channels, pagination }}
          columns={columns}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRows}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        destroyOnClose
        title={intl.formatMessage({
          id: 'app.channel.form.create.header.title',
          defaultMessage: 'Create Channel',
        })}
        open={createOpen}
        confirmLoading={createChannel.isPending}
        onOk={() => createForm.submit()}
        onCancel={() => setCreateOpen(false)}
      >
        <Form form={createForm} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="name"
            label={intl.formatMessage({
              id: 'app.channel.form.create.name',
              defaultMessage: 'Name',
            })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        destroyOnClose
        title={intl.formatMessage({
          id: 'app.channel.form.update.header.title',
          defaultMessage: 'Update Channel',
        })}
        open={updateOpen}
        confirmLoading={updateChannel.isPending}
        onOk={() => updateForm.submit()}
        onCancel={() => { setUpdateOpen(false); setFile(null); }}
      >
        <Form form={updateForm} onFinish={handleUpdate} layout="vertical">
          <Form.Item name="msp_id" label="MSP ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="org_type" label="Org Type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Application">Application</Select.Option>
              <Select.Option value="Orderer">Orderer</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="file" label="Channel config file">
            <Upload {...uploadProps}>
              <Button disabled={!!newFile}>
                <UploadOutlined /> Select file
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
}

