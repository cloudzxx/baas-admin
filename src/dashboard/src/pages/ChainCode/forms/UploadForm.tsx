import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useUploadChainCode } from '@/lib/services';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadForm({ open, onClose, onSuccess }: Props) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const upload = useUploadChainCode();

  const handleSubmit = (values: Record<string, unknown>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.append(k, v as string));
    if (file) formData.append('file', file);

    upload.mutate(formData, {
      onSuccess: () => {
        message.success('Upload chaincode succeed');
        form.resetFields();
        setFile(null);
        onClose();
        onSuccess();
      },
      onError: () => message.error('Upload chaincode failed'),
    });
  };

  const uploadProps = {
    onRemove: () => setFile(null),
    beforeUpload: (f: File) => { setFile(f); return false; },
  };

  return (
    <Modal
      destroyOnClose
      title={intl.formatMessage({
        id: 'app.chainCode.upload.title',
        defaultMessage: 'Upload Chaincode',
      })}
      open={open}
      confirmLoading={upload.isPending}
      onOk={() => form.submit()}
      onCancel={onClose}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" label="Chaincode Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="version" label="Version" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="language" label="Language" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="file" label="Chaincode File" rules={[{ required: true }]}>
          <Upload {...uploadProps}>
            <Button disabled={!!file}>
              <UploadOutlined /> Select file
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
