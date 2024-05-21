import { useEffect, useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Card, Modal, Input, Form, Button, message } from 'antd';
import { TeamOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { useOrganizations, useCreateOrganization, useUpdateOrganization } from '@/lib/services';
import { useTableManagement } from '@/hooks/useTableManagement';
import type { Organization } from '@/types';

export default function OrganizationPage() {
  const intl = useIntl();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [form] = Form.useForm();

  const { refreshList, handleSelectRows, selectedRows, handleTableChange } = useTableManagement({
    onList: () => refetch(),
  });

  const { data, isLoading, refetch } = useOrganizations();
  const createOrg = useCreateOrganization();
  const updateOrg = useUpdateOrganization();

  const organizations = data?.data || [];
  const pagination = {
    total: data?.total || 0,
    current: 1,
    pageSize: 10,
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSubmit = useCallback(
    (values: { name: string }) => {
      if (editingOrg) {
        updateOrg.mutate(
          { id: editingOrg.id, data: values },
          {
            onSuccess: () => {
              message.success('Update success');
              setModalOpen(false);
              setEditingOrg(null);
              refetch();
            },
          }
        );
      } else {
        createOrg.mutate(values, {
          onSuccess: (res) => {
            if ((res as Record<string, unknown>).id) {
              message.success('Create success');
              setModalOpen(false);
              refetch();
            }
          },
        });
      }
    },
    [editingOrg, createOrg, updateOrg, refetch]
  );

  const columns = [
    {
      title: intl.formatMessage({
        id: 'app.organization.table.header.name',
        defaultMessage: 'Organization Name',
      }),
      dataIndex: 'name' as const,
    },
    {
      title: intl.formatMessage({
        id: 'app.organization.table.header.createTime',
        defaultMessage: 'Create Time',
      }),
      dataIndex: 'created_at' as const,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <PageHeaderWrapper
      title={
        <span>
          <TeamOutlined style={{ marginRight: 15 }} />
          {intl.formatMessage({
            id: 'app.organization.title',
            defaultMessage: 'Organization Management',
          })}
        </span>
      }
    >
      <Card bordered={false}>
        <div className="mb-4">
          <Button type="primary" onClick={() => { setEditingOrg(null); form.resetFields(); setModalOpen(true); }}>
            <PlusOutlined />
            {intl.formatMessage({ id: 'form.button.new', defaultMessage: 'New' })}
          </Button>
        </div>
        <StandardTable
          loading={isLoading}
          rowKey="id"
          data={{ list: organizations, pagination }}
          columns={columns}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRows}
          onChange={handleTableChange}
        />
      </Card>
      <Modal
        destroyOnClose
        title={intl.formatMessage({
          id: editingOrg ? 'app.organization.form.update.title' : 'app.organization.form.new.title',
          defaultMessage: editingOrg ? 'Update Organization' : 'New Organization',
        })}
        open={modalOpen}
        confirmLoading={createOrg.isPending || updateOrg.isPending}
        onOk={() => form.submit()}
        onCancel={() => { setModalOpen(false); setEditingOrg(null); }}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={{ name: editingOrg?.name || '' }}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label={intl.formatMessage({
              id: 'app.organization.form.name.label',
              defaultMessage: 'Organization Name',
            })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'form.input.placeholder' })} />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
}
