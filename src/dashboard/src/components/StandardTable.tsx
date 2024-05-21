import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Pagination } from '@/types';

interface Props {
  loading?: boolean;
  data: { list: unknown[]; pagination: Pagination };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnsType<any>;
  rowKey?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedRows?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectRow?: (rows: any[]) => void;
  onChange?: (pagination: { current: number; pageSize: number }, filters: unknown, sorter: unknown) => void;
}

export default function StandardTable({
  loading,
  data,
  columns,
  rowKey = 'id',
  selectedRows,
  onSelectRow,
  onChange,
}: Props) {
  const { list, pagination } = data;

  return (
    <div className="table-list">
      <Table
        loading={loading}
        rowKey={rowKey as string}
        dataSource={list}
        columns={columns}
        pagination={{
          total: pagination.total,
          current: pagination.current,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total}`,
        }}
        rowSelection={
          onSelectRow
            ? {
                selectedRowKeys: selectedRows?.map((r) => r[rowKey as string] as React.Key) || [],
                onChange: (_keys, rows) => onSelectRow(rows),
              }
            : undefined
        }
        onChange={(pag, filters, sorter) => {
          if (onChange) {
            onChange(
              { current: pag.current || 1, pageSize: pag.pageSize || 10 },
              filters,
              sorter
            );
          }
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}
