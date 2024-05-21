import { useState, useCallback } from 'react';

export function useModalForm() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMethod, setModalMethod] = useState<'create' | 'update'>('create');
  const [currentRecord, setCurrentRecord] = useState<Record<string, unknown> | null>(null);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setCurrentRecord(null);
  }, []);

  const handleModalVisible = useCallback(
    (visible?: boolean, record?: Record<string, unknown>) => {
      setModalVisible(visible ?? !modalVisible);
      if (record) {
        setCurrentRecord(record);
        setModalMethod('update');
      } else {
        setCurrentRecord(null);
        setModalMethod('create');
      }
    },
    [modalVisible]
  );

  return {
    modalVisible,
    modalMethod,
    currentRecord,
    closeModal,
    handleModalVisible,
    setModalMethod,
  };
}
