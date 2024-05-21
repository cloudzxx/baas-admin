import { useState, useCallback } from 'react';

interface UseTableManagementOptions {
  onList: (params?: Record<string, unknown>) => void;
}

export function useTableManagement({ onList }: UseTableManagementOptions) {
  const [selectedRows, setSelectedRows] = useState<Record<string, unknown>[]>([]);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  const handleSelectRows = useCallback((rows: Record<string, unknown>[]) => {
    setSelectedRows(rows);
  }, []);

  const clearSelectedRows = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const handleTableChange = useCallback(
    (pagination: { current: number; pageSize: number }, _filters: unknown, sorter: unknown) => {
      const params: Record<string, unknown> = {
        page: pagination.current,
        per_page: pagination.pageSize,
        ...formValues,
      };
      if (sorter && (sorter as Record<string, unknown>).field) {
        params.sortField = (sorter as Record<string, unknown>).field;
        params.sortOrder = (sorter as Record<string, unknown>).order;
      }
      onList(params);
    },
    [onList, formValues]
  );

  const handleFormReset = useCallback(() => {
    setFormValues({});
    onList();
  }, [onList]);

  const refreshList = useCallback(
    (extraParams: Record<string, unknown> = {}) => {
      onList({ ...formValues, ...extraParams });
    },
    [onList, formValues]
  );

  return {
    selectedRows,
    formValues,
    setSelectedRows,
    setFormValues,
    handleSelectRows,
    handleTableChange,
    handleFormReset,
    clearSelectedRows,
    refreshList,
  };
}
