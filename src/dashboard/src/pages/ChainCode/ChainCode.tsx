import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Card, Button, Badge, message } from 'antd';
import { PlusOutlined, FunctionOutlined } from '@ant-design/icons';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import UploadForm from './forms/UploadForm';
import { useChainCodes, useInstallChainCode, useApproveChainCode, useCommitChainCode } from '@/lib/services';
import { useTableManagement } from '@/hooks/useTableManagement';
import type { ChainCode } from '@/types';

const statusBadge = (status: string) => {
  const map: Record<string, 'default' | 'success' | 'error'> = {
    CREATED: 'default',
    INSTALLED: 'success',
    APPROVED: 'success',
    COMMITTED: 'success',
  };
  return map[status] || 'default';
};

const statusLabels: Record<string, { id: string; default: string }> = {
  CREATED: { id: 'app.chainCode.status.created', default: 'Created' },
  INSTALLED: { id: 'app.chainCode.status.installed', default: 'Installed' },
  APPROVED: { id: 'app.chainCode.status.approved', default: 'Approved' },
  COMMITTED: { id: 'app.chainCode.status.committed', default: 'Committed' },
};

export default function ChainCodePage() {
  const intl = useIntl();
  const [uploadOpen, setUploadOpen] = useState(false);

  const { handleTableChange, selectedRows, handleSelectRows } = useTableManagement({
    onList: () => refetch(),
  });

  const { data, isLoading, refetch } = useChainCodes();
  const installMutation = useInstallChainCode();
  const approveMutation = useApproveChainCode();
  const commitMutation = useCommitChainCode();

  const chainCodes = (data?.data || []) as ChainCode[];

  useEffect(() => { refetch(); }, [refetch]);

  const withLoading = (mutation: { isPending: boolean }, action: () => void) => {
    if (!mutation.isPending) action();
  };

  const doInstall = (id: string) => {
    installMutation.mutate(id, {
      onSuccess: () => { message.success('Install successful'); refetch(); },
      onError: () => { message.error('Install failed'); },
    });
  };

  const doApprove = (id: string) => {
    approveMutation.mutate(id, {
      onSuccess: () => { message.success('Approve successful'); refetch(); },
      onError: () => { message.error('Approve failed'); },
    });
  };

  const doCommit = (id: string) => {
    commitMutation.mutate(id, {
      onSuccess: () => { message.success('Commit successful'); refetch(); },
      onError: () => { message.error('Commit failed'); },
    });
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'app.chainCode.table.header.packageID', defaultMessage: 'PackageID' }),
      dataIndex: 'package_id',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'app.chainCode.table.header.version', defaultMessage: 'Version' }),
      dataIndex: 'version',
    },
    {
      title: intl.formatMessage({ id: 'app.chainCode.table.header.language', defaultMessage: 'Chaincode Language' }),
      dataIndex: 'language',
    },
    {
      title: intl.formatMessage({ id: 'app.chainCode.table.header.description', defaultMessage: 'Description' }),
      dataIndex: 'description',
    },
    {
      title: intl.formatMessage({ id: 'app.chainCode.table.header.status', defaultMessage: 'Status' }),
      dataIndex: 'status',
      render: (status: string) => {
        const label = statusLabels[status] || { id: '', default: status };
        return (
          <Badge
            status={statusBadge(status)}
            text={intl.formatMessage({ id: label.id, defaultMessage: label.default })}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'app.chainCode.table.header.approvals', defaultMessage: 'Approvals' }),
      dataIndex: 'approvals',
      render: (approvals: Record<string, boolean>) => {
        if (!approvals || typeof approvals !== 'object') return '0/0';
        const keys = Object.keys(approvals);
        const approved = keys.filter((k) => approvals[k]).length;
        return `${approved}/${keys.length}`;
      },
    },
    {
      title: intl.formatMessage({ id: 'form.table.header.operation', defaultMessage: 'Operation' }),
      render: (_: unknown, record: ChainCode) => {
        if (record.status === 'CREATED') {
          const busy = installMutation.isPending;
          return (
            <a
              onClick={() => withLoading(installMutation, () => doInstall(record.id))}
              className={busy ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            >
              {busy ? 'Installing...' : 'Install'}
            </a>
          );
        }
        if (record.status === 'INSTALLED') {
          const busy = approveMutation.isPending;
          return (
            <a
              onClick={() => withLoading(approveMutation, () => doApprove(record.id))}
              className={busy ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            >
              {busy ? 'Approving...' : 'Approve'}
            </a>
          );
        }
        if (record.status === 'APPROVED') {
          const busy = commitMutation.isPending;
          return (
            <a
              onClick={() => withLoading(commitMutation, () => doCommit(record.id))}
              className={busy ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            >
              {busy ? 'Committing...' : 'Commit'}
            </a>
          );
        }
        return null;
      },
    },
  ];

  return (
    <PageHeaderWrapper
      title={
        <span>
          <FunctionOutlined style={{ marginRight: 15 }} />
          {intl.formatMessage({ id: 'app.chainCode.title', defaultMessage: 'Chaincode Management' })}
        </span>
      }
    >
      <Card bordered={false}>
        <div className="mb-4">
          <Button type="primary" onClick={() => setUploadOpen(true)}>
            <PlusOutlined />
            {intl.formatMessage({ id: 'form.button.new', defaultMessage: 'New' })}
          </Button>
        </div>
        <StandardTable
          loading={isLoading}
          rowKey="id"
          data={{ list: chainCodes, pagination: { total: 0, current: 1, pageSize: 10 } }}
          columns={columns}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRows}
          onChange={handleTableChange}
        />
      </Card>
      <UploadForm open={uploadOpen} onClose={() => setUploadOpen(false)} onSuccess={refetch} />
    </PageHeaderWrapper>
  );
}
