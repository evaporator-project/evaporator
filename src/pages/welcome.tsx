import {Button, Checkbox, Form, Input, message} from 'antd';
import React from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Welcome: React.FC = () => {
  const nav = useNavigate()
  const onFinish = (values: any) => {
    console.log('Success:', values);
    axios.post('/api/passwordlogin',values).then(res=>{
      console.log(res)
      if (res.data.token){
        localStorage.setItem('token',res.data.token)
        nav('/main')
        message.success('登录成功')
      }
    })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Welcome;
