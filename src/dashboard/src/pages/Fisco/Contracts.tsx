import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Card, Button, Modal, Form, Input, Select, message, Tabs } from 'antd';
import { CodeOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { useFiscoContracts, useDeployFiscoContract, useCallFiscoContract, useFiscoGroups } from '@/lib/services';
import { useTableManagement } from '@/hooks/useTableManagement';

export default function FiscoContractsPage() {
  const intl = useIntl();
  const [deployOpen, setDeployOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [callContract, setCallContract] = useState<Record<string, unknown> | null>(null);
  const [callResult, setCallResult] = useState<string | null>(null);
  const [deployForm] = Form.useForm();
  const [callForm] = Form.useForm();

  const { handleTableChange, selectedRows, handleSelectRows, refreshList } = useTableManagement({
    onList: () => refetch(),
  });

  const { data, isLoading, refetch } = useFiscoContracts();
  const { data: groupsData } = useFiscoGroups();
  const deployMutation = useDeployFiscoContract();
  const callMutation = useCallFiscoContract();

  const contracts = data?.data || [];
  const nodes = (groupsData?.data || []).map((g: Record<string, unknown>) => ({
    name: g.name,
    node_name: g.name,
  }));

  useEffect(() => { refetch(); }, [refetch]);

  const handleDeploy = (values: Record<string, unknown>) => {
    deployMutation.mutate(values, {
      onSuccess: () => {
        message.success(intl.formatMessage({ id: 'app.fisco.contract.deploy.success', defaultMessage: 'Contract deployed successfully' }));
        deployForm.resetFields();
        setDeployOpen(false);
        refetch();
      },
      onError: () => {
        message.error(intl.formatMessage({ id: 'app.fisco.contract.deploy.fail', defaultMessage: 'Contract deployment failed' }));
      },
    });
  };

  const handleCall = (values: Record<string, unknown>) => {
    const payload = {
      ...values,
      address: callContract?.address,
      args: (values.args as string || '').split(',').map((s: string) => s.trim()).filter(Boolean),
    };
    callMutation.mutate(payload, {
      onSuccess: (res) => {
        setCallResult(JSON.stringify(res, null, 2));
      },
      onError: () => {
        message.error('Contract call failed');
      },
    });
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'app.fisco.contract.table.header.address', defaultMessage: 'Contract Address' }),
      dataIndex: 'address',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'app.fisco.contract.table.header.name', defaultMessage: 'Contract Name' }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'app.fisco.contract.table.header.owner', defaultMessage: 'Owner' }),
      dataIndex: 'owner',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'app.fisco.contract.table.header.node', defaultMessage: 'Node' }),
      dataIndex: 'node_name',
    },
    {
      title: intl.formatMessage({ id: 'app.fisco.contract.table.header.createTime', defaultMessage: 'Create Time' }),
      dataIndex: 'created_at',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({ id: 'form.table.header.operation', defaultMessage: 'Operation' }),
      render: (_: unknown, record: Record<string, unknown>) => (
        <a onClick={() => { setCallContract(record); setCallResult(null); callForm.resetFields(); setCallOpen(true); }}>
          {intl.formatMessage({ id: 'app.fisco.contract.call.title', defaultMessage: 'Call' })}
        </a>
      ),
    },
  ];

  return (
    <PageHeaderWrapper
      title={
        <span>
          <CodeOutlined style={{ marginRight: 15 }} />
          {intl.formatMessage({ id: 'app.fisco.contract.title', defaultMessage: 'Contracts' })}
        </span>
      }
    >
      <Card bordered={false}>
        <div className="mb-4">
          <Button type="primary" onClick={() => { deployForm.resetFields(); setDeployOpen(true); }}>
            <PlusOutlined />
            {intl.formatMessage({ id: 'app.fisco.contract.deploy.title', defaultMessage: 'Deploy Contract' })}
          </Button>
        </div>
        <StandardTable
          loading={isLoading}
          rowKey="address"
          data={{ list: contracts, pagination: { total: 0, current: 1, pageSize: 10 } }}
          columns={columns}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRows}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        destroyOnClose
        title={intl.formatMessage({ id: 'app.fisco.contract.deploy.title', defaultMessage: 'Deploy Contract' })}
        open={deployOpen}
        confirmLoading={deployMutation.isPending}
        onOk={() => deployForm.submit()}
        onCancel={() => setDeployOpen(false)}
        width={600}
      >
        <Form form={deployForm} onFinish={handleDeploy} layout="vertical">
          <Form.Item name="name" label="Contract Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="node_name" label="Target Node" rules={[{ required: true }]}>
            <Select>
              {nodes.map((n: Record<string, unknown>) => (
                <Select.Option key={n.name as string} value={n.name as string}>
                  {n.name as string}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="bytecode" label="Bytecode (hex)" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="0x..." />
          </Form.Item>
          <Form.Item name="abi" label="ABI (JSON, optional)">
            <Input.TextArea rows={6} placeholder='[{"inputs":[],"name":"get","outputs":[...]}]' />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        destroyOnClose
        title={intl.formatMessage({ id: 'app.fisco.contract.call.title', defaultMessage: 'Call Contract' })}
        open={callOpen}
        confirmLoading={callMutation.isPending}
        onOk={() => callForm.submit()}
        onCancel={() => { setCallOpen(false); setCallResult(null); }}
        width={600}
      >
        <p className="mb-2 text-sm text-gray-500">
          Contract: {callContract?.address as string}
        </p>
        <Form form={callForm} onFinish={handleCall} layout="vertical">
          <Form.Item name="function_name" label="Function" rules={[{ required: true }]}>
            <Input placeholder="e.g. get" />
          </Form.Item>
          <Form.Item name="abi" label="ABI (JSON)" rules={[{ required: true }]}>
            <Input.TextArea rows={6} placeholder='[{"inputs":[],"name":"get","outputs":[...]}]' />
          </Form.Item>
          <Form.Item name="args" label="Arguments (comma-separated, optional)">
            <Input placeholder="e.g. 1, 0xabc" />
          </Form.Item>
          <Form.Item name="is_write" label="Write transaction" valuePropName="checked">
            <Select>
              <Select.Option value={false as unknown as string}>Read (eth_call)</Select.Option>
              <Select.Option value={true as unknown as string}>Write (sendTransaction)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
        {callResult && (
          <div className="mt-4">
            <h4>Result:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-40">{callResult}</pre>
          </div>
        )}
      </Modal>
    </PageHeaderWrapper>
  );
}
