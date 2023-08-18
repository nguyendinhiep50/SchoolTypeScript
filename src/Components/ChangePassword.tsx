import React, { useState } from 'react';
import axios from "axios";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
const App: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };
  const [DataPost, setDataPost] = useState({
    loginEmail: "",
    passWorld: "",
  });
  const [newPassword, setnewPassword] = useState('');
  const handleChangePass = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newdataPass = event.target.value;
    setnewPassword(newdataPass);
  };
  const handleNewPassword = async () => {
    axios
      .put(
        "https://localhost:7232/api/Managements/ChangePassword?newpassword=" + newPassword,
        DataPost
      )
      .then((response) => { alert("ChangePassword Succes") })
      .catch((err) => {
        alert("Fail Changepassword");
      });
  };
  const handleLoginEmail = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    // Sử dụng React.ChangeEvent<HTMLInputElement> để chỉ định kiểu dữ liệu cho event
    if (event) {
      const newPassWorld = event.target.value;
      setDataPost((prevData) => ({
        ...prevData,
        loginEmail: newPassWorld,
      }));
    }
  };
  const handlePassWorld = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    // Sử dụng React.ChangeEvent<HTMLInputElement> để chỉ định kiểu dữ liệu cho event
    if (event) {
      const newPassWorld = event.target.value;
      setDataPost((prevData) => ({
        ...prevData,
        passWorld: newPassWorld,
      }));
    }
  };
  return (
    <>
      <h1>Change Password</h1>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} onBlur={handleLoginEmail} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            onBlur={handlePassWorld}
          />
        </Form.Item>
        <Form.Item
          name="newpassword"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="New password"
            onBlur={handleChangePass}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleNewPassword}  >
            Update Password
          </Button>

        </Form.Item>
      </Form>
    </>

  );
};

export default App;