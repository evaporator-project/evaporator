import { useRequest } from 'ahooks';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useParams } from 'react-router-dom';

import request from '../../services/request';

const WorkspacePane = ({ pane }: any) => {
  const onFinish = (values: any) => {
    request({
      method: 'POST',
      url: '/api/updateworkspace',
      data: { id: params.workspaceId, name: values.name },
    }).then((res) => {
      message.success(JSON.stringify(res));
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const params = useParams();

  const { run, data }:any = useRequest(
    () =>
      request({
        method: 'POST',
        url: '/api/retrieveworkspace',
        data: { workspaceId: params.workspaceId },
      }),
    {
      onSuccess(res) {
        console.log(res);
      },
    }
  );

  return (
    <div>
      {data ? (
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ name: data.name }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              danger
              onClick={() => {
                request({
                  method: 'POST',
                  url: '/api/deleteworkspace',
                  data: { workspaceId: params.workspaceId },
                }).then((res) => {
                  message.success(JSON.stringify(res));
                  request({
                    method: 'POST',
                    url: '/api/listworkspace',
                  }).then((res: any) => {
                    location.href = `/${res[0]._id}/workspace/${res[0].name}/workspace/overview`;
                  });
                });
              }}
            >
              删除
            </Button>
          </Form.Item>
        </Form>
      ) : null}
    </div>
  );
};

export default WorkspacePane;
