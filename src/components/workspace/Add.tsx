import { Button, Form, Input, Modal, Radio } from 'antd';
import React, { useState } from 'react';

import request from '../../services/request';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Create workspace"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please input the name of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AddWorkspace: React.FC = () => {
  const [open, setOpen] = useState(false);

  const onCreate = (values: any) => {
    request({
      method: 'POST',
      url: '/api/createworkspace',
      data: { name: values.name },
    }).then((res:any) => {
        window.location.href = `/${res._id}/workspace/testname/request/6357a30a1708ec36bd90564d`
    });
  };

  return (
    <div>
      <Button
        type="primary"
        size={'small'}
        onClick={() => {
          setOpen(true);
        }}
      >
        New
      </Button>
      <CollectionCreateForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};

export default AddWorkspace;
